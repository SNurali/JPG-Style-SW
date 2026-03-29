import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env', override: true });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';
import { ordersRouter } from './routes/orders';
import { reviewsRouter } from './routes/reviews';
import { adminRouter } from './routes/admin';
import { uploadRouter } from './routes/upload';

const app = express();
const PORT = process.env.PORT || 4001;

// Track DB mode
let dbAvailable = false;
export function isDbAvailable() { return dbAvailable; }

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('uploads'));

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
app.use((req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 120;
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  if (record.count >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  record.count++;
  next();
});

// Public routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);

// Admin routes
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', db: dbAvailable, timestamp: new Date().toISOString() });
});

// Startup
async function start() {
  try {
    const { initializeDatabase } = await import('./db/connection');
    const { seed } = await import('./db/seed');
    await initializeDatabase();
    await seed();
    dbAvailable = true;
    console.log('✅ Running with PostgreSQL');
  } catch (err) {
    console.warn('⚠️  PostgreSQL unavailable — running with in-memory fallback data');
    console.warn('   To enable DB: set DATABASE_URL env variable or start PostgreSQL on port 5432');
    dbAvailable = false;
  }

  app.listen(PORT, async () => {
    console.log(`🚀 SmartWash API running on http://localhost:${PORT}`);
    console.log(`📋 Mode: ${dbAvailable ? 'PostgreSQL' : 'In-Memory Fallback'}`);
    const { telegramService } = await import('./services/telegram.service');
    telegramService.startPolling();
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  if (dbAvailable) {
    const { closeDatabase } = await import('./db/connection');
    await closeDatabase();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (dbAvailable) {
    const { closeDatabase } = await import('./db/connection');
    await closeDatabase();
  }
  process.exit(0);
});

start();
