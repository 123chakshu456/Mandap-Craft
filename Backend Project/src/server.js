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
import { securityHeaders } from './shared/middlewares/securityMiddleware.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

// Security & High-Performance Middlewares
app.use(securityHeaders);
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Serve local uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Base Route
app.get('/', (req, res) => {
  res.json({
    service: 'Shiv Shakti Events Mart REST API',
    docs: '/api/health',
    version: '2.0.0',
    architecture: 'Feature-Based Domain Architecture',
  });
});

// Mount Feature-Based API Routes
app.use('/api', apiRoutes);

// Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
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
