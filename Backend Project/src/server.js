import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './app/routes.js';
import { errorHandler, notFoundHandler } from './shared/middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & Third-party Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

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
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

export default app;
