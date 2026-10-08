import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking, getBookingById } from '../controllers/bookingController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);
router.patch('/:id/cancel', requireAuth, cancelBooking);

export default router;
