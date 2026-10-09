import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createBookingService, getMyBookingsService, cancelBookingService, getBookingByIdService, checkAvailabilityService } from '../services/bookingService';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await createBookingService(req.user!.id, req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    res.status(400).json({ success: false, message: error.message || "Unknown error occurred" });
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

export const checkAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const data = await checkAvailabilityService(req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
