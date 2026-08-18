/**
 * StatusBadge.jsx — Reusable colored status chip component.
 * 
 * Provides a consistent visual vocabulary for transaction/approval statuses
 * throughout the CFASS interface.
 */

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Approved:  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-600/30', Icon: CheckCircle2 },
  Pending:   { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-600/30',   Icon: Clock         },
  Flagged:   { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-600/30',  Icon: AlertTriangle  },
  Rejected:  { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-600/30',     Icon: XCircle        },
  Matched:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-600/30', Icon: CheckCircle2 },
  Discrepancy:  { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-600/30',  Icon: AlertTriangle },
  Unmatched:    { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-600/30',     Icon: XCircle       },
  Revenue:      { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-600/30',    Icon: null          },
  Expenditure:  { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-600/30',  Icon: null          },
};

/**
 * @param {string} status - The status string (e.g. 'Approved', 'Pending').
 * @param {boolean} showIcon - Whether to render the status icon.
 * @param {'sm'|'md'} size - Badge size variant.
 */
export default function StatusBadge({ status, showIcon = true, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-600/30', Icon: HelpCircle
  };
  const { bg, text, border, Icon } = config;
  const sizeClasses = size === 'md'
    ? 'px-3 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-xs gap-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold
                      ${bg} ${text} ${border} ${sizeClasses}`}>
      {showIcon && Icon && <Icon size={10} className="shrink-0" />}
      {status}
    </span>
  );
}
