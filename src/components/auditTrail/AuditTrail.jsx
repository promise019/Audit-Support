/**
 * AuditTrail.jsx — Module 6: Immutable Electronic Audit Trail
 *
 * Displays a comprehensive, chronological log of all system actions:
 *   - Timestamp (UTC ISO format)
 *   - User name and role
 *   - Action type (Created, Approved, Flagged, Rejected, etc.)
 *   - Record reference (transaction ID)
 *   - System outcome
 *   - IP address
 *
 * The trail is IMMUTABLE — records are prepended and can never be edited
 * or deleted, ensuring full traceability (ISA 230: Audit Documentation).
 *
 * Features:
 *   - Search by action type, user, or description
 *   - Filter by role or action category
 *   - CSV export (client-side)
 */

import React, { useMemo, useState } from 'react';
import {
  Shield, Lock, Search, Download, Filter,
  CheckCircle2, AlertTriangle, XCircle, FileText,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { DEFENSE_PRINCIPLES } from '../../data/mockData';
import { formatTimestamp } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import DefenseBanner from '../layout/DefenseBanner';

// Records per page for pagination
const PAGE_SIZE = 10;

// ─── Action icon resolver ──────────────────────────────────────────────────────
function ActionIcon({ action }) {
  if (action.includes('Approved') || action.includes('Final')) return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (action.includes('Flagged'))  return <AlertTriangle size={14} className="text-amber-400" />;
  if (action.includes('Rejected')) return <XCircle size={14} className="text-red-400" />;
  return <FileText size={14} className="text-brand-400" />;
}

// ─── Outcome badge ──────────────────────────────────────────────────────────
function OutcomeBadge({ outcome }) {
  if (outcome === 'Success' || outcome === 'Approved') return <StatusBadge status="Approved" />;
  if (outcome?.startsWith('Flagged'))                  return <StatusBadge status="Flagged"  />;
  if (outcome === 'Rejected')                          return <StatusBadge status="Rejected" />;
  return <StatusBadge status="Pending" />;
}

// ─── CSV Export ────────────────────────────────────────────────────────────────
function exportToCSV(log) {
  const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Record Ref', 'Description', 'Outcome', 'IP Address'];
  const rows = log.map(e => [
    e.id, e.timestamp, e.user, e.role, e.action,
    e.recordRef, `"${e.description.replace(/"/g, '""')}"`,
    e.outcome, e.ipAddress,
  ]);
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `CFASS_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main Audit Trail Component ────────────────────────────────────────────────
export default function AuditTrail() {
  const { auditLog, defenseMode } = useAudit();

  const [search,      setSearch]     = useState('');
  const [roleFilter,  setRoleFilter] = useState('All');
  const [actionFilter,setActionFilter] = useState('All');
  const [page,        setPage]       = useState(1);

  // All unique roles in the log
  const roles   = ['All', ...new Set(auditLog.map(e => e.role))];
  const actions = ['All', 'Created Record', 'Approved Record', 'Flagged Record', 'Rejected Record', 'Submitted for Approval', 'Final Approval Granted'];

  // ─── Filtering ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = auditLog;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.user.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.recordRef.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'All')   list = list.filter(e => e.role === roleFilter);
    if (actionFilter !== 'All') list = list.filter(e => e.action === actionFilter);
    return list;
  }, [auditLog, search, roleFilter, actionFilter]);

  // ─── Pagination ─────────────────────────────────────────
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const actionCounts = useMemo(() => {
    const counts = {};
    auditLog.forEach(e => { counts[e.action] = (counts[e.action] || 0) + 1; });
    return counts;
  }, [auditLog]);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <Shield size={20} className="text-brand-400" />
            Immutable Electronic Audit Trail
            {/* Lock badge */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
                             bg-emerald-500/15 border border-emerald-600/30 text-emerald-400">
              <Lock size={10} />
              IMMUTABLE
            </span>
          </h1>
          <p className="section-sub">
            {auditLog.length} records · Read-only · ISA 230 compliant
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filtered)}
          id="export-audit-csv"
          className="btn-secondary flex items-center gap-2 text-xs shrink-0"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.auditTrail} />}

      {/* ─── Immutability Notice ─────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-900/40 border border-brand-700/30">
        <Lock size={16} className="text-brand-400 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-300 leading-relaxed">
          <strong>Non-Repudiation Guarantee:</strong> All entries in this log are written once and
          cannot be modified, edited, or deleted. Each record captures the user identity, IP address,
          timestamp, action performed, and system outcome — providing a legally defensible audit trail
          in accordance with ISA 230 (Audit Documentation) requirements.
        </div>
      </div>

      {/* ─── Activity Summary Cards ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Events',   count: auditLog.length, color: 'text-white' },
          { label: 'Approvals',      count: auditLog.filter(e => e.action.includes('Approved')).length, color: 'text-emerald-400' },
          { label: 'Flags Raised',   count: auditLog.filter(e => e.action.includes('Flagged')).length,  color: 'text-amber-400'  },
          { label: 'Rejections',     count: auditLog.filter(e => e.action.includes('Rejected')).length, color: 'text-red-400'    },
        ].map(({ label, count, color }) => (
          <div key={label} className="glass-card px-4 py-3 text-center">
            <div className={`text-2xl font-black ${color}`}>{count}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ─── Search & Filters ────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            id="audit-search"
            placeholder="Search log…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="form-input pl-8"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="form-input w-auto"
          id="audit-role-filter"
        >
          {roles.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>)}
        </select>
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="form-input w-auto"
          id="audit-action-filter"
        >
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* ─── Audit Log Table ──────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp (UTC)</th>
                <th>User / Role</th>
                <th>Action</th>
                <th>Record Ref</th>
                <th>Description</th>
                <th>Outcome</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-slate-500 py-10">
                    No log entries match your search or filter.
                  </td>
                </tr>
              ) : (
                paginated.map((event, idx) => (
                  <tr key={event.id} className={idx % 2 === 0 ? '' : 'bg-slate-800/10'}>
                    <td>
                      <span className="mono text-slate-500">{event.id}</span>
                    </td>
                    <td>
                      <span className="mono text-xs text-slate-400 whitespace-nowrap">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-300">{event.user}</div>
                      <div className="text-xs text-slate-500">{event.role}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <ActionIcon action={event.action} />
                        <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                          {event.action}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="mono text-brand-400">{event.recordRef}</span>
                    </td>
                    <td className="max-w-[220px]">
                      <div className="text-xs text-slate-400 truncate" title={event.description}>
                        {event.description}
                      </div>
                    </td>
                    <td>
                      <OutcomeBadge outcome={event.outcome} />
                    </td>
                    <td>
                      <span className="mono text-xs text-slate-600">{event.ipAddress}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/40">
            <span className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-400"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors
                    ${p === page ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-400"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
