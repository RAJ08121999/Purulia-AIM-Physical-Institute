'use client';

import React, { useState } from 'react';
import {
  X,
  Shield,
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Award,
  KeyRound,
  FileText
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { loginUser, registerTrainer } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'CADET_LOGIN' | 'TRAINER_LOGIN' | 'TRAINER_REGISTER';
  onOpenAdmission?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'CADET_LOGIN',
  onOpenAdmission
}) => {
  const [activeTab, setActiveTab] = useState<'CADET_LOGIN' | 'TRAINER_LOGIN' | 'TRAINER_REGISTER'>(defaultTab);

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Trainer Register State
  const [trainerForm, setTrainerForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    regimentOrTitle: 'Physical Training Ustad',
    specialization: '1600m Track Pacing & BPET Obstacles',
    secretVerificationCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginUser({
        identifier,
        password: password || undefined,
        role: activeTab === 'TRAINER_LOGIN' ? 'TRAINER' : 'STUDENT'
      });

      setSuccessMsg(`Welcome, ${res.user.name}! Redirecting to command portal...`);
      setTimeout(() => {
        onClose();
        if (res.user.role === 'TRAINER' || res.user.role === 'SUPER_ADMIN') {
          window.location.href = '/portal/trainer';
        } else {
          window.location.href = '/portal/student';
        }
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerTrainer({
        fullName: trainerForm.fullName,
        email: trainerForm.email,
        phone: trainerForm.phone,
        password: trainerForm.password,
        regimentOrTitle: trainerForm.regimentOrTitle,
        specialization: trainerForm.specialization,
        secretVerificationCode: trainerForm.secretVerificationCode || undefined
      });

      setSuccessMsg(`Drill Ustad ${res.user.name} registered successfully! Entering Command Center...`);
      setTimeout(() => {
        onClose();
        window.location.href = '/portal/trainer';
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Trainer registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0B0F0A] border border-[#273623] rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#121811] border-b border-[#273623] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider">
                AIM Command Authentication
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                Regimental Security & Verification Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2918] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 p-2 bg-[#0E140C] border-b border-[#1A2415] gap-1 font-mono text-xs">
          <button
            onClick={() => { setActiveTab('CADET_LOGIN'); setErrorMsg(null); }}
            className={`py-2 px-1 rounded-xl text-center font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'CADET_LOGIN'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#161F15]'
            }`}
          >
            Cadet Login
          </button>
          <button
            onClick={() => { setActiveTab('TRAINER_LOGIN'); setErrorMsg(null); }}
            className={`py-2 px-1 rounded-xl text-center font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'TRAINER_LOGIN'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#161F15]'
            }`}
          >
            Ustad Login
          </button>
          <button
            onClick={() => { setActiveTab('TRAINER_REGISTER'); setErrorMsg(null); }}
            className={`py-2 px-1 rounded-xl text-center font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'TRAINER_REGISTER'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#161F15]'
            }`}
          >
            Ustad Sign-Up
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1 & 2: CADET OR TRAINER LOGIN */}
          {(activeTab === 'CADET_LOGIN' || activeTab === 'TRAINER_LOGIN') && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#121811] border border-[#273623] text-xs text-gray-300">
                <span className="text-amber-400 font-bold block mb-0.5">
                  {activeTab === 'CADET_LOGIN' ? 'Cadet Access' : 'Drill Ustad / Trainer Access'}
                </span>
                {activeTab === 'CADET_LOGIN' ? (
                  <span>Log in with your Registered Email, 10-digit Phone, or Dossier ID (e.g. AIM-CADET-2026-XXXX).</span>
                ) : (
                  <span>Log in with your registered Ustad email or phone. Demo: <code>havaldar.anup@aiminstitute.org</code></span>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  {activeTab === 'CADET_LOGIN' ? 'Email / Mobile / Dossier Number *' : 'Ustad Email / Registered Mobile *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={activeTab === 'CADET_LOGIN' ? 'cadet@gmail.com / 9832109845 / AIM-CADET-...' : 'havaldar.anup@aiminstitute.org'}
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-gray-300 uppercase">
                    Password *
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant={activeTab === 'CADET_LOGIN' ? 'saffron' : 'army'}
                size="lg"
                disabled={isLoading}
                className="w-full text-black font-extrabold uppercase font-display tracking-wider mt-2"
                leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? 'Verifying Credentials...' : activeTab === 'CADET_LOGIN' ? 'Enter Cadet Dossier' : 'Enter Ustad Command Center'}
              </Button>

              {activeTab === 'CADET_LOGIN' && (
                <div className="pt-2 text-center text-xs font-sans text-gray-400 border-t border-[#1A2415]">
                  <span>Not enlisted yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAdmission) onOpenAdmission();
                    }}
                    className="text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    Enlist in Cadet Squad (₹0 Free)
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: USTAD / TRAINER REGISTRATION */}
          {activeTab === 'TRAINER_REGISTER' && (
            <form onSubmit={handleTrainerRegister} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#121811] border border-blue-500/30 text-xs text-gray-300">
                <span className="text-blue-400 font-bold block mb-0.5">Ustad Enlistment Portal</span>
                <span>Register as an authorized AIM Physical Institute drill instructor to manage attendance, publish events, and record cadet 1600m trials.</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Ustad Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={trainerForm.fullName}
                  onChange={e => setTrainerForm({ ...trainerForm, fullName: e.target.value })}
                  placeholder="e.g. Havaldar Anup Kumar Mahato"
                  className="w-full bg-[#121811] border border-[#273623] rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={trainerForm.email}
                    onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })}
                    placeholder="ustad@aiminstitute.org"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={trainerForm.phone}
                    onChange={e => setTrainerForm({ ...trainerForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Regimental Rank / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={trainerForm.regimentOrTitle}
                    onChange={e => setTrainerForm({ ...trainerForm, regimentOrTitle: e.target.value })}
                    placeholder="e.g. Ex-Army Drill Havaldar"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Training Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={trainerForm.specialization}
                    onChange={e => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
                    placeholder="e.g. 1600m Track Intervals"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                  Create Account Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={trainerForm.password}
                    onChange={e => setTrainerForm({ ...trainerForm, password: e.target.value })}
                    placeholder="Create strong password"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-4 pr-10 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1 flex items-center justify-between">
                  <span>Regimental Passkey (Optional)</span>
                  <span className="text-[10px] text-gray-500 font-normal">Provided by Head Coach Anup Sir</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={trainerForm.secretVerificationCode}
                    onChange={e => setTrainerForm({ ...trainerForm, secretVerificationCode: e.target.value })}
                    placeholder="AIM-PURULIA-2026 (or leave blank)"
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-9 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="saffron"
                size="lg"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase font-display tracking-wider mt-2 border-none shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Award className="w-4 h-4" />}
              >
                {isLoading ? 'Registering Ustad...' : 'Register Drill Ustad Account'}
              </Button>

              <div className="pt-2 text-center text-xs font-sans text-gray-400 border-t border-[#1A2415]">
                <span>Already have an Ustad account? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('TRAINER_LOGIN')}
                  className="text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Ustad Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
