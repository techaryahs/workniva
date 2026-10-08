"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.config.email.host,
    port: env_1.config.email.port,
    secure: env_1.config.email.port === 465,
    auth: {
        user: env_1.config.email.user,
        pass: env_1.config.email.password,
    },
});
const sendEmail = async (to, subject, html) => {
    if (!env_1.config.email.host) {
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        return 'mock-email-id-' + Date.now();
    }
    const info = await transporter.sendMail({
        from: env_1.config.email.from,
        to,
        subject,
        html,
    });
    return info.messageId;
};
exports.sendEmail = sendEmail;
