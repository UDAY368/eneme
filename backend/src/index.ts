import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/analytics';
import visitsRoutes from './routes/visits';
import leadsRoutes from './routes/leads';
import portfolioRoutes from './routes/portfolio';
import blogRoutes from './routes/blog';

const app = express();
const PORT = process.env.PORT || 4000;

// Build allowed origins: FRONTEND_URL + CORS_ORIGIN + localhost
const frontendUrl = (process.env.FRONTEND_URL || '').trim().replace(/\/+$/, '');
const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
const localhostOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];
const allowedOriginsSet = new Set([
  ...(frontendUrl ? [frontendUrl] : []),
  ...envOrigins,
  ...localhostOrigins,
]);
const allowedOrigins = allowedOriginsSet.size > 0 ? [...allowedOriginsSet] : ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. Postman, server-to-server)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: [],
  maxAge: 86400,
};

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must have 4 args for Express to recognize)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
});

app.listen(PORT, () => {
  console.log(`ENEME API server running on http://localhost:${PORT}`);
});
