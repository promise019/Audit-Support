/**
 * budgetController.js — Annual Budgets & Variance Analysis (IPSAS 24, ISA 520)
 */

import Budget from '../models/Budget.js';
import ChartOfAccount from '../models/ChartOfAccount.js';
import { createAuditEntry } from '../middleware/auditLogger.js';

// @desc    Get all budgets with variance calculations and anomaly flags
// @route   GET /api/v1/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const { fiscal_year } = req.query;
    const query = {};
    if (fiscal_year) query.fiscal_year = Number(fiscal_year);

    const budgets = await Budget.find(query);
    const coas = await ChartOfAccount.find();
    const coaMap = new Map(coas.map(c => [c.coa_code, c]));

    const enrichedBudgets = budgets.map(b => {
      const coa = coaMap.get(b.coa_code);
      const allocated = b.allocated_amount || 0;
      const spent = b.actual_spent || 0;
      const variance = spent - allocated;
      const pct = allocated > 0 ? Number(((variance / allocated) * 100).toFixed(1)) : 0;
      const isAnomaly = Math.abs(pct) > 15;

      return {
        _id: b._id,
        budget_id: b.budget_id,
        coa_code: b.coa_code,
        category: coa?.name || b.coa_code,
        allocated_amount: allocated,
        actual_spent: spent,
        variance,
        variance_percentage: pct,
        is_anomaly: isAnomaly,
        fiscal_year: b.fiscal_year,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedBudgets.length,
      data: enrichedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a budget line
// @route   POST /api/v1/budgets
// @access  Private (ADMIN)
export const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { coa_code, allocated_amount, actual_spent, fiscal_year } = req.body;
    const year = fiscal_year || new Date().getFullYear();

    let budget = await Budget.findOne({ coa_code, fiscal_year: year });

    if (budget) {
      budget.allocated_amount = allocated_amount !== undefined ? allocated_amount : budget.allocated_amount;
      budget.actual_spent = actual_spent !== undefined ? actual_spent : budget.actual_spent;
      await budget.save();
    } else {
      const count = await Budget.countDocuments();
      const budget_id = `BUD-${year}-${String(count + 1).padStart(3, '0')}`;
      budget = await Budget.create({
        budget_id,
        coa_code,
        allocated_amount,
        actual_spent: actual_spent || 0,
        fiscal_year: year,
      });
    }

    await createAuditEntry({
      user_id: req.user?.user_id || 'USR-004',
      role: req.user?.role || 'Administrator',
      action_type: 'UPDATE',
      module: 'VarianceAnalysis',
      details: `Budget updated for ${coa_code} (FY ${year}): Allocated ₦${allocated_amount?.toLocaleString()}`,
      ip_address: req.user?.ipAddress || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};
