"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryNotificationService = exports.getAdminNotificationsService = exports.triggerBookingConfirmedNotifications = exports.createNotificationJob = exports.generateAdminNotificationHtml = exports.generateCustomerConfirmationHtml = exports.renderEmailHeader = void 0;
const database_1 = require("../config/database");
const emailService_1 = require("./emailService");
const whatsappService_1 = require("./whatsappService");
const env_1 = require("../config/env");
// Format helper for workspace display name
const formatWorkspaceName = (type, id) => {
    switch (type) {
        case 'private-cabin':
            return `Private Cabin (${id ? id.replace('cabin-', 'Cabin ') : 'Standard'})`;
        case 'conference-room':
            return `Conference Room (${id ? id.replace('conf-', 'Room ') : 'Room 1'})`;
        case 'bench-seating':
            return 'Dedicated Bench Seating';
        case 'whole-night':
            return 'Entire Office (Whole Night)';
        default:
            return type ? type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Workspace';
    }
};
// Format duration
const formatDuration = (minutes) => {
    if (minutes === 60)
        return '1 Hour';
    if (minutes === 120)
        return '2 Hours';
    if (minutes === 180)
        return '3 Hours';
    if (minutes === 240)
        return 'Half Day (4 Hours)';
    if (minutes === 480)
        return 'Full Day (8 Hours)';
    const hours = minutes / 60;
    return Number.isInteger(hours) ? `${hours} Hours` : `${minutes} Minutes`;
};
/**
 * Reusable, email-client compatible WorkNiva branded header component.
 * Embeds the official WorkNiva logo beside the brand name with terracotta accent.
 */
const renderEmailHeader = (options = {}) => {
    const { subtitle = 'Premium Workspace Reservation', badgeText = '', isAdmin = false, } = options;
    const logoSrc = (0, emailService_1.getLogoSrc)();
    return `
    <!-- WorkNiva Branded Header with Official Logo -->
    <tr>
      <td style="background-color: #1B4D3E; padding: 24px 32px; border-bottom: 3px solid #E27D60;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tr>
            <td valign="middle" style="width: 54px; padding-right: 16px;">
              <img
                src="${logoSrc}"
                alt="WorkNiva logo"
                width="48"
                height="48"
                style="display: block; width: 48px; height: 48px; max-width: 48px; max-height: 48px; border-radius: 12px; border: 0; outline: none; object-fit: contain; background-color: #13392E;"
              />
            </td>
            <td valign="middle" align="left">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td>
                    <span style="color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1;">
                      Work<span style="color: #E27D60;">Niva</span>
                    </span>
                    ${badgeText ? `
                    <span style="background-color: rgba(255, 255, 255, 0.15); color: #A7F3D0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-left: 10px; letter-spacing: 0.5px; display: inline-block; vertical-align: middle; border: 1px solid rgba(167, 243, 208, 0.3);">
                      ${badgeText}
                    </span>
                    ` : ''}
                    ${isAdmin && !badgeText ? `
                    <span style="background-color: rgba(255, 255, 255, 0.15); color: #A7F3D0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-left: 10px; letter-spacing: 0.5px; display: inline-block; vertical-align: middle; border: 1px solid rgba(167, 243, 208, 0.3);">
                      Admin Alert
                    </span>
                    ` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 5px;">
                    <span style="color: #A7F3D0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      ${subtitle}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};
exports.renderEmailHeader = renderEmailHeader;
// Generate Customer Confirmation HTML Email
const generateCustomerConfirmationHtml = (booking) => {
    const customerName = booking.profiles?.full_name || 'Valued Customer';
    const workspaceTitle = formatWorkspaceName(booking.resource_type, booking.resource_id);
    const durationText = formatDuration(booking.duration_minutes || 60);
    const isTestingMode = Boolean(booking.special_requirements && booking.special_requirements.includes('Testing Mode')) ||
        env_1.config.paymentMode === 'disabled';
    const paymentStatusText = isTestingMode ? 'Testing Mode (Unpaid)' : (booking.status === 'confirmed' ? 'Paid' : 'Pending');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WorkNiva Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

          ${(0, exports.renderEmailHeader)({
        subtitle: 'Premium Workspace Reservation',
        isAdmin: false,
    })}

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 600;">Booking Confirmed!</h2>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.5;">
                Hello <strong>${customerName}</strong>, your workspace reservation has been confirmed. Below are your booking details.
              </p>

              ${isTestingMode ? `
              <!-- Testing Mode Notice Banner -->
              <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 600;">Testing Mode Notice:</p>
                <p style="margin: 4px 0 0 0; color: #B45309; font-size: 13px; line-height: 1.4;">
                  Testing mode: no payment has been collected. This reservation is recorded as an unpaid test booking.
                </p>
              </div>
              ` : ''}

              <!-- Booking Reference Badge -->
              <div style="background-color: #F1F5F9; border-radius: 8px; padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 12px; text-transform: uppercase; color: #64748B; font-weight: 600; display: block;">Booking Reference</span>
                  <span style="font-size: 18px; font-weight: 700; color: #1B4D3E; font-family: monospace;">${booking.booking_code}</span>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 12px; text-transform: uppercase; color: #64748B; font-weight: 600; display: block;">Payment Status</span>
                  <span style="font-size: 13px; font-weight: 600; color: ${isTestingMode ? '#B45309' : '#059669'};">${paymentStatusText}</span>
                </div>
              </div>

              <!-- Reservation Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px; width: 40%;">Workspace & Resource</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${workspaceTitle}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px;">Date</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${booking.date}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px;">Time Slot</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px;">Duration</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${durationText}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px;">Guests</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${booking.guest_count} person(s)</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 10px 0; color: #64748B; font-size: 14px;">Purpose</td>
                  <td style="padding: 10px 0; color: #0F172A; font-size: 14px; font-weight: 600; text-align: right;">${booking.purpose || 'Client Meeting'}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 6px 0; color: #0F172A; font-size: 16px; font-weight: 700;">Total Amount</td>
                  <td style="padding: 14px 0 6px 0; color: #1B4D3E; font-size: 18px; font-weight: 700; text-align: right;">₹${booking.amount}</td>
                </tr>
              </table>

              <!-- Official Contact Information -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin-top: 28px;">
                <p style="margin: 0 0 10px 0; color: #0F172A; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Need Assistance? Official Contact Numbers:</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
                  <tr>
                    <td style="color: #64748B; width: 45%;">• Mobile (Primary):</td>
                    <td><a href="tel:+919619901999" style="color: #1B4D3E; font-weight: 600; text-decoration: none;">+91 96199 01999</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">• Additional Contact:</td>
                    <td><a href="tel:+919819112999" style="color: #1B4D3E; font-weight: 600; text-decoration: none;">+91 98191 12999</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">• Landline:</td>
                    <td><a href="tel:+912245656991" style="color: #1B4D3E; font-weight: 600; text-decoration: none;">+91 22 4565 6991</a></td>
                  </tr>
                </table>
              </div>

              <p style="margin: 24px 0 0 0; color: #64748B; font-size: 13px; text-align: center;">
                Thank you for choosing WorkNiva. We look forward to hosting you!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 20px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #94A3B8; font-size: 12px;">© ${new Date().getFullYear()} WorkNiva Workspace. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
exports.generateCustomerConfirmationHtml = generateCustomerConfirmationHtml;
// Generate Admin Notification HTML Email
const generateAdminNotificationHtml = (booking) => {
    const profile = booking.profiles || {};
    const customerName = profile.full_name || 'Unknown Customer';
    const customerEmail = profile.email || 'N/A';
    const customerPhone = profile.phone || 'N/A';
    const customerCompany = profile.company || 'Individual / None';
    const workspaceTitle = formatWorkspaceName(booking.resource_type, booking.resource_id);
    const durationText = formatDuration(booking.duration_minutes || 60);
    const isTestingMode = Boolean(booking.special_requirements && booking.special_requirements.includes('Testing Mode')) ||
        env_1.config.paymentMode === 'disabled';
    const paymentStatusText = isTestingMode ? 'Testing Mode (Unpaid)' : (booking.status === 'confirmed' ? 'Paid' : 'Pending');
    const adminBookingsUrl = `${env_1.config.frontendUrl}/admin/bookings`;
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Booking Notification - WorkNiva Admin</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F172A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);">

          ${(0, exports.renderEmailHeader)({
        subtitle: 'Admin Reservation Alert',
        badgeText: 'New Booking',
        isAdmin: true,
    })}

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 8px 0; color: #0F172A; font-size: 18px; font-weight: 700;">A new booking has been confirmed</h2>
              <p style="margin: 0 0 20px 0; color: #64748B; font-size: 14px;">
                Booking Code: <strong style="color: #1B4D3E; font-family: monospace; font-size: 16px;">${booking.booking_code}</strong>
              </p>

              ${isTestingMode ? `
              <!-- Testing Indicator -->
              <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                <strong style="color: #92400E; font-size: 13px;">[TESTING MODE BOOKING]</strong>
                <p style="margin: 4px 0 0 0; color: #B45309; font-size: 12px;">This reservation was accepted in testing mode without Razorpay payment.</p>
              </div>
              ` : ''}

              <!-- Customer Info Box -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Customer Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6;">
                  <tr>
                    <td style="color: #64748B; width: 35%;">Name:</td>
                    <td style="color: #0F172A; font-weight: 600;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Email:</td>
                    <td><a href="mailto:${customerEmail}" style="color: #2563EB; text-decoration: none;">${customerEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Phone:</td>
                    <td><a href="tel:${customerPhone}" style="color: #2563EB; text-decoration: none;">${customerPhone}</a></td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Company:</td>
                    <td style="color: #0F172A;">${customerCompany}</td>
                  </tr>
                </table>
              </div>

              <!-- Reservation Schedule & Details -->
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Reservation Schedule</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.6;">
                  <tr>
                    <td style="color: #64748B; width: 35%;">Workspace:</td>
                    <td style="color: #0F172A; font-weight: 600;">${workspaceTitle}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Resource ID:</td>
                    <td style="color: #0F172A; font-weight: 600;">${booking.resource_id || 'Standard'}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Date:</td>
                    <td style="color: #0F172A; font-weight: 600;">${booking.date}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Time Slot:</td>
                    <td style="color: #0F172A; font-weight: 600;">${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)} (${durationText})</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Guests:</td>
                    <td style="color: #0F172A;">${booking.guest_count} person(s)</td>
                  </tr>
                  <tr>
                    <td style="color: #64748B;">Purpose:</td>
                    <td style="color: #0F172A;">${booking.purpose || 'Client Meeting'}</td>
                  </tr>
                  ${booking.special_requirements ? `
                  <tr>
                    <td style="color: #64748B; vertical-align: top;">Requirements:</td>
                    <td style="color: #0F172A; font-size: 12px;">${booking.special_requirements}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color: #64748B; padding-top: 8px;">Total Amount:</td>
                    <td style="color: #1B4D3E; font-weight: 700; font-size: 16px; padding-top: 8px;">₹${booking.amount} (${paymentStatusText})</td>
                  </tr>
                </table>
              </div>

              <!-- Button CTA -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="${adminBookingsUrl}" style="background-color: #1B4D3E; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                  View in Admin Dashboard →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 16px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #94A3B8; font-size: 11px;">WorkNiva Automated Admin Notification System</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
exports.generateAdminNotificationHtml = generateAdminNotificationHtml;
const createNotificationJob = async (params) => {
    try {
        // 1. Check for idempotency: have we already sent this exact notification?
        const { data: existing } = await database_1.supabase
            .from('notifications')
            .select('id, status')
            .eq('booking_id', params.bookingId)
            .eq('type', params.type)
            .eq('channel', params.channel)
            .maybeSingle();
        if (existing && existing.status === 'sent') {
            console.log(`Notification ${params.type} via ${params.channel} for booking ${params.bookingId} already sent. Skipping.`);
            return;
        }
        let notificationId = existing?.id;
        if (!notificationId) {
            // Insert pending notification record
            const { data: notification, error } = await database_1.supabase
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
                console.warn('Could not insert notification into notifications table (table may not exist yet or schema issue):', error?.message);
                // Fallback: direct asynchronous dispatch without database audit row
                sendDirectNotification(params).catch(err => {
                    console.error('Fallback notification delivery failed:', err.message);
                });
                return;
            }
            notificationId = notification.id;
        }
        // Process asynchronously without blocking caller
        processNotification(notificationId, params.payload).catch(console.error);
    }
    catch (err) {
        console.error('Error in createNotificationJob:', err.message);
    }
};
exports.createNotificationJob = createNotificationJob;
const sendDirectNotification = async (params) => {
    const booking = params.payload?.booking;
    if (!booking)
        return;
    if (params.channel === 'email') {
        const html = params.type === 'booking_confirmed'
            ? (0, exports.generateCustomerConfirmationHtml)(booking)
            : (0, exports.generateAdminNotificationHtml)(booking);
        await (0, emailService_1.sendEmail)(params.recipient, params.subject || 'WorkNiva Notification', html);
    }
};
const processNotification = async (notificationId, payload) => {
    const { data: notification } = await database_1.supabase
        .from('notifications')
        .select('*, bookings(*, profiles(*))')
        .eq('id', notificationId)
        .single();
    if (!notification)
        return;
    try {
        let messageId = '';
        const booking = notification.bookings || payload?.booking;
        if (!booking) {
            throw new Error('Booking record not found for notification ID ' + notificationId);
        }
        if (notification.channel === 'email') {
            let html = '';
            if (notification.type === 'booking_confirmed') {
                html = (0, exports.generateCustomerConfirmationHtml)(booking);
            }
            else if (notification.type === 'admin_new_booking') {
                html = (0, exports.generateAdminNotificationHtml)(booking);
            }
            else {
                html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">
    ${(0, exports.renderEmailHeader)({ subtitle: 'Notification Update' })}
    <tr>
      <td style="padding: 32px; color: #1E293B; font-size: 15px; line-height: 1.5;">
        ${notification.subject ? `<h3 style="margin-top: 0; color: #0F172A;">${notification.subject}</h3>` : ''}
        <p>${notification.error_message || 'Thank you for choosing WorkNiva.'}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
            }
            messageId = await (0, emailService_1.sendEmail)(notification.recipient, notification.subject || 'WorkNiva Notification', html);
        }
        else if (notification.channel === 'whatsapp') {
            const templateName = notification.type === 'booking_confirmed' ? 'rentoffice_booking_confirmed' : 'rentoffice_notification';
            const parameters = [
                { type: 'text', text: booking.booking_code },
                { type: 'text', text: booking.date },
            ];
            messageId = await (0, whatsappService_1.sendWhatsApp)(notification.recipient, templateName, parameters);
        }
        await database_1.supabase.from('notifications').update({
            status: 'sent',
            provider_message_id: messageId,
            error_message: null,
            sent_at: new Date().toISOString()
        }).eq('id', notificationId);
        console.log(`[NOTIFICATION SUCCESS] ID: ${notificationId} | ${notification.type} to ${notification.recipient}`);
    }
    catch (error) {
        console.error(`[NOTIFICATION FAILED] ID: ${notificationId} | ${error.message}`);
        await database_1.supabase.from('notifications').update({
            status: 'failed',
            error_message: error.message
        }).eq('id', notificationId);
    }
};
const triggerBookingConfirmedNotifications = async (booking) => {
    const profile = booking.profiles || {};
    // 1. Customer Email
    if (profile.email) {
        await (0, exports.createNotificationJob)({
            userId: profile.id || booking.user_id,
            bookingId: booking.id,
            type: 'booking_confirmed',
            channel: 'email',
            recipient: profile.email,
            subject: `WorkNiva Booking Confirmed — ${booking.booking_code}`,
            payload: { booking }
        });
    }
    // 2. Customer WhatsApp
    if (profile.phone) {
        await (0, exports.createNotificationJob)({
            userId: profile.id || booking.user_id,
            bookingId: booking.id,
            type: 'booking_confirmed',
            channel: 'whatsapp',
            recipient: profile.phone,
            payload: { booking }
        });
    }
    // 3. Admin Notification Email (to info@aryahsworld.com)
    const adminRecipient = env_1.config.email.adminEmail || 'info@aryahsworld.com';
    await (0, exports.createNotificationJob)({
        userId: profile.id || booking.user_id,
        bookingId: booking.id,
        type: 'admin_new_booking',
        channel: 'email',
        recipient: adminRecipient,
        subject: `[WorkNiva Admin] New Booking Confirmed — ${booking.booking_code}`,
        payload: { booking }
    });
};
exports.triggerBookingConfirmedNotifications = triggerBookingConfirmedNotifications;
const getAdminNotificationsService = async () => {
    const { data, error } = await database_1.supabase.from('notifications').select('*, bookings(*)').order('created_at', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getAdminNotificationsService = getAdminNotificationsService;
const retryNotificationService = async (id) => {
    const { data, error } = await database_1.supabase.from('notifications').update({ status: 'pending', error_message: null }).eq('id', id).select('*').single();
    if (error)
        throw error;
    processNotification(data.id, {}).catch(console.error);
    return data;
};
exports.retryNotificationService = retryNotificationService;
