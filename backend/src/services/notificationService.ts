import { supabase } from '../config/database';
import { sendEmail } from './emailService';
import { sendWhatsApp } from './whatsappService';
import { config } from '../config/env';

export const createNotificationJob = async (params: {
  userId: string;
  bookingId: string;
  type: string;
  channel: string;
  recipient: string;
  subject?: string;
  payload?: any;
}) => {
  // Check for idempotency: have we already sent/queued this exact notification?
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('booking_id', params.bookingId)
    .eq('type', params.type)
    .eq('channel', params.channel)
    .maybeSingle();

  if (existing) {
    console.log(`Notification ${params.type} via ${params.channel} for booking ${params.bookingId} already exists. Skipping.`);
    return;
  }

  // Insert pending notification
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: params.userId,
      booking_id: params.bookingId,
      type: params.type,
      channel: params.channel,
      recipient: params.recipient,
      subject: params.subject,
      status: 'pending'
    })
    .select('*')
    .single();

  if (error || !notification) {
    console.error('Failed to insert notification job:', error);
    return;
  }

  // Process asynchronously
  processNotification(notification.id, params.payload).catch(console.error);
};

const processNotification = async (notificationId: string, payload: any) => {
  const { data: notification } = await supabase
    .from('notifications')
    .select('*, bookings(*, profiles(*))')
    .eq('id', notificationId)
    .single();

  if (!notification) return;

  try {
    let messageId = '';
    const booking = notification.bookings;

    if (notification.channel === 'email') {
      let html = '';
      if (notification.type === 'booking_confirmed') {
        html = `
          <div style="font-family: sans-serif; color: #1e293b;">
            <h2 style="color: #0f172a;">You Work Booking Confirmed — ${booking.booking_code}</h2>
            <p>Hello ${booking.profiles.full_name},</p>
            <p>Your You Work booking has been confirmed.</p>
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Booking ID:</strong> ${booking.booking_code}</li>
              <li><strong>Date:</strong> ${booking.date}</li>
              <li><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</li>
              <li><strong>Guests:</strong> ${booking.guest_count}</li>
              <li><strong>Purpose:</strong> ${booking.purpose}</li>
            </ul>
            <p><strong>Amount Paid:</strong> ₹${booking.amount}</p>
            <p>Thank you for choosing You Work.</p>
          </div>
        `;
      } else if (notification.type === 'admin_new_booking') {
        html = `<p>New booking confirmed: ${booking.booking_code}</p>`;
      }
      
      messageId = await sendEmail(notification.recipient, notification.subject || 'You Work Notification', html);
      
    } else if (notification.channel === 'whatsapp') {
      const templateName = notification.type === 'booking_confirmed' ? 'rentoffice_booking_confirmed' : 'rentoffice_notification';
      const parameters = [
        { type: 'text', text: booking.booking_code },
        { type: 'text', text: booking.date },
      ];
      messageId = await sendWhatsApp(notification.recipient, templateName, parameters);
    }

    await supabase.from('notifications').update({
      status: 'sent',
      provider_message_id: messageId,
      sent_at: new Date().toISOString()
    }).eq('id', notificationId);

  } catch (error: any) {
    await supabase.from('notifications').update({
      status: 'failed',
      error_message: error.message
    }).eq('id', notificationId);
  }
};

export const triggerBookingConfirmedNotifications = async (booking: any) => {
  const profile = booking.profiles;
  
  // Customer Email
  if (profile.email) {
    await createNotificationJob({
      userId: profile.id,
      bookingId: booking.id,
      type: 'booking_confirmed',
      channel: 'email',
      recipient: profile.email,
      subject: `You Work Booking Confirmed — ${booking.booking_code}`,
      payload: {}
    });
  }

  // Customer WhatsApp
  if (profile.phone) {
    await createNotificationJob({
      userId: profile.id,
      bookingId: booking.id,
      type: 'booking_confirmed',
      channel: 'whatsapp',
      recipient: profile.phone,
      payload: {}
    });
  }

  // Admin Email
  await createNotificationJob({
    userId: profile.id, // technically admin, but linking to the booking's creator for simplicity or null
    bookingId: booking.id,
    type: 'admin_new_booking',
    channel: 'email',
    recipient: config.email.from, // admin email placeholder
    subject: `New Booking Confirmed — ${booking.booking_code}`,
    payload: {}
  });
};

export const getAdminNotificationsService = async () => {
  const { data, error } = await supabase.from('notifications').select('*, bookings(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const retryNotificationService = async (id: string) => {
  const { data, error } = await supabase.from('notifications').update({ status: 'pending', error_message: null }).eq('id', id).select('*').single();
  if (error) throw error;
  processNotification(data.id, {}).catch(console.error);
  return data;
};
