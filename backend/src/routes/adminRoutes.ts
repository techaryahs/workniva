import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  getPricing,
  updatePricing,
  getBlockedTimes,
  blockTime,
  unblockTime,
  getCustomers
} from '../controllers/adminController';
import { getNotifications, retryNotification } from '../controllers/notificationController';

const router = Router();

// Apply auth and admin middleware to all admin routes
router.use(requireAuth, requireAdmin);

router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.patch('/bookings/:id/status', updateBookingStatus);

router.get('/pricing', getPricing);
router.patch('/pricing/:id', updatePricing);

router.get('/availability/blocked', getBlockedTimes);
router.post('/availability/block', blockTime);
router.delete('/availability/block/:id', unblockTime);

router.get('/customers', getCustomers);

router.get('/notifications', getNotifications);
router.post('/notifications/:id/retry', retryNotification);

export default router;
