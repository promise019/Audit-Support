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
  INITIAL_TRANSACTIONS,
  BANK_STATEMENTS,
  BUDGET_LINES,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOG,
} from '../data/mockData';
import { generateId, nowISO } from '../utils/formatters';

// ─── Context Definition ───────────────────────────────────────────────────────
const AuditContext = createContext(null);

// ─── Provider Component ───────────────────────────────────────────────────────
export function AuditProvider({ children }) {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Effiong Bassey',
    email: 'admin@unical.edu.ng',
    role: 'Auditor',
    roleLevel: 1, // 0=DataEntry, 1=Auditor, 2=FacultyAdmin
    ipAddress: '10.20.5.210',
  });

  // --- Core State ---
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [bankStatements]                = useState(BANK_STATEMENTS);   // read-only (external data)
  const [budgetLines]                   = useState(BUDGET_LINES);       // read-only (planning data)
  const [approvals, setApprovals]       = useState(INITIAL_APPROVALS);
  const [auditLog, setAuditLog]         = useState(INITIAL_AUDIT_LOG);

  // --- UI / Presentation State ---
  const [defenseMode, setDefenseMode]   = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  // ─── Audit Trail Helper ───────────────────────────────────────────────────
  /**
   * addAuditEvent — Appends an immutable log entry to the audit trail.
   * Every financial action in the system calls this function.
   * This ensures full traceability as required by ISA 230.
   */
  const addAuditEvent = useCallback((action, recordRef, description, outcome = 'Success', userObj = currentUser) => {
    const newEvent = {
      id: generateId('AUD'),
      timestamp: nowISO(),
      user: userObj.name,
      role: userObj.role,
      action,
      recordRef,
      description,
      outcome,
      ipAddress: userObj.ipAddress,
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
    addAuditEvent(
      'User Logout',
      'AUTH-SESSION',
      `User ${currentUser.name} (${currentUser.role}) logged out of system`,
      'Success'
    );
    setIsAuthenticated(false);
  }, [currentUser, addAuditEvent]);

  // ─── Transaction Mutations ────────────────────────────────────────────────
  /**
   * addTransaction — Logs a new financial entry to the ledger.
   * Automatically generates a reference ID and writes an audit event.
   */
  const addTransaction = useCallback((txnData) => {
    const id = generateId('TXN');
    const newTxn = {
      id,
      ...txnData,
      status: 'Pending',
      enteredBy: `${currentUser.name} (${currentUser.role})`,
      approvedBy: null,
      balance: 0, // Simplified; in production this would recalculate the running balance
    };
    setTransactions(prev => [newTxn, ...prev]);
    addAuditEvent(
      'Created Record',
      id,
      `New ${txnData.category} entry: "${txnData.description}" — ${txnData.debit > 0 ? 'Debit' : 'Credit'} ₦${(txnData.debit || txnData.credit).toLocaleString()}`,
      'Success — Pending Approval'
    );
    return id;
  }, [currentUser, addAuditEvent]);

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
    // Data
    transactions, bankStatements, budgetLines, approvals, auditLog,
    // Computed
    totalRevenue, totalExpenditure, netBalance, discrepancyCount, pendingApprovals,
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
