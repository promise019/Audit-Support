import express from 'express';
import { getBudgets, createOrUpdateBudget } from '../controllers/budgetController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getBudgets)
  .post(protect, requireRole('ADMIN'), createOrUpdateBudget);

export default router;
