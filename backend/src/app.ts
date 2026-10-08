import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';

import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import availabilityRoutes from './routes/availabilityRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();


app.use(helmet());
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json({ limit: '10kb' })); // Request size limit

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'You Work API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Error middleware placeholder
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!' });
});

export default app;
