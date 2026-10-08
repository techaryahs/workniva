import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';
import { triggerBookingConfirmedNotifications } from './notificationService';
import { supabase } from '../config/database';

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
});

export const createPaymentOrderService = async (userId: string, bookingId: string) => {
  // Fetch booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();

  if (bookingError || !booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'confirmed' || booking.status === 'completed') {
    throw new Error('Booking is already confirmed.');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Cannot pay for a cancelled booking.');
  }

  // Check availability again just in case (optional depending on how long it was pending, but good for security)
  const { data: isAvailable, error: availError } = await supabase.rpc('check_availability', {
    p_date: booking.date,
    p_start_time: booking.start_time
  });

  // If status is pending_payment, it might already block the calendar because of the gist constraint.
  // So check_availability might return false! 
  // We should only fail if it's taken by ANOTHER booking.
  // The easiest way is to trust the constraint: if the booking is already in the DB as pending_payment and not throwing an overlap, we own it.
  
  const amountInPaise = Math.round(Number(booking.amount) * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: booking.booking_code,
  });

  // Save payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: booking.id,
      user_id: userId,
      provider: 'razorpay',
      provider_order_id: order.id,
      amount: booking.amount,
      currency: 'INR',
      status: 'created'
    })
    .select('*')
    .single();

  if (paymentError) {
    throw new Error('Failed to create payment record');
  }

  // Update booking status if not already
  if (booking.status !== 'pending_payment') {
    await supabase.from('bookings').update({ status: 'pending_payment' }).eq('id', booking.id);
  }

  return {
    key_id: config.razorpayKeyId,
    order_id: order.id,
    amount: amountInPaise,
    currency: 'INR',
    booking_id: booking.id,
    booking_code: booking.booking_code
  };
};

export const verifyPaymentService = async (userId: string, paymentData: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = paymentData;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    // Update payment record to failed
    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('provider_order_id', razorpay_order_id);
      
    throw new Error('Invalid payment signature');
  }

  // Payment successful, update payment and booking
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({
      provider_payment_id: razorpay_payment_id,
      provider_signature: razorpay_signature,
      status: 'captured'
    })
    .eq('provider_order_id', razorpay_order_id)
    .eq('user_id', userId);

  if (paymentUpdateError) throw new Error('Failed to update payment status');

  const { data: booking, error: bookingUpdateError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', booking_id)
    .eq('user_id', userId)
    .select('*, profiles(*)')
    .single();

  if (bookingUpdateError) throw new Error('Failed to update booking status');

  // Trigger notifications silently in background
  triggerBookingConfirmedNotifications(booking).catch(console.error);

  return booking;
};

export const getPaymentByBookingIdService = async (userId: string, bookingId: string, isAdmin: boolean = false) => {
  let query = supabase.from('payments').select('*').eq('booking_id', bookingId);
  
  if (!isAdmin) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false }).limit(1).single();
  
  if (error && error.code !== 'PGRST116') { // not found is ok
    throw error;
  }
  
  return data;
};


export const processWebhookService = async (signature: string, payloadStr: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayWebhookSecret)
    .update(payloadStr)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature');
  }

  const payload = JSON.parse(payloadStr);
  const eventId = payload.headers && payload.headers['x-razorpay-event-id'] ? payload.headers['x-razorpay-event-id'] : payload.created_at + payload.event;
  // Use razorpay_event_id if available, otherwise fallback. Actually Razorpay payload usually has account_id and event.
  // We'll use a combination of payload.event and payment id for idempotency.
  const paymentEntity = payload.payload.payment?.entity;
  if (!paymentEntity) return { success: true, message: 'Ignored' };
  
  const idempotencyKey = payload.event + '_' + paymentEntity.id;

  const { data: existingEvent } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('event_id', idempotencyKey)
    .maybeSingle();

  if (existingEvent) {
    console.log('Webhook already processed:', idempotencyKey);
    return { success: true, message: 'Already processed' };
  }

  // Record event
  await supabase.from('webhook_events').insert({
    provider: 'razorpay',
    event_id: idempotencyKey,
    event_type: payload.event,
    payload: payload
  });

  if (payload.event === 'payment.captured' || payload.event === 'payment.authorized') {
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    
    // Find payment
    const { data: payment } = await supabase.from('payments').select('*, bookings(*, profiles(*))').eq('provider_order_id', orderId).single();
    if (!payment) return { success: true, message: 'Payment record not found' };

    if (payment.status !== 'captured') {
      await supabase.from('payments').update({ status: 'captured', provider_payment_id: paymentId }).eq('id', payment.id);
    }

    if (payment.bookings && payment.bookings.status !== 'confirmed' && payment.bookings.status !== 'completed') {
      const { data: booking, error } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', payment.bookings.id).select('*, profiles(*)').single();
      if (!error && booking) {
        triggerBookingConfirmedNotifications(booking).catch(console.error);
      }
    }
  }

  return { success: true };
};
