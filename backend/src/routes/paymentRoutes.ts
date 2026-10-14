import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { createOrder, verifyPayment, getPayment, handleWebhook, getPaymentMode } from '../controllers/paymentController';

const router = Router();

// Public payment mode inquiry
router.get('/mode', getPaymentMode);

// Webhook doesn't require JWT auth
router.post('/webhook', handleWebhook);

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/:bookingId', requireAuth, getPayment);

export default router;
