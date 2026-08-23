import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from '../src/routes/index.js';
import { notFound, errorHandler } from '../src/middleware/error.js';

const app = express();

// ----- CORS -----
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'https://akbarbizvoy-in.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- MongoDB connection -----
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// ----- Connect MongoDB before routes -----
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

// ----- API info -----
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Project Sunrise API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/companies',
      '/api/trips',
      '/api/bookings',
      '/api/approvals',
      '/api/expenses',
    ],
  });
});

// ----- Health check -----
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
  });
});

// ----- Routes -----
app.use('/api', apiRoutes);

// ----- Error handling -----
app.use(notFound);
app.use(errorHandler);

// ----- Vercel serverless export -----
export default app;