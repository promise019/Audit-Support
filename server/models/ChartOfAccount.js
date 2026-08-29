/**
 * ChartOfAccount.js — Mongoose Model for Chart of Accounts (COA)
 * Chapter 3.3.1.5 Entity Model: ChartOfAccounts
 */

import mongoose from 'mongoose';

const chartOfAccountSchema = new mongoose.Schema(
  {
    coa_code: {
      type: String,
      required: [true, 'coa_code is required'],
      unique: true,
      trim: true,
      match: [/^[A-Z]{2,4}-\d{3,4}$/, 'coa_code must match format XXX-NNNN (e.g. COA-1001, REV-001)'],
    },
    legacy_code: {
      type: String,
      default: null,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'category is required'],
      enum: ['Revenue', 'Expenditure', 'Assets', 'Liabilities'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ChartOfAccount = mongoose.model('ChartOfAccount', chartOfAccountSchema);
export default ChartOfAccount;
