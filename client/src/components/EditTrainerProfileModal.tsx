'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Award,
  Phone,
  Mail,
  MapPin,
  Ruler,
  Scale,
  Activity,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { updateTrainerProfile } from '@/lib/api';

interface EditTrainerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: any;
  onProfileUpdated: (updatedTrainer: any) => void;
}

export const EditTrainerProfileModal: React.FC<EditTrainerProfileModalProps> = ({
  isOpen,
  onClose,
  trainer,
  onProfileUpdated
}) => {
  const [formData, setFormData] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (trainer) {
      setFormData({
        fullName: trainer.fullName || trainer.name || 'Havaldar Anup Kumar Mahato',
        rank: trainer.rank || 'Ex-Army Havaldar (Infantry Veteran)',
        regimentOrUnit: trainer.regimentOrUnit || trainer.regiment || 'Indian Army (Infantry / Rajputana Rifles)',
        yearsOfService: trainer.yearsOfService ?? 16,
        specialization: trainer.specialization || 'Chief Drill Instructor & 1600m Telemetry Master',
        designation: trainer.designation || 'Head Drill Ustad & Founder',
        phone: trainer.phone || '9876543210',
        email: trainer.email || 'havaldar.anup@aiminstitute.org',
        bloodGroup: trainer.bloodGroup || 'B+',
        domicileDistrict: trainer.domicileDistrict || 'Purulia',
        bio: trainer.bio || 'Ex-Indian Army Havaldar with 16+ years of military drill discipline and physical efficiency training expertise. Founder & Chief Training Master at Purulia AIM Physical Institute.',
        heightCm: trainer.heightCm ?? 178,
        weightKg: trainer.weightKg ?? 74,
        chestNormalCm: trainer.chestNormalCm ?? 84,
        chestExpandedCm: trainer.chestExpandedCm ?? 90
      });
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setNewPassword('');
    setConfirmPassword('');
  }, [trainer, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Confirm password does not match.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload: any = {
        ...formData,
        ...(newPassword ? { newPassword } : {})
      };

      const res = await updateTrainerProfile(payload);
      setSuccessMsg('Drill Ustad Profile updated successfully!');
      
      const updated = res.trainer || { ...trainer, ...payload };
      onProfileUpdated(updated);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update trainer profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0E140C] border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#273623] bg-gradient-to-r from-[#241706] via-[#1B2211] to-[#0E140C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                  Edit Drill Ustad Profile
                </h2>
                <Badge variant="saffron" size="sm">
                  HEAD INSTRUCTOR
                </Badge>
              </div>
              <p className="text-xs font-mono text-gray-400">
                Regimental Command & Chief Instructor Benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Section 1: Military Credentials & Rank */}
          <div>
            <h3 className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>1. Military Credentials & Regimental Title</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName || ''}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Military Rank *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rank || ''}
                  onChange={e => handleInputChange('rank', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="Ex-Army Havaldar"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Regiment / Parent Armed Unit
                </label>
                <input
                  type="text"
                  value={formData.regimentOrUnit || ''}
                  onChange={e => handleInputChange('regimentOrUnit', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="Indian Army (Infantry)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Designation / Academy Role
                </label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={e => handleInputChange('designation', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="Head Drill Ustad & Founder"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Years of Military / Drill Service
                </label>
                <input
                  type="number"
                  value={formData.yearsOfService ?? ''}
                  onChange={e => handleInputChange('yearsOfService', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="16"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Training Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization || ''}
                  onChange={e => handleInputChange('specialization', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="1600m Telemetry & Physical Efficiency Master"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Domicile */}
          <div className="pt-3 border-t border-[#273623]">
            <h3 className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>2. Official Contact & Academy Center</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Official Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={formData.bloodGroup || 'B+'}
                  onChange={e => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="B+"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Domicile District
                </label>
                <input
                  type="text"
                  value={formData.domicileDistrict || 'Purulia'}
                  onChange={e => handleInputChange('domicileDistrict', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="Purulia"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Physical Standards Benchmarks */}
          <div className="pt-3 border-t border-[#273623]">
            <h3 className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              <span>3. Physical Telemetry & Instructor Standards</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.heightCm ?? ''}
                  onChange={e => handleInputChange('heightCm', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="178"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightKg ?? ''}
                  onChange={e => handleInputChange('weightKg', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="74"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Chest Normal (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chestNormalCm ?? ''}
                  onChange={e => handleInputChange('chestNormalCm', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="84"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Chest Expanded (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chestExpandedCm ?? ''}
                  onChange={e => handleInputChange('chestExpandedCm', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  placeholder="90"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Bio / Regimental Message */}
          <div className="pt-3 border-t border-[#273623]">
            <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
              Ustad&apos;s Regimental Bio & Message to Cadets
            </label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={e => handleInputChange('bio', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none resize-none"
              placeholder="Ex-Indian Army Havaldar with 16+ years of military drill discipline..."
            />
          </div>

          {/* Section 5: Password Security */}
          <div className="p-4 rounded-2xl bg-[#0B0F0A] border border-[#273623] space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono text-amber-400 uppercase font-bold">
                Update Ustad Command Password (Optional)
              </h4>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">
              Leave blank to retain your existing login password.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  New Ustad Password (Min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E140C] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E140C] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#273623] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-gray-500">
              Changes reflect immediately on the Purulia AIM Ground command network.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1 sm:flex-initial justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="saffron"
                size="sm"
                disabled={isLoading}
                className="flex-1 sm:flex-initial justify-center min-w-[140px]"
                leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4 text-black" />}
              >
                {isLoading ? 'Saving...' : 'Save Ustad Profile'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
