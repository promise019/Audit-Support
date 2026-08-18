/**
 * VarianceAnalysis.jsx — Module 4: Budget Variance & Anomaly Detection
 *
 * Compares each budget line's planned allocation against actual expenditure:
 *   - Over-budget rows highlighted in red with warning icon
 *   - Under-budget rows highlighted in green (favourable variance)
 *   - Items with |variance| > 15% are additionally flagged as anomalies
 *
 * Audit principle: ISA 520 (Analytical Procedures) — auditors apply
 * analytical procedures to detect unusual relationships or amounts
 * that may indicate material misstatements. IPSAS 24 mandates public-
 * sector entities disclose budget-to-actual comparatives.
 */

import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Filter } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { DEFENSE_PRINCIPLES } from '../../data/mockData';
import { formatNGN, formatPercent } from '../../utils/formatters';
import DefenseBanner from '../layout/DefenseBanner';

// Anomaly threshold — items exceeding this absolute variance % are flagged
const ANOMALY_THRESHOLD_PCT = 15;

// ─── Variance Row Component ────────────────────────────────────────────────────
function VarianceRow({ line, index }) {
  const variance    = line.actual - line.budgeted;
  const variancePct = line.budgeted > 0 ? (variance / line.budgeted) * 100 : 0;
  const isOver      = variance > 0;
  const isSame      = variance === 0;
  const isAnomaly   = Math.abs(variancePct) > ANOMALY_THRESHOLD_PCT;
  const utilizationPct = line.budgeted > 0 ? Math.min((line.actual / line.budgeted) * 100, 150) : 0;

  return (
    <tr className={`transition-colors
      ${isOver
        ? 'bg-red-900/10 hover:bg-red-900/15'
        : isSame
          ? 'hover:bg-slate-700/20'
          : 'bg-emerald-900/10 hover:bg-emerald-900/15'}`}
    >
      {/* # */}
      <td className="px-4 py-3 text-xs text-slate-500 font-mono">{String(index + 1).padStart(2, '0')}</td>

      {/* Account */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-slate-200 truncate max-w-[180px]" title={line.category}>
              {line.category}
            </div>
            <div className="text-xs font-mono text-slate-500">{line.accountCode}</div>
          </div>
          {isAnomaly && (
            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs
                             font-bold bg-amber-500/20 border border-amber-600/30 text-amber-400">
              <AlertTriangle size={9} />
              ANOMALY
            </span>
          )}
        </div>
      </td>

      {/* Budgeted */}
      <td className="px-4 py-3 font-mono text-sm text-right text-slate-300">
        {formatNGN(line.budgeted)}
      </td>

      {/* Actual */}
      <td className="px-4 py-3 font-mono text-sm text-right font-semibold">
        <span className={isOver ? 'text-red-400' : 'text-emerald-400'}>
          {formatNGN(line.actual)}
        </span>
      </td>

      {/* Variance */}
      <td className="px-4 py-3 font-mono text-sm text-right">
        <span className={`font-bold ${isOver ? 'text-red-400' : isSame ? 'text-slate-400' : 'text-emerald-400'}`}>
          {isOver ? '+' : ''}{formatNGN(variance)}
        </span>
      </td>

      {/* % Variance + bar */}
      <td className="px-4 py-3 min-w-[160px]">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold w-14 text-right tabular-nums
            ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatPercent(variancePct)}
          </span>
          <div className="flex-1 progress-bar">
            <div
              className={`progress-fill ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(Math.abs(variancePct), 100)}%` }}
            />
          </div>
        </div>
      </td>

      {/* Utilization % */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 progress-bar">
            <div
              className={`progress-fill ${utilizationPct > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            {utilizationPct.toFixed(0)}%
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {isOver ? (
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
            <TrendingUp size={13} />
            Over Budget
          </div>
        ) : isSame ? (
          <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
            <CheckCircle2 size={13} />
            On Target
          </div>
        ) : (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <TrendingDown size={13} />
            Under Budget
          </div>
        )}
      </td>
    </tr>
  );
}

// ─── Main Variance Analysis Component ─────────────────────────────────────────
export default function VarianceAnalysis() {
  const { budgetLines, defenseMode } = useAudit();
  const [showFilter, setShowFilter] = useState('All');

  const filtered = useMemo(() => {
    if (showFilter === 'Over')  return budgetLines.filter(l => l.actual > l.budgeted);
    if (showFilter === 'Under') return budgetLines.filter(l => l.actual < l.budgeted);
    if (showFilter === 'Anomaly') return budgetLines.filter(l => {
      const pct = l.budgeted > 0 ? Math.abs((l.actual - l.budgeted) / l.budgeted) * 100 : 0;
      return pct > ANOMALY_THRESHOLD_PCT;
    });
    return budgetLines;
  }, [budgetLines, showFilter]);

  // Aggregate totals
  const totals = useMemo(() => ({
    budgeted: budgetLines.reduce((s, l) => s + l.budgeted, 0),
    actual:   budgetLines.reduce((s, l) => s + l.actual,   0),
  }), [budgetLines]);
  const totalVariance    = totals.actual - totals.budgeted;
  const totalVariancePct = (totalVariance / totals.budgeted) * 100;
  const anomalyCount     = budgetLines.filter(l => {
    const pct = l.budgeted > 0 ? Math.abs((l.actual - l.budgeted) / l.budgeted) * 100 : 0;
    return pct > ANOMALY_THRESHOLD_PCT;
  }).length;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-400" />
            Variance Analysis &amp; Anomaly Detection
          </h1>
          <p className="section-sub">
            Budget vs Actual · FY 2024 — Anomaly threshold: &gt;{ANOMALY_THRESHOLD_PCT}% variance
          </p>
        </div>
      </div>

      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.variance} />}

      {/* ─── Summary Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card border-blue-600/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Total Budget</div>
          <div className="text-xl font-black text-white mt-1">{formatNGN(totals.budgeted, true)}</div>
        </div>
        <div className="metric-card border-purple-600/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Total Actual</div>
          <div className="text-xl font-black text-purple-300 mt-1">{formatNGN(totals.actual, true)}</div>
        </div>
        <div className={`metric-card ${totalVariance > 0 ? 'border-red-600/20' : 'border-emerald-600/20'}`}>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Net Variance</div>
          <div className={`text-xl font-black mt-1 ${totalVariance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {totalVariance > 0 ? '+' : ''}{formatNGN(totalVariance, true)}
          </div>
          <div className={`text-xs font-mono mt-0.5 ${totalVariance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {formatPercent(totalVariancePct)}
          </div>
        </div>
        <div className="metric-card border-amber-600/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={10} /> Anomalies
          </div>
          <div className="text-xl font-black text-amber-400 mt-1">{anomalyCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Items &gt;{ANOMALY_THRESHOLD_PCT}% variance
          </div>
        </div>
      </div>

      {/* ─── Filter Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} className="text-slate-500" />
        {[
          { key: 'All',     label: 'All Lines'         },
          { key: 'Over',    label: '↑ Over Budget'     },
          { key: 'Under',   label: '↓ Under Budget'    },
          { key: 'Anomaly', label: '⚠ Anomalies Only'  },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setShowFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
              ${showFilter === key
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── Variance Table ───────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="audit-table">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Account Category</th>
                <th className="text-right">Budgeted (₦)</th>
                <th className="text-right">Actual (₦)</th>
                <th className="text-right">Variance (₦)</th>
                <th>% Variance</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-slate-500 py-10">
                    No budget lines match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((line, i) => <VarianceRow key={line.accountCode} line={line} index={i} />)
              )}
            </tbody>

            {/* Aggregate totals footer */}
            <tfoot>
              <tr className="bg-slate-900/70 border-t-2 border-slate-700">
                <td colSpan={2} className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Aggregate Totals
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white">
                  {formatNGN(totals.budgeted)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-bold
                  ${totals.actual > totals.budgeted ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatNGN(totals.actual)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-bold
                  ${totalVariance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {totalVariance > 0 ? '+' : ''}{formatNGN(totalVariance)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${totalVariance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {formatPercent(totalVariancePct)}
                  </span>
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Anomaly callout */}
      {anomalyCount > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-900/20
                         border border-amber-700/30 animate-fade-in">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-300">Anomaly Detection Alert</div>
            <div className="text-xs text-amber-200/70 mt-0.5">
              {anomalyCount} budget line{anomalyCount > 1 ? 's' : ''} exceed the {ANOMALY_THRESHOLD_PCT}% variance
              threshold and require management explanation per ISA 520 analytical procedures.
              Review flagged items and obtain supporting documentation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
