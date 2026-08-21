import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import apiRoutes from './src/routes/index.js';
import { notFound, errorHandler } from './src/middleware/error.js';

const app = express();

// ----- CORS -----
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
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

// ----- Bootstrap -----
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Project Sunrise API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
