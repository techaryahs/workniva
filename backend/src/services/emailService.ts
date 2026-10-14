import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

/**
 * Resolves the official WorkNiva logo file on disk for CID inline email attachment.
 * Prioritizes backend/assets/logo.png, then frontend/public/logo.png or project root.
 */
export const getLogoAttachment = (): { cid: string; path: string; filename: string } | null => {
  // If an external HTTPS URL is configured, CID inline attachment is not required
  if (config.email.logoUrl && config.email.logoUrl.startsWith('https://')) {
    return null;
  }

  const potentialPaths = [
    path.resolve(__dirname, '..', '..', 'assets', 'logo.png'), // from src/services/ or dist/services/
    path.resolve(__dirname, '..', 'assets', 'logo.png'),
    path.resolve(process.cwd(), 'backend', 'assets', 'logo.png'),
    path.resolve(process.cwd(), 'assets', 'logo.png'),
    path.resolve(process.cwd(), 'frontend', 'public', 'logo.png'),
    path.resolve(__dirname, '..', '..', '..', 'frontend', 'public', 'logo.png'),
  ];

  for (const candidatePath of potentialPaths) {
    if (fs.existsSync(candidatePath)) {
      return {
        filename: 'workniva-logo.png',
        path: candidatePath,
        cid: 'workniva-logo',
      };
    }
  }

  return null;
};

/**
 * Returns the image source string to use in <img> tags.
 * If an absolute HTTPS URL is configured via WORKNIVA_LOGO_URL, returns it.
 * Otherwise returns the CID reference 'cid:workniva-logo'.
 */
export const getLogoSrc = (): string => {
  if (config.email.logoUrl && config.email.logoUrl.startsWith('https://')) {
    return config.email.logoUrl;
  }
  return 'cid:workniva-logo';
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachments?: any[]
): Promise<string> => {
  if (!config.email.host || !config.email.user || !config.email.password || config.email.password.trim() === '') {
    console.warn(`[EMAIL] SMTP credentials missing in .env (host: ${config.email.host}, user: ${config.email.user}, password: ${config.email.password ? 'SET' : 'MISSING'}). Cannot send email to ${to}.`);
    throw new Error('SMTP credentials not configured: EMAIL_PASSWORD is required in .env');
  }

  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  // Automatically attach official logo as CID inline image if HTML references 'cid:workniva-logo'
  const finalAttachments = attachments ? [...attachments] : [];
  if (html.includes('cid:workniva-logo') && !finalAttachments.some((a: any) => a.cid === 'workniva-logo')) {
    const logoAttachment = getLogoAttachment();
    if (logoAttachment) {
      finalAttachments.push(logoAttachment);
    }
  }

  const info = await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
    attachments: finalAttachments.length > 0 ? finalAttachments : undefined,
  });

  return info.messageId;
};
