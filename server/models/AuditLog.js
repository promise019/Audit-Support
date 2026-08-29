/**
 * AuditLog.js — Mongoose Model for Immutable Electronic Audit Trail
 * Physical Design Schema (Chapter 3.3.2.2 Table 5: AuditLogs)
 * Non-Repudiation Guarantee: Append-only, update and delete operations blocked.
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    log_id: {
      type: String,
      required: [true, 'log_id is required'],
      unique: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    user_id: {
      type: String,
      required: [true, 'user_id is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
    },
    action_type: {
      type: String,
      required: [true, 'action_type is required'],
      enum: ['CREATE', 'APPROVE', 'REJECT', 'FLAG', 'SUBMIT', 'AUTH', 'RECONCILE', 'UPDATE', 'DELETE_ATTEMPT'],
    },
    module: {
      type: String,
      required: [true, 'module is required'],
      trim: true,
    },
    details: {
      type: String,
      required: [true, 'details are required'],
      trim: true,
    },
    ip_address: {
      type: String,
      required: true,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: false, // Explicit timestamps handled by `timestamp` field
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Immutability Enforcement (ISA 230 Standard) ─────────────────────────────
auditLogSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne'], function (next) {
  const error = new Error('CFASS Security Violation: AuditLogs are immutable and cannot be updated.');
  next(error);
});

auditLogSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete', 'findOneAndRemove'], function (next) {
  const error = new Error('CFASS Security Violation: AuditLogs are immutable and cannot be deleted.');
  next(error);
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
