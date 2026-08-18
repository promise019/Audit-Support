/**
 * App.jsx — Root Application Component for CFASS
 *
 * Assembles:
 * - AuditProvider (global state context)
 * - Login (authentication screen)
 * - Sidebar navigation
 * - TopBar header
 * - Module router (tab/state-based SPA navigation)
 */

import React, { useState } from 'react';
import { AuditProvider, useAudit } from './context/AuditContext';

// Auth
import Login from './components/auth/Login';

// Layout
import Sidebar from './components/layout/Sidebar';
import TopBar  from './components/layout/TopBar';

// Feature Modules
import Dashboard        from './components/dashboard/Dashboard';
import ChartOfAccounts  from './components/coa/ChartOfAccounts';
import Reconciliation   from './components/reconciliation/Reconciliation';
import VarianceAnalysis from './components/variance/VarianceAnalysis';
import ApprovalWorkflow from './components/approval/ApprovalWorkflow';
import AuditTrail       from './components/auditTrail/AuditTrail';

// ─── Module Router ─────────────────────────────────────────────────────────────
function ModuleRouter() {
  const { activeModule } = useAudit();

  switch (activeModule) {
    case 'dashboard':      return <Dashboard />;
    case 'coa':            return <ChartOfAccounts />;
    case 'reconciliation': return <Reconciliation />;
    case 'variance':       return <VarianceAnalysis />;
    case 'approval':       return <ApprovalWorkflow />;
    case 'auditTrail':     return <AuditTrail />;
    default:               return <Dashboard />;
  }
}

// ─── Inner App Layout (inside AuditProvider) ──────────────────────────────────
function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { defenseMode, isAuthenticated } = useAudit();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500
                     ${defenseMode ? 'bg-slate-950' : 'bg-slate-950'}`}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        {/* Scrollable Module Content */}
        <main
          className="flex-1 overflow-y-auto"
          id="main-content"
          role="main"
        >
          {/* Defense mode global indicator strip */}
          {defenseMode && (
            <div className="sticky top-0 z-20 flex items-center justify-center gap-2 py-1.5
                            bg-amber-500/20 border-b border-amber-600/30 text-amber-400
                            text-xs font-bold uppercase tracking-widest">
              🎓 Academic Defense Mode Active — Audit Principles Enabled
            </div>
          )}

          <ModuleRouter />
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-6 py-2 border-t border-slate-700/40
                            flex items-center justify-between text-xs text-slate-600">
          <span>CFASS v1.0 · Faculty of Computing, University of Calabar</span>
          <span className="hidden sm:block">
            Computerised Financial Audit Support System · All actions are logged
          </span>
          <span>Session: Active</span>
        </footer>
      </div>
    </div>
  );
}

// ─── Root Export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuditProvider>
      <AppLayout />
    </AuditProvider>
  );
}
