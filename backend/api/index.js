import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from '../src/routes/index.js';
import { notFound, errorHandler } from '../src/middleware/error.js';

const app = express();

// ----- CORS -----
// Allow the production frontend URL (CLIENT_URL) and local dev.
// Cannot use '*' with credentials — browsers reject it.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (server-to-server, curl, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Routes -----
app.get('/', (req, res) =>
  res.json({
    success: true,
    name: 'Project Sunrise API',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/users', '/api/companies', '/api/trips', '/api/bookings', '/api/approvals', '/api/expenses'],
  })
);

app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime() })
);

app.use('/api', apiRoutes);

// ----- Error handling -----
app.use(notFound);
app.use(errorHandler);

// ----- MongoDB connection (cached for serverless warm starts) -----
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Connect to MongoDB before handling requests
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB connected (serverless)');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }
  }

  next();
});


// Export the Express app for Vercel serverless
export default app;
