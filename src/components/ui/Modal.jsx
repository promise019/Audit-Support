/**
 * Modal.jsx — Reusable dialog component used by Academic Defense Mode.
 *
 * Renders an overlay with audit principle explanations sourced from mockData.
 * Clicking the backdrop or the X button closes the modal.
 */

import React, { useEffect } from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';

/**
 * @param {boolean}  isOpen     - Controls modal visibility.
 * @param {function} onClose    - Callback to close the modal.
 * @param {string}   title      - Modal header title.
 * @param {string}   principle  - The audit/accounting standard being demonstrated.
 * @param {string}   explanation - Detailed explanation text.
 * @param {string}   icon       - Lucide icon name (not rendered dynamically to keep bundle small).
 */
export default function Modal({ isOpen, onClose, title, principle, explanation, children }) {
  // Close on Escape key press
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-2xl glass-card p-0 overflow-hidden animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-6 border-b border-slate-700/50 bg-brand-900/40">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 shrink-0">
            <BookOpen size={18} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              🎓 Academic Defense Mode — Audit Principle
            </div>
            <h2 id="modal-title" className="text-base font-bold text-white leading-snug">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400
                       hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Standard Citation */}
        {principle && (
          <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg
                          bg-brand-800/40 border border-brand-600/30">
            <ExternalLink size={12} className="text-brand-400 shrink-0" />
            <span className="text-xs font-semibold text-brand-300">{principle}</span>
          </div>
        )}

        {/* Explanation Body */}
        <div className="p-6 pt-4">
          {explanation && (
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {explanation}
            </p>
          )}
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary text-xs px-5 py-2"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
