import express from 'express';
import { getAuditLogs, exportAuditLogsCSV } from '../controllers/auditLogController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, requireRole('AUDITOR', 'ADMIN'), getAuditLogs);
router.get('/export', protect, requireRole('AUDITOR', 'ADMIN'), exportAuditLogsCSV);

export default router;
