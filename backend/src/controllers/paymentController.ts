import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { config } from '../config/env';
import {
  createPaymentOrderService,
  verifyPaymentService,
  getPaymentByBookingIdService,
  processWebhookService
} from '../services/paymentService';

export const getPaymentMode = async (_req: import('express').Request, res: Response) => {
  res.json({
    success: true,
    data: {
      payment_mode: config.paymentMode,
      payment_required: config.paymentMode !== 'disabled'
    }
  });
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (config.paymentMode === 'disabled') {
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

    const orderData = await createPaymentOrderService(req.user!.id, bookingId);
    res.json({ success: true, data: orderData });
  } catch (error: any) {
    console.error('[RAZORPAY ORDER ERROR]:', error.message || error);
    const errorMessage = error?.error?.description || error.message || 'Failed to create payment order';
    res.status(400).json({ success: false, message: errorMessage });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (config.paymentMode === 'disabled') {
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

    const result = await verifyPaymentService(req.user!.id, req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[PAYMENT VERIFY ERROR]:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const result = await getPaymentByBookingIdService(req.user!.id, req.params.bookingId as string, isAdmin);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req: import('express').Request, res: import('express').Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' });
    }

    // Use exact raw body buffer captured by express.json verify hook
    const rawBody = (req as any).rawBody
      ? (req as any).rawBody.toString('utf8')
      : JSON.stringify(req.body);

    const result = await processWebhookService(signature, rawBody);
    res.json(result);
  } catch (error: any) {
    console.error('[WEBHOOK ERROR]:', error.message);
    res.status(400).json({ success: false, message: error.message || 'Webhook processing failed' });
  }
};
