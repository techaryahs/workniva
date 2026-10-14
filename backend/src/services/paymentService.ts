import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';
import { triggerBookingConfirmedNotifications } from './notificationService';
import { supabase } from '../config/database';

const getRazorpayInstance = () => {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are not configured on the server.');
  }

  return new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret,
  });
};

export const createPaymentOrderService = async (userId: string, bookingId: string) => {
  const razorpay = getRazorpayInstance();

  // 1. Fetch booking with customer ownership check
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();

  if (bookingError || !booking) {
    throw new Error('Booking not found or access denied.');
  }

  if (booking.status === 'confirmed' || booking.status === 'completed') {
    throw new Error('Booking is already confirmed.');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Cannot create payment order for a cancelled booking.');
  }

  // 2. Validate amount in paise
  const amountNumber = Number(booking.amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    throw new Error('Invalid booking amount.');
  }

  const amountInPaise = Math.round(amountNumber * 100);

  // 3. Create Razorpay Order
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: booking.booking_code,
    notes: {
      booking_id: booking.id,
      user_id: userId,
      booking_code: booking.booking_code,
    }
  });

  // 4. Save payment record in DB
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
    console.error('Failed to create payment record in database:', {
      message: paymentError.message,
      code: paymentError.code,
      details: paymentError.details,
    });
    throw new Error('Failed to record payment order: ' + paymentError.message);
  }

  // 5. Update booking status to pending_payment if not already
  if (booking.status !== 'pending_payment') {
    await supabase.from('bookings').update({
      status: 'pending_payment',
      updated_at: new Date().toISOString()
    }).eq('id', booking.id);
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

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
    throw new Error('Missing required verification fields');
  }

  // 1. Verify cryptographic signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(body)
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    // Record failed payment attempt
    await supabase
      .from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('provider_order_id', razorpay_order_id);

    throw new Error('Invalid payment signature verification failed');
  }

  // 2. Validate Order & Booking Association & Ownership
  const { data: paymentRecord, error: payRecordError } = await supabase
    .from('payments')
    .select('*')
    .eq('provider_order_id', razorpay_order_id)
    .maybeSingle();

  if (payRecordError || !paymentRecord) {
    throw new Error('Payment record not found for this order.');
  }

  if (paymentRecord.booking_id !== booking_id) {
    throw new Error('Security alert: Payment order does not match booking ID.');
  }

  if (paymentRecord.user_id !== userId) {
    throw new Error('Unauthorized: Payment order does not belong to current user.');
  }

  // 3. Check existing booking (Idempotency check)
  const { data: existingBooking, error: fetchBookingError } = await supabase
    .from('bookings')
    .select('*, profiles(*)')
    .eq('id', booking_id)
    .eq('user_id', userId)
    .single();

  if (fetchBookingError || !existingBooking) {
    throw new Error('Associated booking not found.');
  }

  if (existingBooking.status === 'confirmed' || existingBooking.status === 'completed') {
    console.log(`[PAYMENT VERIFY] Booking ${booking_id} already confirmed. Returning existing record.`);
    return {
      ...existingBooking,
      payment_mode: 'razorpay',
      payment_status: 'paid',
      payment_required: true,
      testing_mode: false
    };
  }

  // 4. Update payment record to captured
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({
      provider_payment_id: razorpay_payment_id,
      provider_signature: razorpay_signature,
      status: 'captured',
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentRecord.id);

  if (paymentUpdateError) {
    console.error('Failed to update payment status to captured:', paymentUpdateError);
    throw new Error('Failed to update payment status');
  }

  // 5. Update booking status to confirmed
  const { data: confirmedBooking, error: bookingUpdateError } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      updated_at: new Date().toISOString()
    })
    .eq('id', booking_id)
    .eq('user_id', userId)
    .select('*, profiles(*)')
    .single();

  if (bookingUpdateError || !confirmedBooking) {
    console.error('Critical: Payment captured but booking confirmation failed:', bookingUpdateError);
    throw new Error('Payment was captured but booking status update failed. Please contact support.');
  }

  // 6. Trigger confirmation notifications
  triggerBookingConfirmedNotifications(confirmedBooking).catch(err => {
    console.error('[NOTIFICATION ERROR]:', err.message);
  });

  return {
    ...confirmedBooking,
    payment_mode: 'razorpay',
    payment_status: 'paid',
    payment_required: true,
    testing_mode: false
  };
};

export const getPaymentByBookingIdService = async (userId: string, bookingId: string, isAdmin: boolean = false) => {
  let query = supabase.from('payments').select('*').eq('booking_id', bookingId);

  if (!isAdmin) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const processWebhookService = async (signature: string, payloadStr: string) => {
  if (!config.razorpayWebhookSecret || config.razorpayWebhookSecret === 'your_webhook_secret') {
    console.warn('[WEBHOOK WARNING] RAZORPAY_WEBHOOK_SECRET is not configured or is placeholder.');
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured on the server');
  }

  // Cryptographic signature check on exact raw payload
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayWebhookSecret)
    .update(payloadStr)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature verification failed');
  }

  const payload = JSON.parse(payloadStr);
  const paymentEntity = payload.payload?.payment?.entity;
  const orderEntity = payload.payload?.order?.entity;

  const entityId = paymentEntity?.id || orderEntity?.id || Date.now().toString();
  const idempotencyKey = `${payload.event}_${entityId}`;

  // Check if this webhook event was already processed
  const { data: existingEvent } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('event_id', idempotencyKey)
    .maybeSingle();

  if (existingEvent) {
    console.log('[WEBHOOK IDEMPOTENT] Event already processed:', idempotencyKey);
    return { success: true, message: 'Already processed' };
  }

  // Record webhook event
  await supabase.from('webhook_events').insert({
    provider: 'razorpay',
    event_id: idempotencyKey,
    event_type: payload.event,
    payload: payload
  });

  // Handle successful payment events
  if (payload.event === 'payment.captured' || payload.event === 'payment.authorized' || payload.event === 'order.paid') {
    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      console.warn('[WEBHOOK] No order ID found in payload');
      return { success: true, message: 'No order ID in payload' };
    }

    // Find payment record
    const { data: payment } = await supabase
      .from('payments')
      .select('*, bookings(*, profiles(*))')
      .eq('provider_order_id', orderId)
      .maybeSingle();

    if (!payment) {
      console.warn('[WEBHOOK] Payment record not found for order:', orderId);
      return { success: true, message: 'Payment record not found' };
    }

    if (payment.status !== 'captured') {
      await supabase
        .from('payments')
        .update({
          status: 'captured',
          provider_payment_id: paymentId || payment.provider_payment_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id);
    }

    // Reconcile and confirm booking if not yet confirmed
    if (payment.bookings && payment.bookings.status !== 'confirmed' && payment.bookings.status !== 'completed') {
      const { data: booking, error: confirmError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.bookings.id)
        .select('*, profiles(*)')
        .single();

      if (!confirmError && booking) {
        console.log(`[WEBHOOK SUCCESS] Confirmed booking ${booking.booking_code} via webhook.`);
        triggerBookingConfirmedNotifications(booking).catch(console.error);
      }
    }
  } else if (payload.event === 'payment.failed') {
    const orderId = paymentEntity?.order_id;
    if (orderId) {
      await supabase
        .from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('provider_order_id', orderId);
    }
  }

  return { success: true };
};
