"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 5000,
    supabaseUrl: process.env.SUPABASE_URL || 'https://mock.supabase.co',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkey",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "mocksecret",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "mockwebhooksecret",
    email: {
        host: process.env.EMAIL_HOST || "",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        user: process.env.EMAIL_USER || "",
        password: process.env.EMAIL_PASSWORD || "",
        from: process.env.EMAIL_FROM || "noreply@youwork.com",
    },
    whatsapp: {
        token: process.env.WHATSAPP_ACCESS_TOKEN || "",
        phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    },
};
