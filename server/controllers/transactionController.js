/**
 * transactionController.js — Financial Transactions & General Ledger Management
 */

import Transaction from '../models/Transaction.js';
import { createAuditEntry } from '../middleware/auditLogger.js';

// @desc    Get all transactions with optional filters
// @route   GET /api/v1/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { status, category, coa_code, search } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (coa_code && coa_code !== 'All') query.coa_code = coa_code;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { txn_id: { $regex: search, $options: 'i' } },
        { coa_code: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(query).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/v1/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      $or: [{ txn_id: req.params.id }, { _id: req.params.id }],
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction (Data Entry Officer / Admin)
// @route   POST /api/v1/transactions
// @access  Private (DATA_ENTRY, ADMIN)
export const createTransaction = async (req, res, next) => {
  try {
    const { coa_code, category, description, debit, credit, date } = req.body;

    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    const txn_id = `TXN-${year}-${rand}`;

    const newTxn = await Transaction.create({
      txn_id,
      coa_code,
      category,
      description,
      debit: Number(debit || 0),
      credit: Number(credit || 0),
      status: 'Pending',
      created_by: req.user?.user_id || 'USR-001',
      timestamp: date ? new Date(date) : new Date(),
    });

    // Write immutable audit log
    await createAuditEntry({
      user_id: req.user?.user_id || 'USR-001',
      role: req.user?.role || 'Data Entry Officer',
      action_type: 'CREATE',
      module: 'Transactions',
      details: `New ${category} entry created: "${description}" — ${newTxn.debit > 0 ? 'Debit' : 'Credit'} ₦${(newTxn.debit || newTxn.credit).toLocaleString()}`,
      ip_address: req.user?.ipAddress || '127.0.0.1',
    });

    res.status(201).json({
      success: true,
      data: newTxn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction status (Approve, Reject, Flag)
// @route   PUT /api/v1/transactions/:id/status
// @access  Private (AUDITOR, ADMIN)
export const updateTransactionStatus = async (req, res, next) => {
  try {
    const { status, flag_reason } = req.body;

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Flagged'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Choose from: ${validStatuses.join(', ')}` });
    }

    const transaction = await Transaction.findOne({
      $or: [{ txn_id: req.params.id }, { _id: req.params.id }],
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    const previousStatus = transaction.status;
    transaction.status = status;
    if (status === 'Approved') {
      transaction.approved_by = req.user?.user_id || 'USR-003';
    }
    if (flag_reason) {
      transaction.flag_reason = flag_reason;
    }

    await transaction.save();

    // Map to audit action type
    const actionTypeMap = {
      Approved: 'APPROVE',
      Rejected: 'REJECT',
      Flagged: 'FLAG',
      Pending: 'UPDATE',
    };

    // Write immutable audit log
    await createAuditEntry({
      user_id: req.user?.user_id || 'USR-003',
      role: req.user?.role || 'Auditor',
      action_type: actionTypeMap[status] || 'UPDATE',
      module: 'ApprovalWorkflow',
      details: `Status updated for ${transaction.txn_id} ("${transaction.description}"): ${previousStatus} → ${status}${flag_reason ? ` (Reason: ${flag_reason})` : ''}`,
      ip_address: req.user?.ipAddress || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};
