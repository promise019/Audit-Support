/**
 * Reconciliation.jsx — Module 3: Data Validation & Bank Reconciliation
 *
 * Displays a two-panel comparison:
 *   Left  — Internal faculty ledger records
 *   Right — Bank statement entries
 *
 * Auto-matches entries by ID reference. Highlights:
 *   ✓ Matched    (green)  — amounts agree exactly
 *   ⚠ Discrepancy (amber) — same reference but amounts differ
 *   ✗ Unmatched  (red)   — present in bank but not in internal records (or vice versa)
 *
 * Audit principle: ISA 505 (External Confirmations) — auditors must
 * obtain independent external evidence to corroborate internal records.
 */

import React, { useState, useMemo } from 'react';
import {
  GitCompare, CheckCircle2, AlertTriangle, XCircle,
  ChevronDown, RefreshCw, DownloadCloud
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { DEFENSE_PRINCIPLES } from '../../data/mockData';
import { formatNGN, formatDate } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import DefenseBanner from '../layout/DefenseBanner';

// ─── Status icon helper ───────────────────────────────────────────────────────
function MatchIcon({ status }) {
  if (status === 'Matched')     return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
  if (status === 'Discrepancy') return <AlertTriangle size={16} className="text-amber-400 shrink-0"  />;
  return <XCircle size={16} className="text-red-400 shrink-0" />;
}

// ─── Row colors ───────────────────────────────────────────────────────────────
function rowClass(status) {
  if (status === 'Matched')     return 'hover:bg-emerald-900/10';
  if (status === 'Discrepancy') return 'bg-amber-900/10 hover:bg-amber-900/15';
  return 'bg-red-900/10 hover:bg-red-900/15';
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, count, amount, color }) {
  const colors = {
    green:  'border-emerald-600/30 bg-emerald-500/10 text-emerald-400',
    amber:  'border-amber-600/30 bg-amber-500/10 text-amber-400',
    red:    'border-red-600/30 bg-red-500/10 text-red-400',
  };
  return (
    <div className={`glass-card border p-4 ${colors[color]}`}>
      <div className="text-2xl font-black">{count}</div>
      <div className="text-xs font-semibold text-slate-300 mt-0.5">{label}</div>
      {amount !== undefined && (
        <div className="text-xs font-mono mt-1 opacity-80">{formatNGN(amount, true)}</div>
      )}
    </div>
  );
}

// ─── Main Reconciliation Component ────────────────────────────────────────────
export default function Reconciliation() {
  const { bankStatements, transactions, defenseMode } = useAudit();
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // ─── Compute reconciliation data ──────────────────────────
  const reconciled = useMemo(() => {
    return bankStatements.map(bs => {
      const internalTxn = bs.matchedTxn
        ? transactions.find(t => t.id === bs.matchedTxn)
        : null;
      return { ...bs, internalTxn };
    });
  }, [bankStatements, transactions]);

  const filtered = filter === 'All' ? reconciled : reconciled.filter(r => r.status === filter);

  // Summary stats
  const matchedCount      = reconciled.filter(r => r.status === 'Matched').length;
  const discrepancyCount  = reconciled.filter(r => r.status === 'Discrepancy').length;
  const unmatchedCount    = reconciled.filter(r => r.status === 'Unmatched').length;
  const discrepancyAmount = reconciled
    .filter(r => r.discrepancyAmount)
    .reduce((s, r) => s + (r.discrepancyAmount || 0), 0);
  const unmatchedAmount   = reconciled
    .filter(r => r.status === 'Unmatched')
    .reduce((s, r) => s + (r.debit || r.credit), 0);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <GitCompare size={20} className="text-brand-400" />
            Data Validation &amp; Reconciliation
          </h1>
          <p className="section-sub">
            Bank statement vs internal records — {bankStatements.length} entries compared
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-secondary flex items-center gap-2 text-xs">
            <RefreshCw size={13} />
            Re-run
          </button>
        </div>
      </div>

      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.reconciliation} />}

      {/* ─── Summary Cards ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Matched Entries"          count={matchedCount}     color="green" />
        <SummaryCard label="Discrepancies"            count={discrepancyCount} amount={discrepancyAmount} color="amber" />
        <SummaryCard label="Unmatched (Bank Only)"    count={unmatchedCount}   amount={unmatchedAmount}   color="red"   />
      </div>

      {/* Reconciliation Status Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Reconciliation Completion</span>
          <span className="text-xs font-bold text-white">
            {Math.round((matchedCount / reconciled.length) * 100)}%
          </span>
        </div>
        <div className="progress-bar h-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-1000"
            style={{ width: `${(matchedCount / reconciled.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ─── Filter Tabs ─────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Matched', 'Discrepancy', 'Unmatched'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
              ${filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-70">
                ({reconciled.filter(r => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Comparison Table ────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="audit-table">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Bank Ref</th>
                <th>Date</th>
                <th>Bank Description</th>
                <th className="text-right">Bank Amount (₦)</th>
                <th>Internal Ref</th>
                <th className="text-right">Internal Amount (₦)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const internalAmt = row.internalTxn
                  ? (row.internalTxn.debit || row.internalTxn.credit)
                  : null;
                const bankAmt = row.debit || row.credit;
                const isExpanded = expandedId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`cursor-pointer ${rowClass(row.status)}`}
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    >
                      <td className="px-3">
                        <MatchIcon status={row.status} />
                      </td>
                      <td><span className="mono text-slate-400">{row.reference}</span></td>
                      <td className="whitespace-nowrap text-slate-400">{formatDate(row.date)}</td>
                      <td className="max-w-[200px]">
                        <div className="truncate">{row.description}</div>
                      </td>
                      <td className="text-right font-mono font-semibold text-white">
                        {formatNGN(bankAmt)}
                      </td>
                      <td>
                        {row.matchedTxn
                          ? <span className="mono text-brand-400">{row.matchedTxn}</span>
                          : <span className="text-red-400 text-xs italic">No match found</span>
                        }
                      </td>
                      <td className={`text-right font-mono font-semibold
                        ${row.status === 'Matched' ? 'text-emerald-400'
                          : row.status === 'Discrepancy' ? 'text-amber-400'
                          : 'text-slate-600'}`}>
                        {internalAmt != null ? formatNGN(internalAmt) : '—'}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <StatusBadge status={row.status} />
                          <ChevronDown size={12} className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded discrepancy detail row */}
                    {isExpanded && (row.discrepancyNote || row.discrepancyAmount) && (
                      <tr>
                        <td colSpan={8} className="px-4 pb-3 pt-0">
                          <div className="mx-2 p-3 rounded-lg bg-amber-900/20 border border-amber-700/30">
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-amber-400 mb-0.5">Discrepancy Detail</div>
                                <div className="text-xs text-amber-200/80">{row.discrepancyNote}</div>
                                {row.discrepancyAmount && (
                                  <div className="text-xs font-mono text-amber-300 mt-1">
                                    Variance: {formatNGN(row.discrepancyAmount)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
