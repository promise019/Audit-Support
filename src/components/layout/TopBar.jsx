/**
 * TopBar.jsx — Application header with Defense Mode toggle and session info.
 *
 * Contains:
 * - Mobile hamburger menu button
 * - System title breadcrumb
 * - Academic Defense Mode toggle switch (prominent, amber-colored when ON)
 * - Current date/time display
 * - Active module label
 */

import React, { useState, useEffect } from 'react';
import { Menu, GraduationCap, Calendar, Shield } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { formatTimestamp } from '../../utils/formatters';

const MODULE_LABELS = {
  dashboard:      'Dashboard & Analytics',
  coa:            'Chart of Accounts & Transactions',
  reconciliation: 'Data Validation & Reconciliation',
  variance:       'Variance Analysis & Anomaly Detection',
  approval:       'Multi-Level Approval Workflow',
  auditTrail:     'Immutable Electronic Audit Trail',
  docs:           'Project Defense & Chapter Documentation',
};

/**
 * @param {function} onMenuClick - Opens the mobile sidebar drawer.
 */
export default function TopBar({ onMenuClick }) {
  const { defenseMode, setDefenseMode, activeModule } = useAudit();
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  // Live clock update every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={`sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 py-3
                        border-b border-slate-700/50 transition-colors duration-500
                        ${defenseMode
                          ? 'bg-amber-950/80 border-amber-700/40'
                          : 'bg-slate-900/95'
                        } backdrop-blur-sm`}>

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-400 shrink-0"
        aria-label="Open navigation menu"
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Shield icon + breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Shield size={16} className={`shrink-0 ${defenseMode ? 'text-amber-400' : 'text-brand-400'}`} />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="hidden sm:block text-xs text-slate-500 shrink-0">CFASS</span>
          <span className="hidden sm:block text-xs text-slate-600">/</span>
          <span className="text-sm font-semibold text-white truncate">
            {MODULE_LABELS[activeModule] || activeModule}
          </span>
        </div>
      </div>

      {/* Current Time */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        <Calendar size={13} className="text-slate-500" />
        <span className="text-xs text-slate-400 font-mono">
          {formatTimestamp(currentTime)}
        </span>
      </div>

      {/* ─── Academic Defense Mode Toggle ───────────────── */}
      <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border shrink-0
                       transition-all duration-300 cursor-pointer
                       ${defenseMode
                         ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-900/30'
                         : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                       }`}
           onClick={() => setDefenseMode(d => !d)}
           role="switch"
           aria-checked={defenseMode}
           aria-label="Toggle Academic Defense Mode"
           id="defense-mode-toggle"
           title="Toggle Academic Defense Mode — shows audit principle explanations on each module">

        <GraduationCap size={15} className={defenseMode ? 'text-amber-400' : 'text-slate-500'} />

        <span className={`text-xs font-bold hidden sm:block select-none
                          ${defenseMode ? 'text-amber-300' : 'text-slate-400'}`}>
          Defense Mode
        </span>

        {/* Toggle switch pill */}
        <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 shrink-0
                         ${defenseMode ? 'bg-amber-500' : 'bg-slate-600'}`}>
          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow
                           transition-transform duration-300
                           ${defenseMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
      </div>
    </header>
  );
}
