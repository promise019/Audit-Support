/**
 * DefenseBanner.jsx — Contextual audit principle banner for Academic Defense Mode.
 *
 * Rendered below the module header when defenseMode is active. Shows the
 * relevant IPSAS/ISA principle for the current module with a "Learn More" button
 * that opens the full Modal dialog.
 */

import React, { useState } from 'react';
import { GraduationCap, Info, ChevronRight } from 'lucide-react';
import Modal from '../ui/Modal';

/**
 * @param {object} principle - Defense principle object from DEFENSE_PRINCIPLES in mockData.js
 */
export default function DefenseBanner({ principle }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!principle) return null;

  return (
    <>
      <div className="defense-banner flex items-start gap-3 mb-5">
        <div className="shrink-0 p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 mt-0.5">
          <GraduationCap size={14} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Defense Note
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-amber-300/80 font-medium">{principle.title}</span>
          </div>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong className="text-amber-300">Standard:</strong> {principle.principle} —{' '}
            {principle.explanation.slice(0, 160)}…
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs
                     font-semibold text-amber-400 border border-amber-600/40
                     hover:bg-amber-500/20 transition-colors"
        >
          <Info size={12} />
          Learn More
          <ChevronRight size={10} />
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={principle.title}
        principle={principle.principle}
        explanation={principle.explanation}
      />
    </>
  );
}
