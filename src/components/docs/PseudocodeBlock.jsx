/**
 * PseudocodeBlock.jsx — Styled pseudocode renderer for Chapter 3.3.2.1
 *
 * Renders algorithm pseudocode with line numbers, monospace font,
 * and keyword syntax highlighting — matching academic documentation conventions.
 */

import React from 'react';
import { Terminal } from 'lucide-react';

/**
 * @param {string}   title   - Algorithm name/title
 * @param {string[]} lines   - Array of pseudocode line strings
 * @param {string}   purpose - One-sentence description of the algorithm's purpose
 */
export default function PseudocodeBlock({ title, lines = [], purpose }) {
  const highlight = (line) => {
    const keywords = ['BEGIN', 'END', 'FUNCTION', 'IF', 'THEN', 'ELSE', 'WHILE', 'FOR',
                      'RETURN', 'SET', 'CALL', 'INPUT', 'OUTPUT', 'VALIDATE', 'REJECT',
                      'THROW', 'LOG', 'MATCH', 'PROCEDURE', 'DO', 'AND', 'OR', 'NOT',
                      'TRUE', 'FALSE', 'NULL', 'INSERT', 'SELECT', 'UPDATE'];
    const parts = line.split(/(\s)/);
    return parts.map((part, i) => {
      if (keywords.includes(part.trim().toUpperCase())) {
        return <span key={i} className="text-violet-400 font-bold">{part}</span>;
      }
      if (/^\/\//.test(part.trim())) {
        return <span key={i} className="text-slate-500 italic">{part}</span>;
      }
      if (/"[^"]*"|'[^']*'/.test(part)) {
        return <span key={i} className="text-emerald-400">{part}</span>;
      }
      if (/^\d+(\.\d+)?$/.test(part.trim())) {
        return <span key={i} className="text-amber-400">{part}</span>;
      }
      return <span key={i} className="text-slate-300">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/80">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60">
        <Terminal size={13} className="text-violet-400 shrink-0" />
        <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">{title}</span>
        {/* Traffic-light dots */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
      </div>
      {/* Purpose note */}
      {purpose && (
        <div className="px-4 py-2 text-xs text-slate-500 italic border-b border-slate-800">
          {/* Purpose: */} {purpose}
        </div>
      )}
      {/* Code body */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs leading-6 py-3">
          <tbody>
            {lines.map((line, idx) => {
              const indent = line.match(/^(\s+)/)?.[1]?.length || 0;
              return (
                <tr key={idx} className="hover:bg-slate-800/40 group">
                  <td className="select-none w-10 px-3 text-right text-slate-600 border-r border-slate-800 group-hover:text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-4 whitespace-pre">
                    {highlight(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
