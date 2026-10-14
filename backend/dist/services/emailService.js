"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.getLogoSrc = exports.getLogoAttachment = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
/**
 * Resolves the official WorkNiva logo file on disk for CID inline email attachment.
 * Prioritizes backend/assets/logo.png, then frontend/public/logo.png or project root.
 */
const getLogoAttachment = () => {
    // If an external HTTPS URL is configured, CID inline attachment is not required
    if (env_1.config.email.logoUrl && env_1.config.email.logoUrl.startsWith('https://')) {
        return null;
    }
    const potentialPaths = [
        path_1.default.resolve(__dirname, '..', '..', 'assets', 'logo.png'), // from src/services/ or dist/services/
        path_1.default.resolve(__dirname, '..', 'assets', 'logo.png'),
        path_1.default.resolve(process.cwd(), 'backend', 'assets', 'logo.png'),
        path_1.default.resolve(process.cwd(), 'assets', 'logo.png'),
        path_1.default.resolve(process.cwd(), 'frontend', 'public', 'logo.png'),
        path_1.default.resolve(__dirname, '..', '..', '..', 'frontend', 'public', 'logo.png'),
    ];
    for (const candidatePath of potentialPaths) {
        if (fs_1.default.existsSync(candidatePath)) {
            return {
                filename: 'workniva-logo.png',
                path: candidatePath,
                cid: 'workniva-logo',
            };
        }
    }
    return null;
};
exports.getLogoAttachment = getLogoAttachment;
/**
 * Returns the image source string to use in <img> tags.
 * If an absolute HTTPS URL is configured via WORKNIVA_LOGO_URL, returns it.
 * Otherwise returns the CID reference 'cid:workniva-logo'.
 */
const getLogoSrc = () => {
    if (env_1.config.email.logoUrl && env_1.config.email.logoUrl.startsWith('https://')) {
        return env_1.config.email.logoUrl;
    }
    return 'cid:workniva-logo';
};
exports.getLogoSrc = getLogoSrc;
const sendEmail = async (to, subject, html, attachments) => {
    if (!env_1.config.email.host || !env_1.config.email.user || !env_1.config.email.password || env_1.config.email.password.trim() === '') {
        console.warn(`[EMAIL] SMTP credentials missing in .env (host: ${env_1.config.email.host}, user: ${env_1.config.email.user}, password: ${env_1.config.email.password ? 'SET' : 'MISSING'}). Cannot send email to ${to}.`);
        throw new Error('SMTP credentials not configured: EMAIL_PASSWORD is required in .env');
    }
    const transporter = nodemailer_1.default.createTransport({
        host: env_1.config.email.host,
        port: env_1.config.email.port,
        secure: env_1.config.email.port === 465,
        auth: {
            user: env_1.config.email.user,
            pass: env_1.config.email.password,
        },
    });
    // Automatically attach official logo as CID inline image if HTML references 'cid:workniva-logo'
    const finalAttachments = attachments ? [...attachments] : [];
    if (html.includes('cid:workniva-logo') && !finalAttachments.some((a) => a.cid === 'workniva-logo')) {
        const logoAttachment = (0, exports.getLogoAttachment)();
        if (logoAttachment) {
            finalAttachments.push(logoAttachment);
        }
    }
    const info = await transporter.sendMail({
        from: env_1.config.email.from,
        to,
        subject,
        html,
        attachments: finalAttachments.length > 0 ? finalAttachments : undefined,
    });
    return info.messageId;
};
exports.sendEmail = sendEmail;
