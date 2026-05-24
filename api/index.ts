import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.js';
import ordersRoutes from '../server/routes/orders.js';
import adminRoutes from '../server/routes/admin.js';
import reservationsRoutes from '../server/routes/reservations.js';
import paymentRoutes from '../server/routes/payment.js';
import { authMiddleware } from '../server/middleware/auth.js';

dotenv.config();

// Disable buffering so queries fail immediately if connection is not available
mongoose.set('bufferCommands', false);

const app = express();

app.use(cors());
app.use(express.json());

// Lazy-connect Mongo to avoid blocking serverless cold starts
let cachedConnection: Promise<typeof mongoose> | null = null;
let connectionError: string | null = null;

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri === '*****') {
    connectionError = 'MONGODB_URI is not defined or is placeholder in environment variables';
    console.warn(connectionError);
    return;
  }

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000, // 4-second selection timeout (default is 30s)
    })
      .then((m) => {
        console.log('Connected to MongoDB via Vercel Serverless Function');
        connectionError = null;
        return m;
      })
      .catch((err) => {
        cachedConnection = null;
        connectionError = `MongoDB connection error: ${err.message}`;
        console.error('MongoDB connection error in Vercel Serverless:', err);
        throw err;
      });
  }

  try {
    await cachedConnection;
  } catch (err: any) {
    console.error('Failed to resolve cached MongoDB connection:', err);
    connectionError = `Failed to resolve DB connection: ${err.message}`;
  }
};

// Check DB connection status before routing
app.use(async (req, res, next) => {
  // Let health check pass through
  if (req.path === '/api/health') {
    return next();
  }

  await connectMongo();

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database Connection Offline',
      message: connectionError || 'MongoDB is not connected. Please verify your MONGODB_URI environment variable on Vercel.',
      readyState: mongoose.connection.readyState
    });
  }

  next();
});

// Setup API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel-serverless', dbReady: mongoose.connection.readyState === 1 });
});

app.use('/api', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/payment', paymentRoutes);

app.post('/api/checkout', authMiddleware, async (req, res) => {
  res.json({ success: true, message: 'Order placed successfully!' });
});

// Global error-handling middleware to avoid sending HTML error pages
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Vercel Serverless Function Error:', err);
  res.status(500).json({
    error: 'Internal Server Error in Vercel Serverless Entrypoint',
    message: err.message || String(err),
    stack: err.stack
  });
});

export default app;
