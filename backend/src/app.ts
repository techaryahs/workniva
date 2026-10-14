import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';

import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

// Security headers
app.use(helmet());

// Production CORS allowlist
const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      config.frontendUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5080',
      'http://localhost'
    ];

    if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
      const extra = process.env.ADDITIONAL_ALLOWED_ORIGINS.split(',').map(s => s.trim());
      allowedOrigins.push(...extra);
    }
    
    // Allow non-browser requests (e.g. server-to-server webhooks, curl, health checks) or verified origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked request from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'x-requested-with']
};

app.use(cors(corsOptions));

// Preserve exact raw body buffer for Razorpay cryptographic webhook verification
app.use(express.json({
  limit: '100kb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Payment rate limit reached. Please wait a moment.' }
});
app.use('/api/payments/create-order', paymentLimiter);
app.use('/api/payments/verify', paymentLimiter);

// Production Health Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'WorkNiva API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    paymentMode: config.paymentMode,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Safe Production Error Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[UNCAUGHT ERROR]:', err);
  } else {
    console.error('[SERVER ERROR]:', err.message || 'Unknown error');
  }

  const statusCode = err.status || 500;
  const clientMessage = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An internal server error occurred'
    : (err.message || 'Something broke!');

  res.status(statusCode).json({
    success: false,
    message: clientMessage
  });
});

export default app;
