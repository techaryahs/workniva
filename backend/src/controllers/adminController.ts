import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  getAdminBookingsService,
  updateBookingStatusService,
  getPricingService,
  updatePricingService,
  getBlockedTimesService,
  blockTimeService,
  unblockTimeService,
  getAdminCustomersService
} from '../services/adminService';

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminBookingsService();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const data = await updateBookingStatusService(req.params.id as string, req.body.status);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPricing = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getPricingService();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePricing = async (req: AuthRequest, res: Response) => {
  try {
    await updatePricingService(req.params.id as string, req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlockedTimes = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getBlockedTimesService();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockTime = async (req: AuthRequest, res: Response) => {
  try {
    const data = await blockTimeService(req.user!.id, req.body);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const unblockTime = async (req: AuthRequest, res: Response) => {
  try {
    await unblockTimeService(req.params.id as string);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminCustomersService();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
