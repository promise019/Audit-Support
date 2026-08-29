/**
 * Budget.js — Mongoose Model for Annual Budgets
 * Physical Design Schema (Chapter 3.3.2.2 Table 3: Budgets)
 */

import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    budget_id: {
      type: String,
      required: [true, 'budget_id is required'],
      unique: true,
      trim: true,
    },
    coa_code: {
      type: String,
      required: [true, 'coa_code is required'],
      trim: true,
    },
    allocated_amount: {
      type: Number,
      required: [true, 'allocated_amount is required'],
      min: [0, 'Allocated amount must be >= 0'],
    },
    actual_spent: {
      type: Number,
      default: 0,
      min: [0, 'Actual spent must be >= 0'],
    },
    fiscal_year: {
      type: Number,
      required: [true, 'fiscal_year is required'],
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for variance (actual - allocated)
budgetSchema.virtual('variance').get(function () {
  return (this.actual_spent || 0) - (this.allocated_amount || 0);
});

// Virtual for percentage deviation
budgetSchema.virtual('variance_percentage').get(function () {
  if (!this.allocated_amount || this.allocated_amount === 0) return 0;
  return Number((((this.actual_spent - this.allocated_amount) / this.allocated_amount) * 100).toFixed(2));
});

// Virtual for anomaly flag (> 15% threshold)
budgetSchema.virtual('is_anomaly').get(function () {
  const pct = Math.abs(this.variance_percentage || 0);
  return pct > 15;
});

export const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
