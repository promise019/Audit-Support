/**
 * auditLogger.js — Immutable Audit Log Generator Helper & Middleware
 * Chapter 3.3.2.1 Algorithm 3 & Chapter 3.3.2.3 System Controls
 */

import AuditLog from '../models/AuditLog.js';

/**
 * createAuditEntry — Helper to persist an immutable audit event
 */
export const createAuditEntry = async ({
  user_id = 'SYS-001',
  role = 'System',
  action_type = 'CREATE',
  module = 'System',
  details = '',
  ip_address = '127.0.0.1',
}) => {
  try {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    const log_id = `AUD-${year}-${rand}`;

    const entry = await AuditLog.create({
      log_id,
      timestamp: new Date(),
      user_id,
      role,
      action_type,
      module,
      details,
      ip_address,
    });

    return entry;
  } catch (error) {
    console.error('[CFASS Audit Trail Error] Failed to write audit event:', error.message);
  }
};
