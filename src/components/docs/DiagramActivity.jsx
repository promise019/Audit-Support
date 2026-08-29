/**
 * DiagramActivity.jsx — Activity / Flow Diagram (JSX) for Chapter 3.3.1.4
 *
 * Shows the complete workflow: Transaction Entry → System Validation
 * → Multi-Level Approval Pipeline → Immutable Audit Log Writing.
 */

import React from 'react';
import { ArrowDown, CheckCircle2, XCircle, AlertTriangle, Lock, FileText, ClipboardCheck, GitBranch } from 'lucide-react';

const STEPS = [
  {
    id:'start', type:'start',
    label:'● START', desc:'Data Entry Officer initiates transaction in CFASS',
    color:'bg-emerald-600', textColor:'text-emerald-400', borderColor:'border-emerald-600/50',
    icon: FileText,
  },
  {
    id:'input', type:'step',
    label:'① Input Transaction Data',
    desc:'Officer enters: Description, COA Code, Debit/Credit amount, Date. Mask validation applied on each field.',
    color:'bg-brand-700/40', textColor:'text-brand-300', borderColor:'border-brand-600/40',
    icon: FileText,
    note:'Input mask: XXX-NNNN for COA | 999,999.99 for amounts | YYYY-MM-DD for dates',
  },
  {
    id:'validate', type:'decision',
    label:'② System Validation Engine',
    desc:'Programmatic checks: non-negative debit/credit, COA format mask, description length, double-entry balance.',
    color:'bg-amber-700/30', textColor:'text-amber-300', borderColor:'border-amber-600/40',
    icon: AlertTriangle,
    branches:[
      { label:'VALID', color:'text-emerald-400', to:'submit' },
      { label:'INVALID', color:'text-red-400', to:'reject_input' },
    ],
  },
  {
    id:'reject_input', type:'error',
    label:'✕ Validation Error',
    desc:'Error message returned. Entry blocked. Audit log records VALIDATION-FAIL event. Officer corrects and re-submits.',
    color:'bg-red-900/30', textColor:'text-red-300', borderColor:'border-red-700/40',
    icon: XCircle,
  },
  {
    id:'submit', type:'step',
    label:'③ Submit to Approval Workflow',
    desc:'Validated transaction moves to Stage 1: Auditor Review queue. Audit log records SUBMIT event with timestamp and IP.',
    color:'bg-brand-700/40', textColor:'text-brand-300', borderColor:'border-brand-600/40',
    icon: ClipboardCheck,
  },
  {
    id:'auditor', type:'decision',
    label:'④ Auditor Review (Stage 1)',
    desc:'Auditor examines supporting documents, verifies COA mapping, checks for duplicates and policy compliance.',
    color:'bg-emerald-900/30', textColor:'text-emerald-300', borderColor:'border-emerald-700/40',
    icon: CheckCircle2,
    branches:[
      { label:'APPROVE → Escalate', color:'text-emerald-400', to:'admin' },
      { label:'FLAG → Hold', color:'text-amber-400', to:'flagged' },
      { label:'REJECT', color:'text-red-400', to:'rejected' },
    ],
  },
  {
    id:'flagged', type:'warn',
    label:'⚠ Record Flagged',
    desc:'Returned to Data Entry Officer with a note. Audit log records FLAG event. Officer amends and re-submits.',
    color:'bg-amber-900/30', textColor:'text-amber-300', borderColor:'border-amber-700/40',
    icon: AlertTriangle,
  },
  {
    id:'rejected', type:'error',
    label:'✕ Record Rejected',
    desc:'Transaction rejected with documented reason. Audit log records immutable REJECT event. Workflow ends.',
    color:'bg-red-900/30', textColor:'text-red-300', borderColor:'border-red-700/40',
    icon: XCircle,
  },
  {
    id:'admin', type:'decision',
    label:'⑤ Faculty Admin Review (Stage 2)',
    desc:'For amounts > ₦500,000 or capital expenditure. Faculty Administrator provides final authorisation.',
    color:'bg-violet-900/30', textColor:'text-violet-300', borderColor:'border-violet-700/40',
    icon: GitBranch,
    branches:[
      { label:'FINAL APPROVE', color:'text-emerald-400', to:'approved' },
      { label:'REJECT', color:'text-red-400', to:'rejected' },
    ],
  },
  {
    id:'approved', type:'success',
    label:'⑥ Transaction Fully Approved',
    desc:'Status updated to APPROVED. Ledger balance recalculated. All roles notified.',
    color:'bg-emerald-900/40', textColor:'text-emerald-300', borderColor:'border-emerald-600/40',
    icon: CheckCircle2,
  },
  {
    id:'auditlog', type:'step',
    label:'⑦ Immutable Audit Log Entry Written',
    desc:'System automatically appends an uneditable record: log_id, timestamp, user_id, action_type, module, details, ip_address.',
    color:'bg-brand-700/40', textColor:'text-brand-300', borderColor:'border-brand-600/40',
    icon: Lock,
    note:'Non-repudiation guaranteed — ISA 230 compliant. Record is append-only.',
  },
  {
    id:'end', type:'end',
    label:'● END',
    desc:'Transaction lifecycle complete. Record available in ledger, audit trail, and reports.',
    color:'bg-slate-700', textColor:'text-slate-300', borderColor:'border-slate-600/50',
    icon: null,
  },
];

// Only main-flow steps (not branches)
const MAIN_FLOW = ['start','input','validate','submit','auditor','admin','approved','auditlog','end'];

function StepCard({ step }) {
  const Icon = step.icon;
  return (
    <div className={`rounded-xl border p-4 ${step.color} ${step.borderColor} w-full max-w-lg mx-auto`}>
      <div className="flex items-start gap-3">
        {Icon && <Icon size={16} className={`${step.textColor} shrink-0 mt-0.5`} />}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-bold ${step.textColor} mb-1`}>{step.label}</div>
          <div className="text-xs text-slate-400 leading-relaxed">{step.desc}</div>
          {step.note && (
            <div className="mt-2 text-xs text-slate-500 italic border-t border-slate-700/50 pt-1.5">
              {step.note}
            </div>
          )}
        </div>
      </div>
      {/* Decision branches */}
      {step.branches && (
        <div className="mt-3 flex flex-wrap gap-2 pl-7">
          {step.branches.map(b => (
            <span key={b.label} className={`text-xs font-bold ${b.color} px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-700/50`}>
              → {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiagramActivity() {
  const mainSteps = STEPS.filter(s => MAIN_FLOW.includes(s.id));

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Title bar */}
      <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-700/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Activity Diagram — Transaction Lifecycle</span>
        <span className="ml-auto text-xs text-slate-500">UML 2.x notation</span>
      </div>

      <div className="p-6">
        {/* Swimlane labels */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center font-bold uppercase tracking-wider">
          <div className="text-brand-400 bg-brand-900/30 border border-brand-700/30 rounded-lg py-1.5">Data Entry Officer</div>
          <div className="text-emerald-400 bg-emerald-900/30 border border-emerald-700/30 rounded-lg py-1.5">Auditor</div>
          <div className="text-amber-400 bg-amber-900/30 border border-amber-700/30 rounded-lg py-1.5">Faculty Admin / System</div>
        </div>

        {/* Vertical flow */}
        <div className="flex flex-col items-center gap-0">
          {mainSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <StepCard step={step} />
              {idx < mainSteps.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <ArrowDown size={18} className="text-slate-600" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Branch note */}
        <div className="mt-5 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-500">
          <strong className="text-slate-400">Branch paths:</strong> At each decision node (②③④), invalid/rejected branches terminate with an immutable Audit Log
          entry recording the rejection reason. Flagged records loop back to the input stage for correction.
        </div>
      </div>
    </div>
  );
}
