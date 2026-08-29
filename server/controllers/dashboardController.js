/**
 * dashboardController.js — Executive Financial Analytics & KPIs (IPSAS 24)
 */

import Transaction from '../models/Transaction.js';
import Reconciliation from '../models/Reconciliation.js';
import Budget from '../models/Budget.js';

// @desc    Get aggregated executive dashboard metrics
// @route   GET /api/v1/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    const reconciliations = await Reconciliation.find();
    const budgets = await Budget.find();

    const totalRevenue = transactions
      .filter(t => t.category === 'Revenue')
      .reduce((sum, t) => sum + (t.credit || 0), 0);

    const totalExpenditure = transactions
      .filter(t => t.category === 'Expenditure')
      .reduce((sum, t) => sum + (t.debit || 0), 0);

    const netBalance = totalRevenue - totalExpenditure;

    const pendingApprovals = transactions.filter(t => t.status === 'Pending').length;
    const discrepancyCount = reconciliations.filter(r => r.status !== 'MATCHED').length;

    const totalBudgeted = budgets.reduce((sum, b) => sum + (b.allocated_amount || 0), 0);
    const totalActualSpent = budgets.reduce((sum, b) => sum + (b.actual_spent || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalExpenditure,
        netBalance,
        pendingApprovals,
        discrepancyCount,
        budgetOverview: {
          totalBudgeted,
          totalActualSpent,
          overallVariance: totalActualSpent - totalBudgeted,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
