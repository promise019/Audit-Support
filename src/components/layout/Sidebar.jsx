/**
 * Sidebar.jsx — Responsive navigation sidebar for CFASS.
 *
 * Contains:
 * - University of Calabar / Faculty of Computing branding
 * - Navigation links for all 6 audit modules with Lucide icons
 * - Live notification badges (discrepancy count, pending approvals)
 * - Collapsible on mobile via a hamburger overlay
 * - Current user session indicator & logout button at the bottom
 */

import React from 'react';
import {
  LayoutDashboard, BookOpen, GitCompare, TrendingUp,
  GitBranch, Shield, ChevronRight, Users, X, LogOut, BookMarked
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';

// Navigation structure — each entry maps to a module
const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',           Icon: LayoutDashboard, desc: 'Overview & KPIs'          },
  { id: 'coa',             label: 'Chart of Accounts',   Icon: BookOpen,        desc: 'Ledger & Transactions'     },
  { id: 'reconciliation',  label: 'Reconciliation',      Icon: GitCompare,      desc: 'Bank Matching'             },
  { id: 'variance',        label: 'Variance Analysis',   Icon: TrendingUp,      desc: 'Budget vs Actual'          },
  { id: 'approval',        label: 'Approval Workflow',   Icon: GitBranch,       desc: 'Multi-Level Auth'          },
  { id: 'auditTrail',      label: 'Audit Trail',         Icon: Shield,          desc: 'Immutable Log'             },
];

// Academic documentation section
const DOC_ITEMS = [
  { id: 'docs', label: 'Project Defense & Docs', Icon: BookMarked, desc: 'Chapter 3 & 4' },
];

/**
 * @param {boolean}  mobileOpen - Controls mobile overlay visibility.
 * @param {function} onMobileClose - Closes the mobile sidebar.
 */
export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { activeModule, setActiveModule, discrepancyCount, pendingApprovals, currentUser, logout } = useAudit();

  const handleNav = (id) => {
    setActiveModule(id);
    onMobileClose(); // close mobile drawer on navigation
  };

  // Badge counts per module
  const badges = {
    reconciliation: discrepancyCount > 0 ? discrepancyCount : null,
    approval: pendingApprovals > 0 ? pendingApprovals : null,
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ─── Brand Header ─────────────────────────────────────── */}
      <div className="px-4 py-5 border-b border-slate-700/50">
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg
                     hover:bg-slate-700 text-slate-400"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        {/* University emblem (text-based) */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800
                          flex items-center justify-center shrink-0 border border-brand-500/40">
            <span className="text-white font-black text-sm">UC</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">University of Calabar</div>
            <div className="text-xs text-slate-400 leading-tight">Faculty of Computing</div>
          </div>
        </div>

        {/* System name */}
        <div className="px-3 py-2 rounded-lg bg-brand-900/60 border border-brand-700/40">
          <div className="text-xs font-black text-brand-300 uppercase tracking-widest">CFASS</div>
          <div className="text-xs text-slate-500 leading-tight mt-0.5">
            Computerised Financial<br />Audit Support System
          </div>
        </div>
      </div>

      {/* ─── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" aria-label="Main navigation">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
          Audit Modules
        </div>

        {NAV_ITEMS.map(({ id, label, Icon, desc }) => {
          const isActive = activeModule === id;
          const badge = badges[id];

          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              id={`nav-${id}`}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-link w-full text-left group relative ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{label}</div>
                <div className={`text-xs leading-tight mt-0.5 ${isActive ? 'text-brand-300' : 'text-slate-600 group-hover:text-slate-500'}`}>
                  {desc}
                </div>
              </div>
              {badge && (
                <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
                                 bg-red-500 text-white flex items-center justify-center">
                  {badge}
                </span>
              )}
              {isActive && (
                <ChevronRight size={14} className="shrink-0 text-brand-400" />
              )}
            </button>
          );
        })}

        {/* ─── Academic Documentation Section ─────────────────── */}
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2 mt-4 pt-3 border-t border-slate-700/40">
          Academic Documentation
        </div>
        {DOC_ITEMS.map(({ id, label, Icon, desc }) => {
          const isActive = activeModule === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              id={`nav-${id}`}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-link w-full text-left group relative ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{label}</div>
                <div className={`text-xs leading-tight mt-0.5 ${isActive ? 'text-brand-300' : 'text-slate-600 group-hover:text-slate-500'}`}>
                  {desc}
                </div>
              </div>
              {isActive && (
                <ChevronRight size={14} className="shrink-0 text-brand-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ─── Current User / Session & Logout ─────────────────── */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700
                          flex items-center justify-center shrink-0">
            <Users size={14} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Authorized User'}</div>
            <div className="text-xs text-slate-500 truncate">{currentUser?.role || 'Authenticated Session'}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out of system"
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div className="mt-2 text-[10px] text-slate-600 font-mono truncate">
          IP: {currentUser?.ipAddress || '127.0.0.1'} · {currentUser?.email || 'authenticated'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-900 border-r
                         border-slate-700/50 shrink-0 sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r
                             border-slate-700/50 lg:hidden animate-slide-in">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
