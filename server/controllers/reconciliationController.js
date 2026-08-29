/**
 * reconciliationController.js — Bank Reconciliation & Discrepancy Matching Engine (ISA 505)
 */

import Reconciliation from '../models/Reconciliation.js';
import Transaction from '../models/Transaction.js';
import { createAuditEntry } from '../middleware/auditLogger.js';

// @desc    Get all reconciliation entries with linked transaction details
// @route   GET /api/v1/reconciliations
// @access  Private
export const getReconciliations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const reconciliations = await Reconciliation.find(query);
    const txnIds = reconciliations.map(r => r.txn_id).filter(Boolean);
    const transactions = await Transaction.find({ txn_id: { $in: txnIds } });
    const txnMap = new Map(transactions.map(t => [t.txn_id, t]));

    const enriched = reconciliations.map(r => ({
      _id: r._id,
      recon_id: r.recon_id,
      txn_id: r.txn_id,
      bank_ref: r.bank_ref,
      bank_amount: r.bank_amount,
      internal_amount: r.internal_amount,
      status: r.status,
      discrepancy_amount: r.discrepancy_amount,
      notes: r.notes,
      internalTxn: r.txn_id ? txnMap.get(r.txn_id) || null : null,
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Execute automated reconciliation matching algorithm (Chapter 3.3.2.1 Algorithm 2)
// @route   POST /api/v1/reconciliations/run
// @access  Private (AUDITOR, ADMIN)
export const runReconciliationBatch = async (req, res, next) => {
  try {
    const { bankStatements } = req.body;
    const records = bankStatements || [];
    const results = [];

    for (const bs of records) {
      // Step 1: Match by reference or matchedTxn
      let internalTxn = null;
      if (bs.matchedTxn) {
        internalTxn = await Transaction.findOne({ txn_id: bs.matchedTxn });
      } else if (bs.reference) {
        internalTxn = await Transaction.findOne({ description: { $regex: bs.reference, $options: 'i' } });
      }

      let status = 'UNMATCHED';
      let discrepancyAmount = 0;
      let notes = '';

      const bankAmt = Number(bs.debit || bs.credit || bs.amount || 0);

      if (!internalTxn) {
        status = 'UNMATCHED';
        notes = 'No corresponding internal transaction found in ledger. Requires investigation.';
      } else {
        const internalAmt = Number(internalTxn.debit || internalTxn.credit || 0);
        const variance = Math.abs(bankAmt - internalAmt);

        if (variance === 0) {
          status = 'MATCHED';
          notes = `Exact match verified against ${internalTxn.txn_id}`;
        } else {
          status = 'DISCREPANCY';
          discrepancyAmount = variance;
          notes = `Bank amount ₦${bankAmt.toLocaleString()} differs from internal ledger ₦${internalAmt.toLocaleString()} by ₦${variance.toLocaleString()}`;
        }
      }

      // Upsert into Reconciliations collection
      const year = new Date().getFullYear();
      const rand = Math.floor(Math.random() * 9000) + 1000;
      const recon_id = bs.id ? `REC-${bs.id.replace(/\D/g, '')}` : `REC-${year}-${rand}`;

      const rec = await Reconciliation.findOneAndUpdate(
        { bank_ref: bs.reference || bs.bank_ref || recon_id },
        {
          recon_id,
          txn_id: internalTxn ? internalTxn.txn_id : null,
          bank_ref: bs.reference || bs.bank_ref || recon_id,
          bank_amount: bankAmt,
          internal_amount: internalTxn ? Number(internalTxn.debit || internalTxn.credit || 0) : 0,
          status,
          discrepancy_amount: discrepancyAmount,
          notes,
        },
        { upsert: true, new: true }
      );

      results.push(rec);
    }

    // Write batch audit log
    await createAuditEntry({
      user_id: req.user?.user_id || 'USR-003',
      role: req.user?.role || 'Auditor',
      action_type: 'RECONCILE',
      module: 'Reconciliation',
      details: `Automated reconciliation executed: ${results.length} bank statements processed (${results.filter(r => r.status === 'MATCHED').length} Matched, ${results.filter(r => r.status === 'DISCREPANCY').length} Discrepancies, ${results.filter(r => r.status === 'UNMATCHED').length} Unmatched)`,
      ip_address: req.user?.ipAddress || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
