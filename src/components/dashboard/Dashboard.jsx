/**
 * Dashboard.jsx — Module 1: Financial Overview & Analytics
 *
 * Displays:
 * - KPI metric cards (Revenue, Expenditure, Net Balance, Discrepancies, Pending Approvals)
 * - Budget vs Actual bar chart (pure CSS — no external library)
 * - Recent activity feed (last 5 audit log entries)
 *
 * Audit principle demonstrated: IPSAS 24 — real-time budget monitoring
 * ensures management can identify significant deviations promptly.
 */

import React from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, AlertTriangle,
  Clock, Activity, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { formatNGN, formatTimestamp } from '../../utils/formatters';
import { DEFENSE_PRINCIPLES } from '../../data/mockData';
import DefenseBanner from '../layout/DefenseBanner';
import StatusBadge from '../ui/StatusBadge';

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, Icon, color, trend }) {
  const colorMap = {
    blue:   { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-600/20'    },
    green:  { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-600/20' },
    red:    { icon: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-600/20'     },
    amber:  { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-600/20'   },
    purple: { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-600/20'  },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`metric-card border ${c.border}`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`p-2 rounded-lg ${c.bg} shrink-0`}>
          <Icon size={18} className={c.icon} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold
            ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-xl font-black text-white tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-300 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Budget vs Actual Bar Chart (Pure CSS/SVG) ────────────────────────────────
function BudgetChart({ budgetLines }) {
  // Show top 6 expenditure lines for clarity
  const lines = budgetLines.filter(b => b.accountCode.startsWith('EXP')).slice(0, 6);
  const maxVal = Math.max(...lines.flatMap(l => [l.budgeted, l.actual]));

  return (
    <div className="space-y-3 mt-2">
      {lines.map((line, i) => {
        const budgetPct = (line.budgeted / maxVal) * 100;
        const actualPct = (line.actual / maxVal) * 100;
        const isOver = line.actual > line.budgeted;
        const shortName = line.category.split('&')[0].trim().replace('Staff ', '').replace(' Expenses', '');

        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 font-medium truncate max-w-[160px]" title={line.category}>
                {shortName}
              </span>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="text-slate-500">B: {formatNGN(line.budgeted, true)}</span>
                <span className={`font-semibold ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
                  A: {formatNGN(line.actual, true)}
                </span>
              </div>
            </div>

            {/* Budgeted bar */}
            <div className="relative mb-1">
              <div className="progress-bar">
                <div
                  className="progress-fill bg-blue-500/40"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
            </div>

            {/* Actual bar */}
            <div className="progress-bar">
              <div
                className={`progress-fill ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${actualPct}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-700/40">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-blue-500/50" />
          <span className="text-xs text-slate-500">Budgeted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-emerald-500" />
          <span className="text-xs text-slate-500">Actual (under)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-red-500" />
          <span className="text-xs text-slate-500">Actual (over)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const {
    totalRevenue, totalExpenditure, netBalance,
    discrepancyCount, pendingApprovals,
    auditLog, transactions, budgetLines, defenseMode,
  } = useAudit();

  const recentActivity = auditLog.slice(0, 5);
  const approvedCount  = transactions.filter(t => t.status === 'Approved').length;
  const flaggedCount   = transactions.filter(t => t.status === 'Flagged').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Module Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-400" />
            Dashboard &amp; Analytics
          </h1>
          <p className="section-sub">Faculty of Computing — Financial Overview · FY 2024</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-500 mb-0.5">Total Transactions</div>
          <div className="text-2xl font-black text-white">{transactions.length}</div>
        </div>
      </div>

      {/* Defense Mode Banner */}
      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.dashboard} />}

      {/* ─── KPI Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Revenue"
          value={formatNGN(totalRevenue, true)}
          sub="All income sources YTD"
          Icon={TrendingUp} color="green" trend="up"
        />
        <MetricCard
          label="Total Expenditure"
          value={formatNGN(totalExpenditure, true)}
          sub="All cost categories YTD"
          Icon={TrendingDown} color="red" trend="down"
        />
        <MetricCard
          label="Net Balance"
          value={formatNGN(Math.abs(netBalance), true)}
          sub={netBalance >= 0 ? 'Surplus position' : 'Deficit position'}
          Icon={DollarSign} color={netBalance >= 0 ? 'blue' : 'red'}
        />
        <MetricCard
          label="Discrepancies"
          value={discrepancyCount}
          sub="Bank reconciliation issues"
          Icon={AlertTriangle} color="amber"
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingApprovals}
          sub="Awaiting authorization"
          Icon={Clock} color="purple"
        />
      </div>

      {/* ─── Summary Stats Row ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Approved Transactions', count: approvedCount, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-700/30' },
          { label: 'Pending Review',        count: transactions.filter(t => t.status === 'Pending').length, color: 'text-amber-400 bg-amber-500/10 border-amber-700/30' },
          { label: 'Flagged / Rejected',    count: flaggedCount + transactions.filter(t => t.status === 'Rejected').length, color: 'text-red-400 bg-red-500/10 border-red-700/30' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`glass-card border px-4 py-3 flex items-center gap-3 ${color}`}>
            <span className="text-2xl font-black">{count}</span>
            <span className="text-xs font-medium text-slate-400 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* ─── Charts + Activity Feed ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Budget vs Actual Chart — spans 2 cols */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Budget vs Actual Expenditure</h2>
              <p className="text-xs text-slate-500 mt-0.5">By account category · FY 2024</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-700/60 text-slate-400 font-mono">
              Per IPSAS 24
            </span>
          </div>
          <BudgetChart budgetLines={budgetLines} />
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-brand-400" />
            <h2 className="text-sm font-bold text-white">Recent Audit Activity</h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex gap-2.5 group">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0 group-hover:bg-brand-300 transition-colors" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-white">{event.action}</span>
                    <StatusBadge
                      status={event.outcome === 'Success' ? 'Approved' : event.outcome.startsWith('Flagged') ? 'Flagged' : event.outcome === 'Rejected' ? 'Rejected' : 'Pending'}
                      showIcon={false}
                    />
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{event.description}</div>
                  <div className="text-xs text-slate-600 mt-0.5 font-mono">
                    {event.user} · {formatTimestamp(event.timestamp).split(',')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
