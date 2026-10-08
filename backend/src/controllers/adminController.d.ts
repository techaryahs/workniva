import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getBookings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBookingStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPricing: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePricing: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBlockedTimes: (req: AuthRequest, res: Response) => Promise<void>;
export declare const blockTime: (req: AuthRequest, res: Response) => Promise<void>;
export declare const unblockTime: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCustomers: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map