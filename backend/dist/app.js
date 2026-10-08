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
const availabilityRoutes_1 = __importDefault(require("./routes/availabilityRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.config.frontendUrl }));
app.use(express_1.default.json({ limit: '10kb' })); // Request size limit
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'You Work API is running' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/availability', availabilityRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
// Error middleware placeholder
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production')
        console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke!' });
});
exports.default = app;
