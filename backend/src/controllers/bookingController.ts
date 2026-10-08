import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createBookingService, getMyBookingsService, cancelBookingService, getBookingByIdService } from '../services/bookingService';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await createBookingService(req.user!.id, req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await getMyBookingsService(req.user!.id);
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await getBookingByIdService(req.user!.id, req.params.id as string);
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await cancelBookingService(req.user!.id, req.params.id as string);
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
