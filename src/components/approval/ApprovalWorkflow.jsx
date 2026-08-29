/**
 * ApprovalWorkflow.jsx — Module 5: Multi-Level Authorization Pipeline
 *
 * Implements a 3-stage sequential approval workflow:
 *   Stage 0: Data Entry Officer  (submission)
 *   Stage 1: Auditor             (financial review)
 *   Stage 2: Faculty Admin       (final authorization)
 *
 * Each stage has interactive Approve / Flag / Reject buttons.
 * Actions write to the audit trail and update transaction status in context.
 *
 * Audit principle: COSO Internal Control — Segregation of Duties.
 * No single individual may initiate, authorize, and record a transaction.
 */

import React, { useState } from 'react';
import {
  GitBranch, CheckCircle2, AlertTriangle, XCircle,
  Clock, ChevronRight, User, MessageSquare, Info
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { DEFENSE_PRINCIPLES } from '../../data/mockData';
import { formatNGN, formatTimestamp } from '../../utils/formatters';
import DefenseBanner from '../layout/DefenseBanner';
import StatusBadge from '../ui/StatusBadge';

// Stage configuration
const STAGES = [
  { label: 'Data Entry',        role: 'Data Entry Officer', color: 'blue'    },
  { label: 'Auditor Review',    role: 'Auditor',            color: 'purple'  },
  { label: 'Faculty Admin',     role: 'Faculty Administrator', color: 'green' },
];

// ─── Pipeline Stage Tracker ────────────────────────────────────────────────────
function PipelineTracker({ currentStage, stageHistory, isRejected }) {
  return (
    <div className="flex items-center gap-0 mt-3 mb-1">
      {STAGES.map((stage, idx) => {
        const isDone     = currentStage > idx || (!isRejected && currentStage === 3 && idx < 3);
        const isCurrent  = currentStage === idx && !isRejected;
        const isFuture   = currentStage < idx;
        const histEntry  = stageHistory.find(h => h.stage === idx);

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center min-w-0 flex-1">
              {/* Node */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0
                transition-all duration-300
                ${isDone    ? 'bg-emerald-500 border-emerald-400' :
                  isCurrent ? 'bg-brand-600 border-brand-400 shadow-lg shadow-brand-700/50' :
                  isRejected ? 'bg-red-500/20 border-red-700/40' :
                  'bg-slate-800 border-slate-600'}`}
              >
                {isDone    ? <CheckCircle2 size={14} className="text-white" /> :
                 isCurrent ? <Clock size={13} className="text-white animate-pulse" /> :
                 isRejected ? <XCircle size={13} className="text-red-400" /> :
                 <span className="text-xs font-bold text-slate-500">{idx + 1}</span>}
              </div>

              {/* Label */}
              <div className={`text-xs font-semibold mt-1 text-center leading-tight
                ${isDone ? 'text-emerald-400' : isCurrent ? 'text-brand-300' : 'text-slate-600'}`}>
                {stage.label}
              </div>

              {/* Action taken */}
              {histEntry && (
                <div className="text-xs text-slate-500 text-center leading-tight mt-0.5 truncate max-w-[80px]" title={histEntry.action}>
                  {histEntry.action}
                </div>
              )}
            </div>

            {/* Connector line (not after last) */}
            {idx < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 transition-colors duration-500
                ${currentStage > idx ? 'bg-emerald-500' : 'bg-slate-700'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Flag / Reject Action Modal (inline) ──────────────────────────────────────
function NoteInput({ prompt, onConfirm, onCancel, confirmLabel, confirmClass }) {
  const [note, setNote] = useState('');
  return (
    <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700 space-y-2">
      <label className="form-label">{prompt}</label>
      <textarea
        rows={2}
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Enter your reason or note…"
        className="form-input resize-none text-xs"
      />
      <div className="flex gap-2">
        <button
          onClick={() => note.trim() && onConfirm(note.trim())}
          disabled={!note.trim()}
          className={`${confirmClass} px-3 py-1.5 rounded-lg text-xs font-bold
                      transition-colors disabled:opacity-40`}
        >
          {confirmLabel}
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs px-3 py-1.5">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Approval Card ─────────────────────────────────────────────────────────────
function ApprovalCard({ apr }) {
  const { approveApproval, flagApproval, rejectApproval, currentUser } = useAudit();
  const [action, setAction] = useState(null); // 'flag' | 'reject'

  const isComplete   = apr.currentStage >= 3;
  const isRejected   = apr.rejected;
  const isActionable = apr.currentStage === (currentUser?.roleLevel ?? -1) && !isComplete && !isRejected;
  const priorityColors = {
    Urgent: 'border-l-red-500',
    High:   'border-l-amber-500',
    Normal: 'border-l-brand-500',
  };

  return (
    <div className={`glass-card p-5 border-l-4 ${priorityColors[apr.priority] || 'border-l-slate-600'} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="mono text-brand-400 text-xs">{apr.txnId}</span>
            <StatusBadge
              status={isRejected ? 'Rejected' : isComplete ? 'Approved' : 'Pending'}
            />
            {apr.priority !== 'Normal' && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border
                ${apr.priority === 'Urgent'
                  ? 'bg-red-500/15 border-red-600/30 text-red-400'
                  : 'bg-amber-500/15 border-amber-600/30 text-amber-400'}`}>
                {apr.priority}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-white leading-snug">{apr.description}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User size={11} /> {apr.requestedBy}
            </span>
            <span>·</span>
            <span>{apr.requestDate}</span>
            <span>·</span>
            <span className="font-semibold text-slate-300">{formatNGN(apr.amount)}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Tracker */}
      <PipelineTracker
        currentStage={apr.currentStage}
        stageHistory={apr.stageHistory}
        isRejected={isRejected}
      />

      {/* Flag note */}
      {apr.flagNote && (
        <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-amber-900/20 border border-amber-700/30">
          <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300">{apr.flagNote}</div>
        </div>
      )}
      {apr.rejectReason && (
        <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-red-900/20 border border-red-700/30">
          <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-300">Rejection reason: {apr.rejectReason}</div>
        </div>
      )}

      {/* Stage history timeline */}
      {apr.stageHistory.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-slate-700/40 pt-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">History</div>
          {apr.stageHistory.map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
              <span className="font-semibold text-slate-400">{h.actor}</span>
              <span>—</span>
              <span>{h.action}</span>
              {h.note && <span className="text-slate-600">({h.note})</span>}
              <span className="ml-auto font-mono text-slate-600 shrink-0">
                {formatTimestamp(h.timestamp).split(',')[1]?.trim() || ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons (only if current user's role matches current stage) */}
      {isActionable && !action && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/40">
          <div className="flex items-center gap-1 text-xs text-slate-500 mr-auto">
            <Info size={12} />
            Your action as: <strong className="text-brand-400 ml-1">{currentUser.role}</strong>
          </div>
          <button
            onClick={() => approveApproval(apr.id)}
            id={`approve-${apr.id}`}
            className="btn-success flex items-center gap-1.5"
          >
            <CheckCircle2 size={13} />
            Approve
          </button>
          <button
            onClick={() => setAction('flag')}
            id={`flag-${apr.id}`}
            className="btn-warn flex items-center gap-1.5"
          >
            <AlertTriangle size={13} />
            Flag
          </button>
          <button
            onClick={() => setAction('reject')}
            id={`reject-${apr.id}`}
            className="btn-danger flex items-center gap-1.5"
          >
            <XCircle size={13} />
            Reject
          </button>
        </div>
      )}

      {/* Flag note input */}
      {action === 'flag' && (
        <NoteInput
          prompt="Flag Reason *"
          onConfirm={(note) => { flagApproval(apr.id, note); setAction(null); }}
          onCancel={() => setAction(null)}
          confirmLabel="Confirm Flag"
          confirmClass="bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-600/40"
        />
      )}

      {/* Reject reason input */}
      {action === 'reject' && (
        <NoteInput
          prompt="Rejection Reason *"
          onConfirm={(reason) => { rejectApproval(apr.id, reason); setAction(null); }}
          onCancel={() => setAction(null)}
          confirmLabel="Confirm Rejection"
          confirmClass="bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-600/40"
        />
      )}

      {/* Not actionable by current role */}
      {!isActionable && !isComplete && !isRejected && (
        <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center gap-2 text-xs text-slate-600">
          <Clock size={12} />
          Awaiting action from: <strong className="text-slate-500 ml-1">{STAGES[apr.currentStage]?.role}</strong>
        </div>
      )}

      {isComplete && !isRejected && (
        <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center gap-2 text-xs text-emerald-500">
          <CheckCircle2 size={13} />
          Fully authorised and processed.
        </div>
      )}
    </div>
  );
}

// ─── Main Approval Workflow Component ─────────────────────────────────────────
export default function ApprovalWorkflow() {
  const { approvals, defenseMode, currentUser } = useAudit();
  const [showCompleted, setShowCompleted] = useState(false);

  const active    = approvals.filter(a => !a.rejected && a.currentStage < 3);
  const completed = approvals.filter(a => !a.rejected && a.currentStage >= 3);
  const rejected  = approvals.filter(a => a.rejected);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <GitBranch size={20} className="text-brand-400" />
            Multi-Level Approval Workflow
          </h1>
          <p className="section-sub">
            3-stage authorization pipeline · Acting as: <strong className="text-brand-400">{currentUser?.role || 'Guest'}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          {active.length} Pending
          <div className="w-2 h-2 rounded-full bg-emerald-400 ml-2" />
          {completed.length} Approved
        </div>
      </div>

      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.approval} />}

      {/* Pipeline Legend */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
          Authorization Pipeline
        </div>
        <div className="flex items-center gap-2">
          {STAGES.map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 flex flex-col items-center text-center">
                <div className={`px-3 py-2 rounded-lg border w-full
                  ${idx === (currentUser?.roleLevel ?? -1)
                    ? 'bg-brand-700/40 border-brand-600/50 text-brand-300'
                    : 'bg-slate-800/60 border-slate-700/40 text-slate-500'}`}>
                  <div className="text-xs font-bold">{stage.label}</div>
                  <div className="text-xs opacity-70">{stage.role}</div>
                </div>
              </div>
              {idx < STAGES.length - 1 && (
                <ChevronRight size={18} className="text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-xs text-slate-600 mt-2 text-center">
          Your current role (<strong className="text-brand-400">{currentUser?.role || 'Guest'}</strong>) is highlighted
        </div>
      </div>

      {/* ─── Active Approvals ─────────────────────────────── */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Clock size={15} className="text-amber-400" />
          Pending Approvals ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-500 text-sm">
            No pending approvals. All items are processed.
          </div>
        ) : (
          <div className="space-y-4">
            {active.map(apr => <ApprovalCard key={apr.id} apr={apr} />)}
          </div>
        )}
      </div>

      {/* ─── Rejected ──────────────────────────────────────── */}
      {rejected.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
            <XCircle size={15} />
            Rejected ({rejected.length})
          </h2>
          <div className="space-y-4">
            {rejected.map(apr => <ApprovalCard key={apr.id} apr={apr} />)}
          </div>
        </div>
      )}

      {/* ─── Completed toggle ────────────────────────────── */}
      {completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(s => !s)}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-400
                       hover:text-emerald-300 transition-colors"
          >
            <CheckCircle2 size={15} />
            Fully Approved ({completed.length})
            <ChevronRight size={14} className={`transition-transform ${showCompleted ? 'rotate-90' : ''}`} />
          </button>
          {showCompleted && (
            <div className="space-y-4 mt-3">
              {completed.map(apr => <ApprovalCard key={apr.id} apr={apr} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
