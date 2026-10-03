import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import collegeRoutes from './routes/collegeRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import savedCollegeRoutes from './routes/savedCollegeRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import prisma from './db/prisma.js';

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : 'http://localhost:5173';

// Dynamic CORS configuration allowing configured FRONTEND_URL, extra origins, Render, Vercel & local development
const configuredOrigins = (process.env.ADDITIONAL_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  FRONTEND_URL,
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://localhost:4173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /\.onrender\.com$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());
app.use(express.json());

// Request logging in dev
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Router supporting both /api/* and root /* (for flexible Vercel serverless rewrites)
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    const collegeCount = await prisma.college.count();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      stats: {
        totalColleges: collegeCount
      }
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Direct management-types route for compatibility
apiRouter.get('/management-types', (_req: Request, res: Response) => {
  res.json([
    { id: 'General Management', label: 'General Management Quota' },
    { id: 'NRI', label: 'NRI Quota' }
  ]);
});

// API Sub-Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/saved-colleges', savedCollegeRoutes);
apiRouter.use('/conversations', conversationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/colleges', collegeRoutes);
apiRouter.use('/states', stateRoutes);
apiRouter.use('/enquiries', enquiryRoutes);
apiRouter.use('/contacts', contactRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/blogs', blogRoutes);

// Mount router on both /api and /
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

if (
  process.env.NODE_ENV !== 'test' &&
  !process.env.VERCEL &&
  !process.env.VERCEL_ENV &&
  !process.env.NOW_REGION
) {
  app.listen(PORT, HOST, () => {
    console.log(`⚡ [Backend] Admission by Choice Server running on http://${HOST}:${PORT}`);
    console.log(`📡 Health Check: http://${HOST}:${PORT}/api/health`);
  });
}

export default app;
