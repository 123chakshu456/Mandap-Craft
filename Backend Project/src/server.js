import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

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
    message: 'Welcome to the Backend API',
    docs: '/api/health',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

export default app;
