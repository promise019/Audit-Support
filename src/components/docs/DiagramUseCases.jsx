/**
 * DiagramUseCases.jsx — UML Use Case Diagram (JSX) for Chapter 3.3.1.3
 *
 * Visualises three actor roles and their system use cases with association lines.
 * Actors: Data Entry Officer, Auditor, Administrator
 */

import React from 'react';
import { User, UserCheck, ShieldCheck } from 'lucide-react';

const USE_CASES = [
  { id:'uc1', label:'Create Voucher / Post Transaction' },
  { id:'uc2', label:'Submit Record for Approval' },
  { id:'uc3', label:'View Ledger & COA Summary' },
  { id:'uc4', label:'Validate & Approve Record' },
  { id:'uc5', label:'Flag Record for Review' },
  { id:'uc6', label:'Reconcile Bank Statement' },
  { id:'uc7', label:'Run Variance Analysis' },
  { id:'uc8', label:'View Audit Trail Logs' },
  { id:'uc9', label:'Manage User Accounts' },
  { id:'uc10',label:'Generate Reports' },
  { id:'uc11',label:'Reject / Escalate Record' },
];

const ACTORS = [
  {
    name:'Data Entry Officer',
    Icon: User,
    color:'text-brand-400',
    bg:'bg-brand-900/40 border-brand-700/40',
    dot:'bg-brand-400',
    uses:['uc1','uc2','uc3'],
  },
  {
    name:'Auditor',
    Icon: UserCheck,
    color:'text-emerald-400',
    bg:'bg-emerald-900/40 border-emerald-700/40',
    dot:'bg-emerald-400',
    uses:['uc3','uc4','uc5','uc6','uc7','uc8','uc11'],
  },
  {
    name:'Administrator',
    Icon: ShieldCheck,
    color:'text-amber-400',
    bg:'bg-amber-900/40 border-amber-700/40',
    dot:'bg-amber-400',
    uses:['uc4','uc8','uc9','uc10','uc11'],
  },
];

export default function DiagramUseCases() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Diagram title bar */}
      <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-700/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Use Case Diagram — CFASS</span>
        <span className="ml-auto text-xs text-slate-500">UML 2.x notation</span>
      </div>

      <div className="p-6">
        {/* System boundary */}
        <div className="relative border-2 border-dashed border-slate-600/50 rounded-2xl p-6 mb-6">
          <span className="absolute -top-3 left-6 bg-slate-900 px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            «system» CFASS — Computerised Financial Audit Support System
          </span>

          {/* Use Cases grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {USE_CASES.map(uc => {
              // Find which actors use this case
              const actorColors = ACTORS.filter(a => a.uses.includes(uc.id)).map(a => a.dot);
              return (
                <div key={uc.id}
                     className="flex items-center gap-2.5 px-4 py-3 rounded-full border border-slate-600/50 bg-slate-800/60 hover:border-slate-500 transition-colors">
                  {/* Actor indicator dots */}
                  <div className="flex gap-1 shrink-0">
                    {actorColors.map((c, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-medium leading-tight">{uc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actor legend + associations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTORS.map(({ name, Icon, color, bg, dot, uses }) => (
            <div key={name} className={`rounded-xl border p-4 ${bg}`}>
              {/* Actor icon (stick-figure style) */}
              <div className="flex flex-col items-center mb-3">
                <div className={`w-10 h-10 rounded-full border-2 border-current ${color} flex items-center justify-center mb-1`}>
                  <Icon size={20} className={color} />
                </div>
                <div className={`w-0.5 h-4 ${dot}`} />
                <span className={`text-xs font-bold ${color} text-center mt-1`}>«actor»</span>
                <span className="text-xs text-white font-semibold text-center">{name}</span>
              </div>
              {/* Associated use cases */}
              <div className="space-y-1.5">
                {uses.map(ucId => {
                  const uc = USE_CASES.find(u => u.id === ucId);
                  return (
                    <div key={ucId} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className="text-xs text-slate-400">{uc?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-400" /> Data Entry Officer</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Auditor</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Administrator</div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="border border-dashed border-slate-600 px-2 py-0.5 rounded">«system boundary»</span>
          </div>
        </div>
      </div>
    </div>
  );
}
