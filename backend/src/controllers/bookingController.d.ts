import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const createBooking: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyBookings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBookingById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const cancelBooking: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=bookingController.d.ts.map