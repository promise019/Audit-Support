/**
 * validator.js — Programmatic Validation Middleware
 * Chapter 3.3.2.1 Algorithm 1: Input Validation & COA Mapping
 */

export const validateTransactionInput = (req, res, next) => {
  const { description, debit, credit, coa_code } = req.body;
  const errors = [];

  // Description check
  if (!description || description.trim().length < 5) {
    errors.push('Description is required and must be at least 5 characters.');
  }
  if (description && description.trim().length > 200) {
    errors.push('Description must not exceed 200 characters.');
  }

  // Debit non-negative
  const deb = Number(debit);
  if (debit !== undefined && (isNaN(deb) || deb < 0)) {
    errors.push('Debit must be a valid non-negative number (>= 0.00).');
  }

  // Credit non-negative
  const cred = Number(credit);
  if (credit !== undefined && (isNaN(cred) || cred < 0)) {
    errors.push('Credit must be a valid non-negative number (>= 0.00).');
  }

  // One side non-zero check
  if (deb === 0 && cred === 0) {
    errors.push('Either Debit or Credit amount must be greater than zero.');
  }

  // Both sides non-zero check
  if (deb > 0 && cred > 0) {
    errors.push('Debit and Credit cannot both be non-zero for a single ledger record.');
  }

  // COA mask check (XXX-NNNN)
  if (!coa_code || !/^[A-Z]{2,4}-\d{3,4}$/.test(coa_code.trim())) {
    errors.push('Account code must match format XXX-NNNN (e.g. COA-1001, REV-001, EXP-103).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed per Chapter 3.3.2.3 Input Controls.',
      errors,
    });
  }

  next();
};
