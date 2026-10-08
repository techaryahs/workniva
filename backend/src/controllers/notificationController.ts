import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getAdminNotificationsService, retryNotificationService } from '../services/notificationService';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminNotificationsService();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const retryNotification = async (req: AuthRequest, res: Response) => {
  try {
    const data = await retryNotificationService(req.params.id as string);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
