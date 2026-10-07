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
  FileText,
  MapPin,
  Activity
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

  // Comprehensive Trainer / Ustad Register State
  const [trainerForm, setTrainerForm] = useState({
    // Section 1: Identification & Bio-Data
    fullName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    aadhaarNumber: '',
    phone: '',
    emergencyPhone: '',
    // Section 2: Residential Domicile
    domicileDistrict: 'Purulia',
    policeStation: '',
    villageTown: '',
    pinCode: '',
    // Section 3: Physical & Academic Standard
    bloodGroup: 'B+',
    heightCm: '172',
    weightKg: '68',
    chestNormalCm: '82',
    chestExpandedCm: '87',
    highestEducation: '12th Higher Secondary',
    // Section 4: Experience & Specialization (Ustad Core)
    regimentOrTitle: 'Ex-Army Physical Training Ustad',
    specialization: '1600m Track Pacing & BPET Obstacles',
    fieldExperienceYears: '5+ Years Active Defence / Physical Coaching',
    pastMilitaryServiceDetails: '',
    // Section 5: Credentials & Passkey
    email: '',
    password: '',
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
        fatherName: trainerForm.fatherName || undefined,
        dob: trainerForm.dob || undefined,
        gender: trainerForm.gender || undefined,
        aadhaarNumber: trainerForm.aadhaarNumber || undefined,
        emergencyPhone: trainerForm.emergencyPhone || undefined,
        domicileDistrict: trainerForm.domicileDistrict || undefined,
        policeStation: trainerForm.policeStation || undefined,
        villageTown: trainerForm.villageTown || undefined,
        pinCode: trainerForm.pinCode || undefined,
        bloodGroup: trainerForm.bloodGroup || undefined,
        heightCm: trainerForm.heightCm || undefined,
        weightKg: trainerForm.weightKg || undefined,
        chestNormalCm: trainerForm.chestNormalCm || undefined,
        chestExpandedCm: trainerForm.chestExpandedCm || undefined,
        highestEducation: trainerForm.highestEducation || undefined,
        fieldExperienceYears: trainerForm.fieldExperienceYears || undefined,
        regimentOrTitle: trainerForm.regimentOrTitle || undefined,
        specialization: trainerForm.specialization || undefined,
        pastMilitaryServiceDetails: trainerForm.pastMilitaryServiceDetails || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full ${activeTab === 'TRAINER_REGISTER' ? 'max-w-2xl max-h-[92vh]' : 'max-w-lg'} bg-[#0B0F0A] border border-[#273623] rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col`}>
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
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-120px)]">
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

          {/* TAB 3: COMPREHENSIVE USTAD / TRAINER REGISTRATION */}
          {activeTab === 'TRAINER_REGISTER' && (
            <form onSubmit={handleTrainerRegister} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#121811] border border-blue-500/30 text-xs text-gray-300">
                <span className="text-blue-400 font-bold block mb-0.5 text-sm font-display uppercase tracking-wider">
                  Official Ustad & Drill Instructor Enlistment
                </span>
                <span>
                  Authorized registration for Physical Training Instructors (PTI), ex-servicemen, and athletics coaches to take attendance, manage 1600m timings, broadcast daily war cries, and publish recruitment orders.
                </span>
              </div>

              {/* SECTION 1: PERSONAL & CONTACT BIO-DATA */}
              <div className="p-3.5 rounded-xl bg-[#0F150D] border border-[#273623] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#1F2B1C] pb-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                  <User className="w-3.5 h-3.5" />
                  <span>Section 1: Personal & Contact Bio-Data</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Ustad Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.fullName}
                      onChange={e => setTrainerForm({ ...trainerForm, fullName: e.target.value })}
                      placeholder="e.g. Havaldar Anup Kumar Mahato"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Father&apos;s Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.fatherName}
                      onChange={e => setTrainerForm({ ...trainerForm, fatherName: e.target.value })}
                      placeholder="Father's full name"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={trainerForm.dob}
                      onChange={e => setTrainerForm({ ...trainerForm, dob: e.target.value })}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Gender *
                    </label>
                    <select
                      value={trainerForm.gender}
                      onChange={e => setTrainerForm({ ...trainerForm, gender: e.target.value })}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Aadhaar Number (12 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={trainerForm.aadhaarNumber}
                      onChange={e => setTrainerForm({ ...trainerForm, aadhaarNumber: e.target.value })}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Primary Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={trainerForm.phone}
                      onChange={e => setTrainerForm({ ...trainerForm, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={trainerForm.emergencyPhone}
                      onChange={e => setTrainerForm({ ...trainerForm, emergencyPhone: e.target.value })}
                      placeholder="Emergency / Alternate Number"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: RESIDENTIAL & DOMICILE DETAILS */}
              <div className="p-3.5 rounded-xl bg-[#0F150D] border border-[#273623] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#1F2B1C] pb-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Section 2: Residential Domicile & Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Domicile District *
                    </label>
                    <select
                      value={trainerForm.domicileDistrict}
                      onChange={e => setTrainerForm({ ...trainerForm, domicileDistrict: e.target.value })}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    >
                      <option value="Purulia">Purulia (WB)</option>
                      <option value="Bankura">Bankura (WB)</option>
                      <option value="Paschim Medinipur">Paschim Medinipur (WB)</option>
                      <option value="Jhargram">Jhargram (WB)</option>
                      <option value="Bokaro">Bokaro (JH)</option>
                      <option value="Dhanbad">Dhanbad (JH)</option>
                      <option value="Ranchi">Ranchi (JH)</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Police Station *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.policeStation}
                      onChange={e => setTrainerForm({ ...trainerForm, policeStation: e.target.value })}
                      placeholder="e.g. Purulia Town / Mufassil"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Village / Town / Mohalla *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.villageTown}
                      onChange={e => setTrainerForm({ ...trainerForm, villageTown: e.target.value })}
                      placeholder="e.g. Ranchi Road, Purulia"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={trainerForm.pinCode}
                      onChange={e => setTrainerForm({ ...trainerForm, pinCode: e.target.value })}
                      placeholder="723101"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PHYSICAL STANDARDS & ACADEMIC QUALIFICATION */}
              <div className="p-3.5 rounded-xl bg-[#0F150D] border border-[#273623] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#1F2B1C] pb-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Section 3: Physical Standards & Education</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-300 uppercase mb-1">
                      Blood Group
                    </label>
                    <select
                      value={trainerForm.bloodGroup}
                      onChange={e => setTrainerForm({ ...trainerForm, bloodGroup: e.target.value })}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-300 uppercase mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={trainerForm.heightCm}
                      onChange={e => setTrainerForm({ ...trainerForm, heightCm: e.target.value })}
                      placeholder="172"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-300 uppercase mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={trainerForm.weightKg}
                      onChange={e => setTrainerForm({ ...trainerForm, weightKg: e.target.value })}
                      placeholder="68"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-300 uppercase mb-1">
                      Chest Normal
                    </label>
                    <input
                      type="number"
                      value={trainerForm.chestNormalCm}
                      onChange={e => setTrainerForm({ ...trainerForm, chestNormalCm: e.target.value })}
                      placeholder="82"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-300 uppercase mb-1">
                      Chest Exp (cm)
                    </label>
                    <input
                      type="number"
                      value={trainerForm.chestExpandedCm}
                      onChange={e => setTrainerForm({ ...trainerForm, chestExpandedCm: e.target.value })}
                      placeholder="87"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                    Highest Academic Qualification *
                  </label>
                  <select
                    value={trainerForm.highestEducation}
                    onChange={e => setTrainerForm({ ...trainerForm, highestEducation: e.target.value })}
                    className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
                  >
                    <option value="10th Matriculation">10th Matriculation (Secondary)</option>
                    <option value="12th Higher Secondary">12th Higher Secondary (Science / Arts / Comm)</option>
                    <option value="Graduate (B.A / B.Sc / B.Com / B.P.Ed)">Graduate (B.A / B.Sc / B.Com / B.P.Ed)</option>
                    <option value="Post Graduate (M.A / M.Sc / M.P.Ed)">Post Graduate (M.A / M.Sc / M.P.Ed)</option>
                    <option value="Army Education Corps Certificate">Army Education Corps (AEC) Certificate</option>
                  </select>
                </div>
              </div>

              {/* SECTION 4: FIELD EXPERIENCE & SPECIALIZATION (USTAD CORE) */}
              <div className="p-3.5 rounded-xl bg-[#0F150D] border-2 border-blue-500/40 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#1F2B1C] pb-1.5 text-blue-400 font-mono text-xs font-bold uppercase">
                  <Award className="w-3.5 h-3.5" />
                  <span>Section 4: Field Experience & Drill Specialization</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Regimental Rank / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.regimentOrTitle}
                      onChange={e => setTrainerForm({ ...trainerForm, regimentOrTitle: e.target.value })}
                      placeholder="e.g. Ex-Army Drill Havaldar / Chief PTI"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Training Specialization *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.specialization}
                      onChange={e => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
                      placeholder="e.g. 1600m Track Pacing, BPET Obstacles, SSB"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Experience on the Field / Coaching (Years) *
                    </label>
                    <input
                      type="text"
                      required
                      value={trainerForm.fieldExperienceYears}
                      onChange={e => setTrainerForm({ ...trainerForm, fieldExperienceYears: e.target.value })}
                      placeholder="e.g. 8+ Years Active Military & 4 Years Ground Coaching"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Past Military / Paramilitary Service Details
                    </label>
                    <input
                      type="text"
                      value={trainerForm.pastMilitaryServiceDetails}
                      onChange={e => setTrainerForm({ ...trainerForm, pastMilitaryServiceDetails: e.target.value })}
                      placeholder="e.g. Corps of Signals / Bihar Regiment / CRPF"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: ACCOUNT CREDENTIALS & SECURITY */}
              <div className="p-3.5 rounded-xl bg-[#0F150D] border border-[#273623] space-y-3">
                <div className="flex items-center gap-2 border-b border-[#1F2B1C] pb-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Section 5: Account Credentials & Secret Passkey</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Ustad Account Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={trainerForm.email}
                      onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })}
                      placeholder="ustad@aiminstitute.org"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={trainerForm.password}
                        onChange={e => setTrainerForm({ ...trainerForm, password: e.target.value })}
                        placeholder="Create strong password"
                        className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-3 pr-9 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1 flex items-center justify-between">
                    <span>Regimental Passkey (Optional)</span>
                    <span className="text-[10px] text-gray-500 font-normal">Provided by Head Coach Anup Sir</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={trainerForm.secretVerificationCode}
                      onChange={e => setTrainerForm({ ...trainerForm, secretVerificationCode: e.target.value })}
                      placeholder="AIM-PURULIA-2026 (or leave blank for standard registration)"
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl pl-9 pr-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="saffron"
                size="lg"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold uppercase font-display tracking-wider mt-2 border-none shadow-[0_0_25px_rgba(59,130,246,0.4)] justify-center"
                leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Award className="w-4 h-4" />}
              >
                {isLoading ? 'Registering Ustad Dossier...' : 'Enlist as Official AIM Drill Ustad'}
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
