"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
// Public payment mode inquiry
router.get('/mode', paymentController_1.getPaymentMode);
// Webhook doesn't require JWT auth
router.post('/webhook', paymentController_1.handleWebhook);
router.post('/create-order', authMiddleware_1.requireAuth, paymentController_1.createOrder);
router.post('/verify', authMiddleware_1.requireAuth, paymentController_1.verifyPayment);
router.get('/:bookingId', authMiddleware_1.requireAuth, paymentController_1.getPayment);
exports.default = router;
