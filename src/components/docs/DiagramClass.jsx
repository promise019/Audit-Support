/**
 * DiagramClass.jsx — UML Class Diagram (JSX) for Chapter 3.3.1.5
 *
 * Renders six entity class cards with attributes (+type) and methods.
 * Entities: User, Transaction, ChartOfAccounts, Reconciliation, AuditTrail, VarianceReport
 * Relationships shown via dependency arrows between cards.
 */

import React from 'react';

const CLASSES = [
  {
    name: 'User',
    stereotype: '«entity»',
    color: 'border-brand-600/50 bg-brand-900/20',
    headerBg: 'bg-brand-800/60',
    headerText: 'text-brand-300',
    attributes: [
      { visibility:'+', name:'user_id',      type:'String',   note:'PK' },
      { visibility:'+', name:'full_name',    type:'String',   note:'' },
      { visibility:'+', name:'email',        type:'String',   note:'UNIQUE' },
      { visibility:'+', name:'role',         type:'RoleEnum', note:'DATA_ENTRY|AUDITOR|ADMIN' },
      { visibility:'-', name:'password_hash',type:'String',   note:'' },
      { visibility:'+', name:'created_at',   type:'DateTime', note:'' },
    ],
    methods: [
      'authenticate(email, pwd): Boolean',
      'hasPermission(action): Boolean',
      'getRole(): RoleEnum',
    ],
    relations: ['creates → Transaction', 'logs → AuditTrail'],
  },
  {
    name: 'Transaction',
    stereotype: '«entity»',
    color: 'border-emerald-600/50 bg-emerald-900/20',
    headerBg: 'bg-emerald-800/60',
    headerText: 'text-emerald-300',
    attributes: [
      { visibility:'+', name:'txn_id',    type:'String',   note:'PK' },
      { visibility:'+', name:'coa_code',  type:'String',   note:'FK → COA' },
      { visibility:'+', name:'category',  type:'String',   note:'' },
      { visibility:'+', name:'description',type:'String',  note:'' },
      { visibility:'+', name:'debit',     type:'Decimal',  note:'≥ 0' },
      { visibility:'+', name:'credit',    type:'Decimal',  note:'≥ 0' },
      { visibility:'+', name:'status',    type:'StatusEnum', note:'PENDING|APPROVED|REJECTED' },
      { visibility:'+', name:'created_by',type:'String',   note:'FK → User' },
      { visibility:'+', name:'timestamp', type:'DateTime', note:'' },
    ],
    methods: [
      'validate(): ValidationResult',
      'approve(approver: User): void',
      'reject(reason: String): void',
      'getBalance(): Decimal',
    ],
    relations: ['references → ChartOfAccounts', 'triggers → AuditTrail'],
  },
  {
    name: 'ChartOfAccounts',
    stereotype: '«entity»',
    color: 'border-violet-600/50 bg-violet-900/20',
    headerBg: 'bg-violet-800/60',
    headerText: 'text-violet-300',
    attributes: [
      { visibility:'+', name:'coa_code',  type:'String',   note:'PK, UNIQUE' },
      { visibility:'+', name:'name',       type:'String',   note:'' },
      { visibility:'+', name:'category',   type:'String',   note:'Revenue|Expenditure' },
      { visibility:'+', name:'is_active',  type:'Boolean',  note:'' },
    ],
    methods: [
      'validateCode(code: String): Boolean',
      'getCategory(): String',
      'getTransactions(): Transaction[]',
    ],
    relations: ['classifies → Transaction'],
  },
  {
    name: 'Reconciliation',
    stereotype: '«entity»',
    color: 'border-amber-600/50 bg-amber-900/20',
    headerBg: 'bg-amber-800/60',
    headerText: 'text-amber-300',
    attributes: [
      { visibility:'+', name:'recon_id',  type:'String',  note:'PK' },
      { visibility:'+', name:'txn_id',    type:'String',  note:'FK → Transaction' },
      { visibility:'+', name:'bank_ref',  type:'String',  note:'UNIQUE' },
      { visibility:'+', name:'status',    type:'String',  note:'MATCHED|DISCREPANCY' },
      { visibility:'+', name:'notes',     type:'Text',    note:'' },
    ],
    methods: [
      'matchTransaction(bankAmt: Decimal): Boolean',
      'computeVariance(): Decimal',
      'getStatus(): String',
    ],
    relations: ['matches → Transaction'],
  },
  {
    name: 'AuditTrail',
    stereotype: '«entity»',
    color: 'border-red-600/50 bg-red-900/20',
    headerBg: 'bg-red-800/60',
    headerText: 'text-red-300',
    attributes: [
      { visibility:'+', name:'log_id',     type:'String',    note:'PK' },
      { visibility:'+', name:'timestamp',  type:'DateTime',  note:'' },
      { visibility:'+', name:'user_id',    type:'String',    note:'FK → User' },
      { visibility:'+', name:'role',       type:'String',    note:'' },
      { visibility:'+', name:'action_type',type:'ActionEnum',note:'CREATE|APPROVE|REJECT|FLAG' },
      { visibility:'+', name:'module',     type:'String',    note:'' },
      { visibility:'+', name:'details',    type:'Text',      note:'' },
      { visibility:'+', name:'ip_address', type:'String',    note:'' },
    ],
    methods: [
      'append(event: AuditEvent): void',
      'search(query: String): Log[]',
      'exportCSV(): File',
    ],
    relations: ['records → User', 'references → Transaction'],
  },
  {
    name: 'VarianceReport',
    stereotype: '«report»',
    color: 'border-teal-600/50 bg-teal-900/20',
    headerBg: 'bg-teal-800/60',
    headerText: 'text-teal-300',
    attributes: [
      { visibility:'+', name:'report_id',  type:'String',  note:'PK' },
      { visibility:'+', name:'coa_code',   type:'String',  note:'FK → COA' },
      { visibility:'+', name:'budgeted',   type:'Decimal', note:'' },
      { visibility:'+', name:'actual',     type:'Decimal', note:'' },
      { visibility:'+', name:'variance',   type:'Decimal', note:'actual − budgeted' },
      { visibility:'+', name:'pct_diff',   type:'Float',   note:'%' },
      { visibility:'+', name:'fiscal_year',type:'Integer', note:'' },
    ],
    methods: [
      'compute(): void',
      'isFlagged(threshold: Float): Boolean',
      'generatePDF(): File',
    ],
    relations: ['analyses → ChartOfAccounts'],
  },
];

function AttributeRow({ attr }) {
  return (
    <tr className="border-b border-slate-700/30 hover:bg-slate-700/10">
      <td className="px-3 py-1.5 w-4 text-xs text-slate-500">{attr.visibility}</td>
      <td className="px-1 py-1.5 font-mono text-xs text-white">{attr.name}</td>
      <td className="px-1 py-1.5 text-xs text-brand-300 font-mono">{attr.type}</td>
      {attr.note && (
        <td className="px-2 py-1.5 text-[10px] text-slate-500 italic">{attr.note}</td>
      )}
    </tr>
  );
}

function ClassCard({ cls }) {
  return (
    <div className={`rounded-xl border overflow-hidden ${cls.color} flex flex-col`}>
      {/* Class header */}
      <div className={`${cls.headerBg} px-3 py-2.5 border-b border-slate-700/40`}>
        <div className={`text-[10px] ${cls.headerText} text-center italic`}>{cls.stereotype}</div>
        <div className="text-sm font-bold text-white text-center font-mono">{cls.name}</div>
      </div>

      {/* Attributes section */}
      <div className="border-b border-slate-700/40">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/30">
          attributes
        </div>
        <table className="w-full">
          <tbody>
            {cls.attributes.map(a => <AttributeRow key={a.name} attr={a} />)}
          </tbody>
        </table>
      </div>

      {/* Methods section */}
      <div>
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/30">
          operations
        </div>
        <div className="px-3 py-2 space-y-1">
          {cls.methods.map(m => (
            <div key={m} className="text-xs font-mono text-slate-400 leading-relaxed">
              + {m}
            </div>
          ))}
        </div>
      </div>

      {/* Relationships */}
      <div className="mt-auto border-t border-slate-700/30 px-3 py-2 bg-slate-900/20">
        {cls.relations.map(r => (
          <div key={r} className="text-[10px] text-slate-500 italic">{r}</div>
        ))}
      </div>
    </div>
  );
}

export default function DiagramClass() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Title bar */}
      <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-700/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-violet-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Class Diagram — CFASS Entity Model</span>
        <span className="ml-auto text-xs text-slate-500">UML 2.x · OOD design</span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CLASSES.map(cls => <ClassCard key={cls.name} cls={cls} />)}
        </div>

        {/* Relationship legend */}
        <div className="mt-5 p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <div className="text-xs font-bold text-slate-400 mb-2">Relationship Notation</div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span><span className="text-white">+</span> = public visibility</span>
            <span><span className="text-white">-</span> = private visibility</span>
            <span><span className="text-brand-400">FK</span> = Foreign Key relationship (association)</span>
            <span><span className="text-amber-400">PK</span> = Primary Key (identity)</span>
            <span><span className="text-emerald-400">UNIQUE</span> = Uniqueness constraint</span>
            <span>→ = dependency / creates relationship</span>
          </div>
        </div>
      </div>
    </div>
  );
}
