/**
 * Login.jsx — Admin & Auditor Login Screen for CFASS
 * Faculty of Computing, University of Calabar
 */

import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Info, Key, GraduationCap } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';

export default function Login() {
  const { login } = useAudit();
  const [email, setEmail] = useState('admin@unical.edu.ng');
  const [password, setPassword] = useState('audit2024');
  const [role, setRole] = useState('Auditor'); // 'Auditor' | 'Data Entry Officer' | 'Faculty Administrator'
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    // Role mapping metadata
    let roleLevel = 1;
    let name = 'Dr. Effiong Bassey';
    if (role === 'Data Entry Officer') {
      roleLevel = 0;
      name = 'Chukwuma Obi';
    } else if (role === 'Faculty Administrator') {
      roleLevel = 2;
      name = 'Prof. Asuquo Edet';
    }

    login({
      name,
      email: email.trim(),
      role,
      roleLevel,
      ipAddress: '10.20.5.210',
    });
  };

  const fillQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('audit2024');
    setRole(demoRole);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorative glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass-card p-8 shadow-2xl relative z-10 border-slate-700/60">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 border border-brand-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-900/50">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">CFASS Portal Access</h1>
          <p className="text-xs text-slate-400 mt-1">
            Faculty of Computing · University of Calabar
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-brand-900/50 border border-brand-700/40 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-brand-300 mb-2">
            <Info size={14} className="text-brand-400 shrink-0" />
            <span>Academic Defense Demo Credentials</span>
          </div>
          <p className="text-slate-400 text-[11px] mb-2.5">
            Click any role below to automatically populate demo credentials:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickDemo('auditor@unical.edu.ng', 'Auditor')}
              className={`p-1.5 rounded-lg border text-center text-[10px] font-semibold transition-all ${
                role === 'Auditor'
                  ? 'bg-brand-600/30 border-brand-500 text-brand-200'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Auditor
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('dataentry@unical.edu.ng', 'Data Entry Officer')}
              className={`p-1.5 rounded-lg border text-center text-[10px] font-semibold transition-all ${
                role === 'Data Entry Officer'
                  ? 'bg-brand-600/30 border-brand-500 text-brand-200'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Data Entry
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@unical.edu.ng', 'Faculty Administrator')}
              className={`p-1.5 rounded-lg border text-center text-[10px] font-semibold transition-all ${
                role === 'Faculty Administrator'
                  ? 'bg-brand-600/30 border-brand-500 text-brand-200'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              Faculty Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unical.edu.ng"
                className="form-input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="login-role">Select Audit Role</label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="Auditor">Auditor (Dr. Effiong Bassey)</option>
              <option value="Data Entry Officer">Data Entry Officer (Chukwuma Obi)</option>
              <option value="Faculty Administrator">Faculty Administrator (Prof. Asuquo Edet)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2 group"
          >
            <span>Authenticate Session</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <GraduationCap size={13} className="text-amber-400" />
            <span>Designed for Academic Defense &amp; Financial Oversight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
