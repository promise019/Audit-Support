/**
 * AuditContext.jsx — Global state management for CFASS.
 *
 * This context acts as the application's "in-memory database", providing
 * all financial data and mutation functions to every component in the tree.
 * In a production system, these operations would make API calls to a backend.
 *
 * Auditing principle: Centralised state ensures data consistency and
 * provides a single source of truth — a fundamental requirement for
 * audit evidence integrity (ISA 500).
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  USERS,
  INITIAL_TRANSACTIONS,
  BANK_STATEMENTS,
  BUDGET_LINES,
  BUDGETS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOG,
  RECONCILIATIONS,
} from '../data/mockData';
import { generateId, nowISO } from '../utils/formatters';

// ─── Context Definition ───────────────────────────────────────────────────────
const AuditContext = createContext(null);

// ─── Provider Component ───────────────────────────────────────────────────────
export function AuditProvider({ children }) {
  // --- Authentication State (First screen is always Login) ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- Core State ---
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [bankStatements]                = useState(BANK_STATEMENTS);   // read-only (external data)
  const [budgetLines]                   = useState(BUDGET_LINES);       // read-only (planning data)
  const [budgets]                       = useState(BUDGETS);            // physical schema budgets
  const [users]                         = useState(USERS);              // physical schema users
  const [reconciliations]               = useState(RECONCILIATIONS);    // physical schema reconciliations
  const [approvals, setApprovals]       = useState(INITIAL_APPROVALS);
  const [auditLog, setAuditLog]         = useState(INITIAL_AUDIT_LOG);

  // --- UI / Presentation State ---
  const [defenseMode, setDefenseMode]   = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  // ─── Input Validation Engine ──────────────────────────────────────────────
  /**
   * validateTransaction — Programmatic validation per Chapter 3.3.2.3 System Controls.
   * Enforces: COA mask (XXX-NNNN), non-negative debit/credit, required fields.
   * @param {object} txnData - Raw transaction form data
   * @returns {{ valid: boolean, errors: string[] }}
   */
  const validateTransaction = useCallback((txnData) => {
    const errors = [];
    // Rule 1: Description must be non-empty (length 5–200 chars)
    if (!txnData.description || txnData.description.trim().length < 5) {
      errors.push('Description is required and must be at least 5 characters.');
    }
    if (txnData.description && txnData.description.trim().length > 200) {
      errors.push('Description must not exceed 200 characters.');
    }
    // Rule 2: Debit must be a non-negative number
    if (txnData.debit === undefined || txnData.debit === null || isNaN(txnData.debit) || Number(txnData.debit) < 0) {
      errors.push('Debit amount must be a non-negative number (≥ 0.00).');
    }
    // Rule 3: Credit must be a non-negative number
    if (txnData.credit === undefined || txnData.credit === null || isNaN(txnData.credit) || Number(txnData.credit) < 0) {
      errors.push('Credit amount must be a non-negative number (≥ 0.00).');
    }
    // Rule 4: One of debit or credit must be non-zero
    if (Number(txnData.debit) === 0 && Number(txnData.credit) === 0) {
      errors.push('Either Debit or Credit amount must be greater than zero.');
    }
    // Rule 5: Both debit and credit cannot be non-zero simultaneously
    if (Number(txnData.debit) > 0 && Number(txnData.credit) > 0) {
      errors.push('Debit and Credit cannot both be non-zero for a single entry.');
    }
    // Rule 6: COA code format mask — must match pattern (e.g. REV-001 or COA-1001)
    if (txnData.accountCode && !/^[A-Z]{2,4}-\d{3,4}$/.test(txnData.accountCode.trim())) {
      errors.push('Account Code must match format XXX-NNNN (e.g. COA-1001, REV-001).');
    }
    // Rule 7: Date must be valid ISO format (YYYY-MM-DD)
    if (txnData.date && isNaN(new Date(txnData.date).getTime())) {
      errors.push('Date must be a valid date in YYYY-MM-DD format.');
    }
    return { valid: errors.length === 0, errors };
  }, []);

  // ─── Audit Trail Helper ───────────────────────────────────────────────────
  /**
   * addAuditEvent — Appends an immutable log entry to the audit trail.
   * Every financial action in the system calls this function.
   * This ensures full traceability as required by ISA 230.
   */
  const addAuditEvent = useCallback((action, recordRef, description, outcome = 'Success', userObj = currentUser, module = 'System') => {
    const actionTypeMap = {
      'Created Record': 'CREATE', 'Approved Record': 'APPROVE', 'Final Approval Granted': 'APPROVE',
      'Flagged Record': 'FLAG', 'Rejected Record': 'REJECT', 'Submitted for Approval': 'SUBMIT',
      'User Authentication': 'AUTH', 'User Logout': 'AUTH', 'Reconciliation Run': 'RECONCILE',
    };
    const actor = userObj || { name: 'System User', role: 'Staff', ipAddress: '127.0.0.1', user_id: 'USR-SESS' };
    const newEvent = {
      id: generateId('AUD'),      log_id: generateId('AUD'),
      timestamp: nowISO(),
      user: actor.name || 'System User',         user_id: actor.user_id || 'USR-SESS',
      role: actor.role || 'Staff',
      action,                     action_type: actionTypeMap[action] || 'UPDATE',
      module,
      recordRef,
      description,
      details: description,
      outcome,
      ipAddress: actor.ipAddress || '127.0.0.1', ip_address: actor.ipAddress || '127.0.0.1',
    };
    // Prepend to show most recent first
    setAuditLog(prev => [newEvent, ...prev]);
    return newEvent;
  }, [currentUser]);

  // ─── Authentication Actions ────────────────────────────────────────────────
  const login = useCallback((userCredentials) => {
    setCurrentUser(userCredentials);
    setIsAuthenticated(true);
    addAuditEvent(
      'User Authentication',
      'AUTH-SESSION',
      `User ${userCredentials.name} (${userCredentials.role}) logged into system`,
      'Success',
      userCredentials
    );
  }, [addAuditEvent]);

  const logout = useCallback(() => {
    if (currentUser) {
      addAuditEvent(
        'User Logout',
        'AUTH-SESSION',
        `User ${currentUser.name} (${currentUser.role}) logged out of system`,
        'Success',
        currentUser
      );
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, [currentUser, addAuditEvent]);

  // ─── Transaction Mutations ────────────────────────────────────────────────
  /**
   * addTransaction — Logs a new financial entry to the ledger.
   * Automatically generates a reference ID and writes an audit event.
   */
  const addTransaction = useCallback((txnData) => {
    // ── Programmatic validation (Chapter 3.3.2.3 System Controls) ──
    const { valid, errors } = validateTransaction(txnData);
    if (!valid) {
      const errorMsg = errors.join(' | ');
      addAuditEvent('Created Record', 'VALIDATION-FAIL', `VALIDATION FAILED: ${errorMsg}`, 'Error — Rejected by System', currentUser, 'Transactions');
      throw new Error(errorMsg);
    }
    const id = generateId('TXN');
    const newTxn = {
      id,                     txn_id: id,
      ...txnData,
      coa_code: txnData.accountCode, // mirror physical schema field
      status: 'Pending',
      enteredBy: `${currentUser.name} (${currentUser.role})`,
      created_by: currentUser.user_id || 'USR-SESS',
      approvedBy: null,       approved_by: null,
      timestamp: nowISO(),
      balance: 0, // Simplified; production recalculates the running balance
    };
    setTransactions(prev => [newTxn, ...prev]);
    addAuditEvent(
      'Created Record',
      id,
      `New ${txnData.category} entry: "${txnData.description}" — ${txnData.debit > 0 ? 'Debit' : 'Credit'} ₦${(txnData.debit || txnData.credit).toLocaleString()}`,
      'Success — Pending Approval',
      currentUser,
      'Transactions'
    );
    return id;
  }, [currentUser, addAuditEvent, validateTransaction]);

  /**
   * updateTransactionStatus — Changes the status of an existing transaction.
   */
  const updateTransactionStatus = useCallback((txnId, newStatus, note = '') => {
    setTransactions(prev => prev.map(t =>
      t.id === txnId
        ? { ...t, status: newStatus, approvedBy: `${currentUser.name} (${currentUser.role})`, flagReason: note }
        : t
    ));
  }, [currentUser]);

  // ─── Approval Workflow Mutations ──────────────────────────────────────────
  const STAGE_LABELS = ['Data Entry Officer', 'Auditor', 'Faculty Administrator'];

  /**
   * approveApproval — Advances an approval item to the next workflow stage.
   * If at the final stage, marks the linked transaction as Approved.
   */
  const approveApproval = useCallback((approvalId) => {
    setApprovals(prev => prev.map(apr => {
      if (apr.id !== approvalId) return apr;
      const nextStage = apr.currentStage + 1;
      const isComplete = nextStage >= 3;

      const historyEntry = {
        stage: apr.currentStage,
        actor: currentUser.name,
        action: isComplete ? 'Final Approval' : 'Approved — Escalated',
        timestamp: nowISO(),
      };

      addAuditEvent(
        isComplete ? 'Final Approval Granted' : 'Approved Record',
        apr.txnId,
        `${currentUser.role} approved "${apr.description}" — ${isComplete ? 'Fully Authorised' : `Escalated to ${STAGE_LABELS[nextStage]}`}`,
        isComplete ? 'Approved' : `Escalated to Stage ${nextStage}`
      );

      if (isComplete) {
        updateTransactionStatus(apr.txnId, 'Approved');
      }

      return {
        ...apr,
        currentStage: Math.min(nextStage, 3),
        stageHistory: [...apr.stageHistory, historyEntry],
      };
    }));
  }, [currentUser, addAuditEvent, updateTransactionStatus]);

  /**
   * flagApproval — Flags an approval item for further review.
   */
  const flagApproval = useCallback((approvalId, note) => {
    setApprovals(prev => prev.map(apr => {
      if (apr.id !== approvalId) return apr;
      addAuditEvent(
        'Flagged Record',
        apr.txnId,
        `${currentUser.role} flagged "${apr.description}" for review. Note: ${note}`,
        'Flagged — Pending Resolution'
      );
      updateTransactionStatus(apr.txnId, 'Flagged', note);
      return { ...apr, flagNote: note, stageHistory: [...apr.stageHistory, {
        stage: apr.currentStage, actor: currentUser.name,
        action: 'Flagged', timestamp: nowISO(), note,
      }]};
    }));
  }, [currentUser, addAuditEvent, updateTransactionStatus]);

  /**
   * rejectApproval — Rejects an approval item and removes it from the active queue.
   */
  const rejectApproval = useCallback((approvalId, reason) => {
    setApprovals(prev => prev.map(apr => {
      if (apr.id !== approvalId) return apr;
      addAuditEvent(
        'Rejected Record',
        apr.txnId,
        `${currentUser.role} rejected "${apr.description}". Reason: ${reason}`,
        'Rejected'
      );
      updateTransactionStatus(apr.txnId, 'Rejected', reason);
      return { ...apr, rejected: true, rejectReason: reason, stageHistory: [...apr.stageHistory, {
        stage: apr.currentStage, actor: currentUser.name,
        action: 'Rejected', timestamp: nowISO(), note: reason,
      }]};
    }));
  }, [currentUser, addAuditEvent, updateTransactionStatus]);

  // ─── Derived Computed Values ──────────────────────────────────────────────
  const totalRevenue     = transactions.filter(t => t.category === 'Revenue').reduce((s, t) => s + t.credit, 0);
  const totalExpenditure = transactions.filter(t => t.category === 'Expenditure').reduce((s, t) => s + t.debit, 0);
  const netBalance       = totalRevenue - totalExpenditure;
  const discrepancyCount = bankStatements.filter(b => b.status !== 'Matched').length;
  const pendingApprovals = approvals.filter(a => !a.rejected && a.currentStage < 3).length;

  // ─── Context Value ────────────────────────────────────────────────────────
  const value = {
    // Auth State & Actions
    isAuthenticated,
    login,
    logout,
    currentUser,
    // Data (core)
    transactions, bankStatements, budgetLines, approvals, auditLog,
    // Data (physical schema — Chapter 3.3.2.2)
    users, budgets, reconciliations,
    // Computed
    totalRevenue, totalExpenditure, netBalance, discrepancyCount, pendingApprovals,
    // Validation
    validateTransaction,
    // Transaction actions
    addTransaction, updateTransactionStatus,
    // Approval actions
    approveApproval, flagApproval, rejectApproval,
    // Audit trail
    addAuditEvent,
    // UI state
    defenseMode, setDefenseMode,
    activeModule, setActiveModule,
  };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
}

// ─── Consumer Hook ────────────────────────────────────────────────────────────
export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within an AuditProvider');
  return ctx;
}
