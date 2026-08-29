/**
 * auditLogController.js — Immutable Electronic Audit Trail Querying & CSV Export (ISA 230)
 */

import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

// @desc    Get all immutable audit logs with search, role, action filters & pagination
// @route   GET /api/v1/auditlogs
// @access  Private (AUDITOR, ADMIN)
export const getAuditLogs = async (req, res, next) => {
  try {
    const { role, action_type, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (action_type && action_type !== 'All') query.action_type = action_type;
    if (search) {
      query.$or = [
        { details: { $regex: search, $options: 'i' } },
        { user_id: { $regex: search, $options: 'i' } },
        { module: { $regex: search, $options: 'i' } },
        { log_id: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with user name
    const userIds = [...new Set(logs.map(l => l.user_id))];
    const users = await User.find({ user_id: { $in: userIds } });
    const userMap = new Map(users.map(u => [u.user_id, u.full_name]));

    const enrichedLogs = logs.map(l => ({
      _id: l._id,
      id: l.log_id,
      log_id: l.log_id,
      timestamp: l.timestamp,
      user_id: l.user_id,
      user: userMap.get(l.user_id) || l.user_id,
      role: l.role,
      action: l.action_type,
      action_type: l.action_type,
      module: l.module,
      description: l.details,
      details: l.details,
      outcome: l.action_type.includes('REJECT') ? 'Rejected' : l.action_type.includes('FLAG') ? 'Flagged' : 'Success',
      ipAddress: l.ip_address,
      ip_address: l.ip_address,
    }));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: enrichedLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export audit trail as CSV
// @route   GET /api/v1/auditlogs/export
// @access  Private (AUDITOR, ADMIN)
export const exportAuditLogsCSV = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });

    const headers = ['Log ID', 'Timestamp (UTC)', 'User ID', 'Role', 'Action Type', 'Module', 'Details', 'IP Address'];
    const rows = logs.map(l => [
      l.log_id,
      l.timestamp.toISOString(),
      l.user_id,
      l.role,
      l.action_type,
      l.module,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.ip_address,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=CFASS_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
