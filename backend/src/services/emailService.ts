import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<string> => {
  if (!config.email.host) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return 'mock-email-id-' + Date.now();
  }

  const info = await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });

  return info.messageId;
};
