/**
 * Reconciliation.js — Mongoose Model for Bank Reconciliations
 * Physical Design Schema (Chapter 3.3.2.2 Table 4: Reconciliations)
 */

import mongoose from 'mongoose';

const reconciliationSchema = new mongoose.Schema(
  {
    recon_id: {
      type: String,
      required: [true, 'recon_id is required'],
      unique: true,
      trim: true,
    },
    txn_id: {
      type: String, // linked transaction ID (e.g. TXN-2024-001) or null
      default: null,
      trim: true,
    },
    bank_ref: {
      type: String,
      required: [true, 'bank_ref is required'],
      unique: true,
      trim: true,
    },
    bank_amount: {
      type: Number,
      default: 0,
    },
    internal_amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['MATCHED', 'DISCREPANCY', 'UNMATCHED'],
      default: 'MATCHED',
    },
    discrepancy_amount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Reconciliation = mongoose.model('Reconciliation', reconciliationSchema);
export default Reconciliation;
