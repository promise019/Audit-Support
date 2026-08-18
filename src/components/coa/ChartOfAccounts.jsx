/**
 * ChartOfAccounts.jsx — Module 2: Ledger & Transaction Management
 *
 * Features:
 * - Sortable, filterable transaction ledger table
 * - "Add Transaction" slide-in form panel with full field validation
 * - Running balance display
 * - Account code reference panel
 *
 * Audit principle: Double-entry bookkeeping (IPSAS 1) and completeness
 * of records (ISA 500). Every new transaction auto-generates an audit trail event.
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen, Plus, Search, Filter, ChevronDown,
  ChevronUp, X, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ACCOUNT_CODES, DEFENSE_PRINCIPLES } from '../../data/mockData';
import { formatNGN, formatDate } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import DefenseBanner from '../layout/DefenseBanner';

// ─── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  accountCode: '',
  description: '',
  entryType: 'debit',    // 'debit' | 'credit'
  amount: '',
};

// ─── Transaction Form Panel ───────────────────────────────────────────────────
function TransactionForm({ onClose, onSubmit }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.date)        e.date = 'Date is required';
    if (!form.accountCode) e.accountCode = 'Account code is required';
    if (!form.description.trim() || form.description.trim().length < 10)
      e.description = 'Description must be at least 10 characters';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0)
      e.amount = 'Enter a valid positive amount';
    if (amt > 50_000_000)
      e.amount = 'Amount exceeds single-entry limit (₦50M). Requires special approval.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    const selectedAccount = ACCOUNT_CODES.find(a => a.code === form.accountCode);
    const amt = parseFloat(form.amount);
    onSubmit({
      date: form.date,
      accountCode: form.accountCode,
      category: selectedAccount?.category || 'Unknown',
      description: form.description.trim(),
      debit:  form.entryType === 'debit'  ? amt : 0,
      credit: form.entryType === 'credit' ? amt : 0,
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(EMPTY_FORM); onClose(); }, 1500);
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: undefined }));
  };

  return (
    <div className="glass-card p-5 animate-slide-in border-brand-600/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white">New Financial Entry</h3>
          <p className="text-xs text-slate-500 mt-0.5">All fields marked * are required</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <CheckCircle2 size={40} className="text-emerald-400" />
          <div className="text-sm font-semibold text-emerald-300">Transaction Recorded!</div>
          <div className="text-xs text-slate-500">Audit trail entry has been created.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Row 1: Date + Account Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="txn-date" className="form-label">Date *</label>
              <input
                id="txn-date"
                type="date"
                value={form.date}
                onChange={set('date')}
                className="form-input"
              />
              {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="txn-account" className="form-label">Account Code *</label>
              <select
                id="txn-account"
                value={form.accountCode}
                onChange={set('accountCode')}
                className="form-input"
              >
                <option value="">Select account…</option>
                {['Revenue', 'Expenditure', 'Assets', 'Liabilities'].map(cat => (
                  <optgroup key={cat} label={cat}>
                    {ACCOUNT_CODES.filter(a => a.category === cat).map(a => (
                      <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.accountCode && <p className="text-xs text-red-400 mt-1">{errors.accountCode}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="txn-desc" className="form-label">Description *</label>
            <textarea
              id="txn-desc"
              rows={2}
              value={form.description}
              onChange={set('description')}
              placeholder="Provide a clear description of the financial transaction…"
              className="form-input resize-none"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Row 3: Entry Type + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="txn-type" className="form-label">Entry Type *</label>
              <select
                id="txn-type"
                value={form.entryType}
                onChange={set('entryType')}
                className="form-input"
              >
                <option value="debit">Debit (Expenditure / Asset)</option>
                <option value="credit">Credit (Revenue / Liability)</option>
              </select>
            </div>
            <div>
              <label htmlFor="txn-amount" className="form-label">Amount (₦) *</label>
              <input
                id="txn-amount"
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={set('amount')}
                placeholder="e.g. 250000"
                className="form-input"
              />
              {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
            </div>
          </div>

          {/* Preview */}
          {form.amount && !isNaN(parseFloat(form.amount)) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-900/40 border border-brand-700/30">
              <Info size={13} className="text-brand-400 shrink-0" />
              <span className="text-xs text-brand-300">
                This will record a <strong>{form.entryType}</strong> of{' '}
                <strong>{formatNGN(parseFloat(form.amount) || 0)}</strong>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1" id="submit-transaction">
              Record Transaction
            </button>
            <button type="button" onClick={onClose} className="btn-secondary px-4">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Main COA Component ───────────────────────────────────────────────────────
export default function ChartOfAccounts() {
  const { transactions, addTransaction, defenseMode } = useAudit();

  const [showForm,   setShowForm]   = useState(false);
  const [search,     setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField,  setSortField]  = useState('date');
  const [sortAsc,    setSortAsc]    = useState(false);

  // ─── Filtering & Sorting ───────────────────────────────
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.accountCode.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'All') {
      list = list.filter(t => t.status === filterStatus);
    }

    list.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    return list;
  }, [transactions, search, filterStatus, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-slate-600" />;
    return sortAsc ? <ChevronUp size={12} className="text-brand-400" /> : <ChevronDown size={12} className="text-brand-400" />;
  };

  const totalDebits  = filtered.reduce((s, t) => s + t.debit, 0);
  const totalCredits = filtered.reduce((s, t) => s + t.credit, 0);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2">
            <BookOpen size={20} className="text-brand-400" />
            Chart of Accounts &amp; Transactions
          </h1>
          <p className="section-sub">Standardized ledger — {transactions.length} total entries</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          id="add-transaction-btn"
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Entry</span>
        </button>
      </div>

      {defenseMode && <DefenseBanner principle={DEFENSE_PRINCIPLES.coa} />}

      {/* Add Transaction Form */}
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => { addTransaction(data); }}
        />
      )}

      {/* ─── Filter Bar ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            id="coa-search"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          {['All', 'Approved', 'Pending', 'Flagged', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${filterStatus === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Ledger Table ────────────────────────────────── */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="audit-table">
            <thead>
              <tr>
                {[
                  { label: 'Ref #',        field: 'id'          },
                  { label: 'Date',         field: 'date'        },
                  { label: 'Account Code', field: 'accountCode' },
                  { label: 'Description',  field: 'description' },
                  { label: 'Debit (₦)',    field: 'debit'       },
                  { label: 'Credit (₦)',   field: 'credit'      },
                  { label: 'Status',       field: 'status'      },
                ].map(({ label, field }) => (
                  <th key={field}>
                    <button
                      onClick={() => toggleSort(field)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {label} <SortIcon field={field} />
                    </button>
                  </th>
                ))}
                <th>Posted By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-slate-500 py-10">No transactions match your filter.</td></tr>
              ) : (
                filtered.map((txn) => (
                  <tr key={txn.id} className={txn.status === 'Flagged' ? 'bg-orange-900/10' : txn.status === 'Rejected' ? 'bg-red-900/10' : ''}>
                    <td><span className="mono text-brand-400">{txn.id}</span></td>
                    <td className="text-slate-400 whitespace-nowrap">{formatDate(txn.date)}</td>
                    <td>
                      <span className="mono px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                        {txn.accountCode}
                      </span>
                    </td>
                    <td className="max-w-[220px]">
                      <div className="truncate" title={txn.description}>{txn.description}</div>
                      {txn.flagReason && (
                        <div className="flex items-center gap-1 text-xs text-orange-400 mt-0.5">
                          <AlertCircle size={10} /> {txn.flagReason}
                        </div>
                      )}
                    </td>
                    <td className="text-red-400 font-mono font-semibold">
                      {txn.debit > 0 ? formatNGN(txn.debit) : '—'}
                    </td>
                    <td className="text-emerald-400 font-mono font-semibold">
                      {txn.credit > 0 ? formatNGN(txn.credit) : '—'}
                    </td>
                    <td><StatusBadge status={txn.status} /></td>
                    <td className="text-slate-500 text-xs max-w-[140px] truncate" title={txn.enteredBy}>
                      {txn.enteredBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totals footer */}
            <tfoot>
              <tr className="bg-slate-900/60 border-t-2 border-slate-700">
                <td colSpan={4} className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Totals ({filtered.length} entries shown)
                </td>
                <td className="px-4 py-3 font-bold text-red-400 font-mono">
                  {formatNGN(totalDebits)}
                </td>
                <td className="px-4 py-3 font-bold text-emerald-400 font-mono">
                  {formatNGN(totalCredits)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
