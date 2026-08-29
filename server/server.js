/**
 * server.js — Main Express Server Entry Point
 * Computerised Financial Audit Support System (CFASS)
 * Faculty of Computing, University of Calabar
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env if present, otherwise fallback to root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to CFASS API — Computerised Financial Audit Support System',
    institution: 'Faculty of Computing, University of Calabar',
    documentation: '/api/v1/docs/chapter3 & /api/v1/docs/chapter4',
    health: '/api/v1/health',
  });
});

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CFASS Backend API running on port ${PORT}`);
  console.log(`🎓 Institution: Faculty of Computing, University of Calabar`);
  console.log(`📖 Documentation: http://localhost:${PORT}/api/v1/docs/chapter3`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection Error]: ${err.message}`);
  // Keep server running in development
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

export default app;
