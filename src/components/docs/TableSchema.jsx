/**
 * TableSchema.jsx — Reusable database schema table renderer for Chapter 3.3.2.2
 *
 * Renders a physical database table schema with Field Name, Data Type,
 * Key/Constraint indicators, and Description columns.
 */

import React from 'react';
import { Database, Key } from 'lucide-react';

/**
 * @param {string} tableName  - Name of the database table
 * @param {string} tableDesc  - One-line purpose of the table
 * @param {Array}  fields     - Array of { name, type, constraint, key, description }
 */
export default function TableSchema({ tableName, tableDesc, fields = [] }) {
  const constraintColor = (c) => {
    if (!c) return '';
    if (c.includes('PK')) return 'text-amber-400 bg-amber-500/10 border-amber-600/30';
    if (c.includes('FK')) return 'text-violet-400 bg-violet-500/10 border-violet-600/30';
    if (c.includes('NOT NULL')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-600/30';
    if (c.includes('UNIQUE'))   return 'text-brand-400 bg-brand-500/10 border-brand-600/30';
    if (c.includes('CHECK'))    return 'text-amber-300 bg-amber-500/10 border-amber-700/30';
    return 'text-slate-400 bg-slate-700/30 border-slate-600/30';
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50">
      {/* Table header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <Database size={14} className="text-brand-400 shrink-0" />
        <div>
          <span className="text-sm font-bold text-white font-mono">{tableName}</span>
          {tableDesc && (
            <span className="ml-3 text-xs text-slate-500">{tableDesc}</span>
          )}
        </div>
      </div>

      {/* Schema table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/60">
              <th className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 w-36">
                Field Name
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 w-36">
                Data Type
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 w-40">
                Constraints / Keys
              </th>
              <th className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => (
              <tr key={field.name} className={`border-b border-slate-700/30 ${idx % 2 === 0 ? '' : 'bg-slate-800/20'} hover:bg-slate-700/20 transition-colors`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {field.constraint?.includes('PK') && <Key size={11} className="text-amber-400 shrink-0" />}
                    <span className="font-mono font-semibold text-white">{field.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-mono text-brand-300">{field.type}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {field.constraint?.split(',').map(c => c.trim()).filter(Boolean).map(c => (
                      <span key={c} className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${constraintColor(c)}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-400 leading-relaxed">
                  {field.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
