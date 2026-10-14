import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rawPaymentMode = (process.env.PAYMENT_MODE || '').toLowerCase().trim();
const paymentMode = rawPaymentMode === 'disabled' ? 'disabled' : 'razorpay';

export const config = {
  port: parseInt(process.env.PORT || '5080'),
  paymentMode,
  supabaseUrl: process.env.SUPABASE_URL || 'https://mock.supabase.co',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || 'tech.aryahs@gmail.com',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || '"WorkNiva" <tech.aryahs@gmail.com>',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'info@aryahsworld.com',
    logoUrl: process.env.WORKNIVA_LOGO_URL || '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
};

export const validateProductionEnvironment = () => {
  console.log('====================================================');
  console.log('   WorkNiva Backend Service Starting');
  console.log('====================================================');
  console.log(`Node Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Port:             ${config.port}`);
  console.log(`Payment Mode:     ${config.paymentMode.toUpperCase()}`);
  console.log(`Frontend URL:     ${config.frontendUrl}`);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[WARN] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment.');
  }

  if (config.paymentMode === 'razorpay') {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      console.error('[CRITICAL] PAYMENT_MODE is set to razorpay, but RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing!');
      throw new Error('Missing Razorpay credentials for live payments.');
    } else {
      const isLive = config.razorpayKeyId.startsWith('rzp_live');
      console.log(`Razorpay Mode:    ${isLive ? 'LIVE' : 'TEST'} (${config.razorpayKeyId.substring(0, 12)}...)`);
    }

    if (!config.razorpayWebhookSecret || config.razorpayWebhookSecret === 'your_webhook_secret') {
      console.warn('[NOTICE] RAZORPAY_WEBHOOK_SECRET is not configured. Webhooks will reject until configured in .env.');
    }
  }

  if (config.email.password) {
    console.log(`Email Service:    Configured (${config.email.user} -> ${config.email.adminEmail})`);
  } else {
    console.warn('[NOTICE] EMAIL_PASSWORD is empty. Email dispatches will be recorded as failed in notifications table.');
  }
  console.log('====================================================');
};
