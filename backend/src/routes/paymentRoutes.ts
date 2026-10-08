import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { createOrder, verifyPayment, getPayment, handleWebhook } from '../controllers/paymentController';

const router = Router();

// Webhook doesn't require JWT auth
router.post('/webhook', handleWebhook);

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);
router.get('/:bookingId', requireAuth, getPayment);

export default router;
