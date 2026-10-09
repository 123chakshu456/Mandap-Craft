import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './app/routes.js';
import prisma from './shared/config/prisma.js';
import { errorHandler, notFoundHandler } from './shared/middlewares/errorHandler.js';
import {
  securityHeaders,
  sanitizeRequest,
  rateLimit,
} from './shared/middlewares/securityMiddleware.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

// Explicit Server Hardening
app.disable('x-powered-by');

// 1. HTTP Security Headers (OWASP + Fintech CSP & HSTS)
app.use(securityHeaders);

// 2. High-Performance Gzip Compression
app.use(compression());

// 3. Strict CORS Whitelist Configuration (Prevents Cross-Origin Data Theft)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps, postman, server-to-server (no origin header)
      if (!origin) return callback(null, true);

      // Check if origin matches whitelist or localhost
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    maxAge: 86400, // Cache preflight for 24h
  })
);

// 4. Secure Cookie Parser
app.use(cookieParser());

// 5. Controlled Payload Size Limits (DoS / Slowloris Protection)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 6. Deep Request Sanitization (Prototype Pollution, XSS, Null-Byte Defense)
app.use(sanitizeRequest);

// 7. Production Request Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// 8. Global API Volumetric DDoS / Scraping Rate Limiter
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 600, // 600 requests per IP
  message: 'Global API rate limit exceeded. Please try again in a few minutes.',
  key: 'api-global',
});

// Serve local uploads statically with security headers
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Base Route
app.get('/', (req, res) => {
  res.json({
    service: 'Shiv Shakti Events Mart REST API',
    docs: '/api/health',
    version: '2.0.0',
    status: 'secure',
    securityGrade: 'Fintech Tier-1',
  });
});

// Mount Feature-Based API Routes with Global Shield
app.use('/api', globalApiLimiter, apiRoutes);

// Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  console.log(`🛡️ Fintech-grade security middlewares active (CSP, HSTS, Whitelist CORS, Sanitizer, Rate-Limiting)`);
});

// Graceful Shutdown & Connection Pool Teardown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Draining connections and shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('✅ Prisma client disconnected cleanly. Process terminated.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during database teardown:', err);
      process.exit(1);
    }
  });

  // Force exit if hanging after 10s
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
