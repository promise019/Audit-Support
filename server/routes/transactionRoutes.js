import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
} from '../controllers/transactionController.js';
import { protect, requireRole } from '../middleware/auth.js';
import { validateTransactionInput } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTransactions)
  .post(protect, requireRole('DATA_ENTRY', 'ADMIN'), validateTransactionInput, createTransaction);

router.route('/:id').get(protect, getTransactionById);

router
  .route('/:id/status')
  .put(protect, requireRole('AUDITOR', 'ADMIN'), updateTransactionStatus);

export default router;
