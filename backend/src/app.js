"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const availabilityRoutes_1 = __importDefault(require("./routes/availabilityRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.config.frontendUrl }));
app.use(express_1.default.json());
// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'You Work API is running' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/availability', availabilityRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Error middleware placeholder
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke!' });
});
exports.default = app;
//# sourceMappingURL=app.js.map