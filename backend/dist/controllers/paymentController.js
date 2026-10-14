"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.getPayment = exports.verifyPayment = exports.createOrder = exports.getPaymentMode = void 0;
const env_1 = require("../config/env");
const paymentService_1 = require("../services/paymentService");
const getPaymentMode = async (_req, res) => {
    res.json({
        success: true,
        data: {
            payment_mode: env_1.config.paymentMode,
            payment_required: env_1.config.paymentMode !== 'disabled'
        }
    });
};
exports.getPaymentMode = getPaymentMode;
const createOrder = async (req, res) => {
    try {
        if (env_1.config.paymentMode === 'disabled') {
            return res.status(400).json({
                success: false,
                message: 'Payment processing is disabled in testing mode. Bookings are confirmed directly without payment.',
                payment_mode: 'disabled'
            });
        }
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }
        const orderData = await (0, paymentService_1.createPaymentOrderService)(req.user.id, bookingId);
        res.json({ success: true, data: orderData });
    }
    catch (error) {
        console.error('[RAZORPAY ORDER ERROR]:', error.message || error);
        const errorMessage = error?.error?.description || error.message || 'Failed to create payment order';
        res.status(400).json({ success: false, message: errorMessage });
    }
};
exports.createOrder = createOrder;
const verifyPayment = async (req, res) => {
    try {
        if (env_1.config.paymentMode === 'disabled') {
            return res.status(400).json({
                success: false,
                message: 'Payment verification is not applicable when payment mode is disabled.',
                payment_mode: 'disabled'
            });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment verification parameters: razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id'
            });
        }
        const result = await (0, paymentService_1.verifyPaymentService)(req.user.id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('[PAYMENT VERIFY ERROR]:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.verifyPayment = verifyPayment;
const getPayment = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const result = await (0, paymentService_1.getPaymentByBookingIdService)(req.user.id, req.params.bookingId, isAdmin);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getPayment = getPayment;
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        if (!signature) {
            return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' });
        }
        // Use exact raw body buffer captured by express.json verify hook
        const rawBody = req.rawBody
            ? req.rawBody.toString('utf8')
            : JSON.stringify(req.body);
        const result = await (0, paymentService_1.processWebhookService)(signature, rawBody);
        res.json(result);
    }
    catch (error) {
        console.error('[WEBHOOK ERROR]:', error.message);
        res.status(400).json({ success: false, message: error.message || 'Webhook processing failed' });
    }
};
exports.handleWebhook = handleWebhook;
