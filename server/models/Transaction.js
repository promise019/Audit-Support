/**
 * Transaction.js — Mongoose Model for Financial Ledger Transactions
 * Physical Design Schema (Chapter 3.3.2.2 Table 2: Transactions)
 */

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    txn_id: {
      type: String,
      required: [true, 'txn_id is required'],
      unique: true,
      trim: true,
    },
    coa_code: {
      type: String,
      required: [true, 'coa_code is required'],
      trim: true,
      match: [/^[A-Z]{2,4}-\d{3,4}$/, 'coa_code must match format XXX-NNNN (e.g. COA-1001, REV-001)'],
    },
    category: {
      type: String,
      required: [true, 'category is required'],
      enum: ['Revenue', 'Expenditure', 'Assets', 'Liabilities'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [200, 'Description must not exceed 200 characters'],
      trim: true,
    },
    debit: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Debit must be a non-negative number (>= 0.00)'],
    },
    credit: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Credit must be a non-negative number (>= 0.00)'],
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Flagged'],
      default: 'Pending',
    },
    flag_reason: {
      type: String,
      default: null,
      trim: true,
    },
    created_by: {
      type: String, // user_id e.g. USR-001
      required: [true, 'created_by is required'],
    },
    approved_by: {
      type: String, // user_id e.g. USR-003 or null
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save validation: Check that one side is non-zero and both are not simultaneously > 0
transactionSchema.pre('validate', function (next) {
  const deb = Number(this.debit || 0);
  const cred = Number(this.credit || 0);

  if (deb === 0 && cred === 0) {
    this.invalidate('debit', 'Either Debit or Credit must be greater than zero');
    this.invalidate('credit', 'Either Debit or Credit must be greater than zero');
  }

  if (deb > 0 && cred > 0) {
    this.invalidate('debit', 'A single transaction entry cannot have both Debit and Credit amounts');
    this.invalidate('credit', 'A single transaction entry cannot have both Debit and Credit amounts');
  }

  next();
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
