const fs = require('fs');
let content = fs.readFileSync('backend/src/services/paymentService.ts', 'utf8');

content = content.replace(/import \{ config \} from '\.\.\/config\/env';/, `import { config } from '../config/env';\nimport { triggerBookingConfirmedNotifications } from './notificationService';`);

// Inside verifyPaymentService, after booking status is updated to confirmed:
content = content.replace(/if \(bookingUpdateError\) throw new Error\('Failed to update booking status'\);\n\n  return booking;/, `if (bookingUpdateError) throw new Error('Failed to update booking status');\n\n  // Trigger notifications silently in background\n  triggerBookingConfirmedNotifications(booking).catch(console.error);\n\n  return booking;`);

// Add webhook processing service
content += `\n
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
`;

fs.writeFileSync('backend/src/services/paymentService.ts', content);
