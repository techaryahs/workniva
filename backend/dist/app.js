"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
// Security headers with cross-origin resource policy enabled for API clients
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// Check if an origin is permitted
const isOriginAllowed = (origin) => {
    const clean = origin.trim().replace(/\/+$/, '');
    // 1. Configured frontend URL
    if (env_1.config.frontendUrl && clean === env_1.config.frontendUrl.replace(/\/+$/, '')) {
        return true;
    }
    // 2. Extra origins from environment variable
    if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
        const extraOrigins = process.env.ADDITIONAL_ALLOWED_ORIGINS.split(',').map(s => s.trim().replace(/\/+$/, ''));
        if (extraOrigins.includes(clean)) {
            return true;
        }
    }
    // 3. Any WorkNiva / AryahsWorld domain (e.g. workniva.aryahsworld.com, aryahsworld.com, and subdomains)
    if (/^https?:\/\/([a-zA-Z0-9-]+\.)*aryahsworld\.com(:\d+)?$/.test(clean)) {
        return true;
    }
    // 4. Local development origins
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(clean)) {
        return true;
    }
    return false;
};
// Production CORS allowlist
const corsOptions = {
    origin: function (origin, callback) {
        // Allow non-browser requests (e.g. server-to-server webhooks, curl, health checks)
        if (!origin) {
            return callback(null, true);
        }
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
        // Pass null, false instead of throwing Error to prevent 500 status on preflights
        callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-razorpay-signature',
        'x-requested-with',
        'Accept',
        'Origin'
    ],
    optionsSuccessStatus: 200,
    maxAge: 86400
};
app.use((0, cors_1.default)(corsOptions));
// Preserve exact raw body buffer for Razorpay cryptographic webhook verification
app.use(express_1.default.json({
    limit: '100kb',
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    }
}));
// Rate Limiters
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', generalLimiter);
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 40,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);
const paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { success: false, message: 'Payment rate limit reached. Please wait a moment.' }
});
app.use('/api/payments/create-order', paymentLimiter);
app.use('/api/payments/verify', paymentLimiter);
// Production Health Endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        service: 'WorkNiva API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        paymentMode: env_1.config.paymentMode,
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime())
    });
});
// Application Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
// Safe Production Error Middleware
app.use((err, _req, res, _next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error('[UNCAUGHT ERROR]:', err);
    }
    else {
        console.error('[SERVER ERROR]:', err.message || 'Unknown error');
    }
    const statusCode = err.status || (err.message && err.message.includes('CORS') ? 403 : 500);
    const clientMessage = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An internal server error occurred'
        : (err.message || 'Something broke!');
    res.status(statusCode).json({
        success: false,
        message: clientMessage
    });
});
exports.default = app;
