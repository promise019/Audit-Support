/**
 * index.js — Main API v1 Router Aggregator
 */

import express from 'express';
import authRoutes from './authRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import reconciliationRoutes from './reconciliationRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import docsRoutes from './docsRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/reconciliations', reconciliationRoutes);
router.use('/auditlogs', auditLogRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/docs', docsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    system: 'CFASS Backend API',
    institution: 'Faculty of Computing, University of Calabar',
    timestamp: new Date().toISOString(),
  });
});

export default router;
