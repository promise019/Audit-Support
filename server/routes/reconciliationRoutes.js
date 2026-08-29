import express from 'express';
import {
  getReconciliations,
  runReconciliationBatch,
} from '../controllers/reconciliationController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getReconciliations);
router.route('/run').post(protect, requireRole('AUDITOR', 'ADMIN'), runReconciliationBatch);

export default router;
