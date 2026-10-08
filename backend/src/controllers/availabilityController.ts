import { Request, Response } from 'express';
import { checkAvailabilityService } from '../services/availabilityService';

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { date, startTime, duration } = req.query;

    if (!date || !startTime || !duration) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    let durationMinutes = 60;
    if (String(duration).includes('Hour')) durationMinutes = parseInt(String(duration)) * 60;
    if (duration === 'Half Day') durationMinutes = 240;
    if (duration === 'Full Day' || duration === 'Night') durationMinutes = 480;

    const result = await checkAvailabilityService(String(date), String(startTime), durationMinutes);

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
