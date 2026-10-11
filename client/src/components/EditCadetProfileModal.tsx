'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Activity,
  Ruler,
  Scale,
  Award,
  Lock,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  GraduationCap,
  Save
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { updateCadetProfile } from '@/lib/api';

interface EditCadetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  cadet: any;
  onProfileUpdated: (updatedCadet: any) => void;
}

export const EditCadetProfileModal: React.FC<EditCadetProfileModalProps> = ({
  isOpen,
  onClose,
  cadet,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'CONTACT' | 'PST' | 'ACADEMIC' | 'SECURITY'>('CONTACT');
  const [formData, setFormData] = useState<any>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cadet) {
      setFormData({
        fullName: cadet.fullName || '',
        fatherName: cadet.fatherName || '',
        motherName: cadet.motherName || '',
        phone: cadet.phone || '',
        emergencyPhone: cadet.emergencyPhone || '',
        villageTown: cadet.villageTown || '',
        postOffice: cadet.postOffice || '',
        policeStation: cadet.policeStation || '',
        domicileDistrict: cadet.domicileDistrict || 'Purulia',
        pinCode: cadet.pinCode || '',
        casteCategory: cadet.casteCategory || 'General',
        targetForce: cadet.targetForce || 'Indian Army Agniveer GD',
        heightCm: cadet.heightCm || '',
        weightKg: cadet.weightKg || '',
        chestNormalCm: cadet.chestNormalCm || '',
        chestExpandedCm: cadet.chestExpandedCm || '',
        current1600mTime: cadet.current1600mTime || '',
        currentBeamPullups: cadet.currentBeamPullups ?? '',
        visionStatus: cadet.visionStatus || 'Normal 6/6 (No Spectacles)',
        bodyTattoo: cadet.bodyTattoo || 'No Permanent Tattoos',
        highestEducation: cadet.highestEducation || '10th Matriculation',
        matricBoard: cadet.matricBoard || 'WBBSE',
        matricPassingYear: cadet.matricPassingYear || '',
        matricAggregatePercent: cadet.matricAggregatePercent ?? '',
        nccCertificate: cadet.nccCertificate || 'None',
        sportsLevel: cadet.sportsLevel || 'None',
        sportsDiscipline: cadet.sportsDiscipline || ''
      });
      setPhotoPreview(cadet.passportPhoto || null);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setPhotoError(null);
    setNewPassword('');
    setConfirmPassword('');
  }, [cadet, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    // Strict validation: Must be lower than 100KB
    const maxSizeBytes = 100 * 1024;
    if (file.size > maxSizeBytes) {
      const sizeKb = (file.size / 1024).toFixed(1);
      setPhotoError(`Photo size is ${sizeKb} KB. Regimental standard requires photo strictly UNDER 100 KB.`);
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setPhotoPreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Password confirmation does not match.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const dossierId = cadet.dossierNumber || cadet.id;
      const payload: any = {
        ...formData,
        ...(photoPreview ? { passportPhoto: photoPreview } : {}),
        ...(newPassword ? { newPassword } : {})
      };

      const res = await updateCadetProfile(dossierId, payload);
      setSuccessMsg('Cadet Profile updated successfully!');
      
      const updated = res.cadet || { ...cadet, ...payload };
      onProfileUpdated(updated);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0E140C] border-2 border-[#273623] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#273623] bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                  Edit Cadet Profile Dossier
                </h2>
                <Badge variant="saffron" size="sm">
                  {cadet?.dossierNumber || 'AIM-CADET'}
                </Badge>
              </div>
              <p className="text-xs font-mono text-gray-400">
                Purulia AIM Physical Institute • Military Telemetry Records
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

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#273623] bg-[#0B0F0A] px-4 sm:px-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'CONTACT', label: '1. Contact & Address', icon: Phone },
            { id: 'PST', label: '2. Physical PST & Run', icon: Ruler },
            { id: 'ACADEMIC', label: '3. Education & Target', icon: GraduationCap },
            { id: 'SECURITY', label: '4. Photo & Password', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: CONTACT & ADDRESS */}
          {activeTab === 'CONTACT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Cadet Full Name *
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
                    Father&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName || ''}
                    onChange={e => handleInputChange('fatherName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Mother&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={e => handleInputChange('motherName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Primary Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone || ''}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Emergency Parent Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.emergencyPhone || ''}
                    onChange={e => handleInputChange('emergencyPhone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Caste Category
                  </label>
                  <select
                    value={formData.casteCategory || 'General'}
                    onChange={e => handleInputChange('casteCategory', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="General">General (UR)</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-[#273623]">
                <h4 className="text-xs font-mono text-amber-400 uppercase font-bold mb-2">
                  Permanent Domicile & Police Verification Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      Village / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.villageTown || ''}
                      onChange={e => handleInputChange('villageTown', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      Post Office
                    </label>
                    <input
                      type="text"
                      value={formData.postOffice || ''}
                      onChange={e => handleInputChange('postOffice', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      Police Station *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.policeStation || ''}
                      onChange={e => handleInputChange('policeStation', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      Domicile District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.domicileDistrict || 'Purulia'}
                      onChange={e => handleInputChange('domicileDistrict', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pinCode || ''}
                      onChange={e => handleInputChange('pinCode', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHYSICAL PST & RUN TELEMETRY */}
          {activeTab === 'PST' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                PST standards are calibrated with Indian Army Agniveer & SSC GD Physical Efficiency Benchmarks.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.heightCm || ''}
                    onChange={e => handleInputChange('heightCm', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="170"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weightKg || ''}
                    onChange={e => handleInputChange('weightKg', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="62"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Chest Normal (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.chestNormalCm || ''}
                    onChange={e => handleInputChange('chestNormalCm', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="77"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Chest Exp (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.chestExpandedCm || ''}
                    onChange={e => handleInputChange('chestExpandedCm', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="82"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-[#273623]">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Current 1600m Run Time (mm:ss)
                  </label>
                  <input
                    type="text"
                    value={formData.current1600mTime || ''}
                    onChange={e => handleInputChange('current1600mTime', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="05:30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Beam Pull-ups Count (Reps)
                  </label>
                  <input
                    type="number"
                    value={formData.currentBeamPullups ?? ''}
                    onChange={e => handleInputChange('currentBeamPullups', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Vision Status
                  </label>
                  <select
                    value={formData.visionStatus || 'Normal 6/6 (No Spectacles)'}
                    onChange={e => handleInputChange('visionStatus', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="Normal 6/6 (No Spectacles)">Normal 6/6 (No Spectacles)</option>
                    <option value="Corrected with Spectacles (6/9 - 6/12)">Corrected with Spectacles (6/9 - 6/12)</option>
                    <option value="Colour Defective">Colour Defective (Partial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Permanent Body Tattoo
                  </label>
                  <select
                    value={formData.bodyTattoo || 'No Permanent Tattoos'}
                    onChange={e => handleInputChange('bodyTattoo', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="No Permanent Tattoos">No Permanent Tattoos</option>
                    <option value="Inner Forearm Permitted Tattoo">Inner Forearm Permitted Tattoo</option>
                    <option value="Tribal Body Art">Tribal Body Art</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMICS & TARGET */}
          {activeTab === 'ACADEMIC' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Target Armed Force / Cadre *
                  </label>
                  <select
                    value={formData.targetForce || 'Indian Army Agniveer GD'}
                    onChange={e => handleInputChange('targetForce', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="Indian Army Agniveer GD">Indian Army Agniveer GD</option>
                    <option value="Indian Army Agniveer Clerk / SKT">Indian Army Agniveer Clerk / SKT</option>
                    <option value="Indian Army Agniveer Technical">Indian Army Agniveer Technical</option>
                    <option value="Indian Army Agniveer Tradesman">Indian Army Agniveer Tradesman</option>
                    <option value="SSC GD Constable (CRPF/BSF/CISF/ITBP/SSB)">SSC GD Constable (CRPF/BSF/CISF/ITBP/SSB)</option>
                    <option value="West Bengal Police Constable">West Bengal Police Constable</option>
                    <option value="Kolkata Police Constable">Kolkata Police Constable</option>
                    <option value="Indian Navy SSR / MR">Indian Navy SSR / MR</option>
                    <option value="Indian Air Force Agniveervayu">Indian Air Force Agniveervayu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Highest Qualification
                  </label>
                  <select
                    value={formData.highestEducation || '10th Matriculation'}
                    onChange={e => handleInputChange('highestEducation', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="10th Matriculation">10th Matriculation</option>
                    <option value="12th Intermediate / Higher Secondary">12th Intermediate / Higher Secondary</option>
                    <option value="Diploma / ITI">Diploma / ITI</option>
                    <option value="Bachelor's Degree (Graduation)">Bachelor&apos;s Degree (Graduation)</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    10th Board of Examination
                  </label>
                  <input
                    type="text"
                    value={formData.matricBoard || 'WBBSE'}
                    onChange={e => handleInputChange('matricBoard', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    10th Passing Year
                  </label>
                  <input
                    type="number"
                    value={formData.matricPassingYear || ''}
                    onChange={e => handleInputChange('matricPassingYear', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="2022"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    10th Aggregate Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.matricAggregatePercent ?? ''}
                    onChange={e => handleInputChange('matricAggregatePercent', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="65.4"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    NCC Certificate
                  </label>
                  <select
                    value={formData.nccCertificate || 'None'}
                    onChange={e => handleInputChange('nccCertificate', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="None">None</option>
                    <option value="NCC 'A' Certificate">NCC &apos;A&apos; Certificate</option>
                    <option value="NCC 'B' Certificate">NCC &apos;B&apos; Certificate</option>
                    <option value="NCC 'C' Certificate (Exam Exemption)">NCC &apos;C&apos; Certificate (Exam Exemption)</option>
                    <option value="Republic Day Camp (RDC)">Republic Day Camp (RDC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Sports Representation Level
                  </label>
                  <select
                    value={formData.sportsLevel || 'None'}
                    onChange={e => handleInputChange('sportsLevel', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                  >
                    <option value="None">None</option>
                    <option value="District / Subdivision Level">District / Subdivision Level</option>
                    <option value="State Championship (Medalist / Participant)">State Championship (Medalist / Participant)</option>
                    <option value="National Championship (SGFI / Federations)">National Championship (SGFI / Federations)</option>
                    <option value="International Level">International Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                    Sports Discipline / Game
                  </label>
                  <input
                    type="text"
                    value={formData.sportsDiscipline || ''}
                    onChange={e => handleInputChange('sportsDiscipline', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F0A] border border-[#273623] focus:border-amber-500 text-white text-xs font-mono outline-none"
                    placeholder="Athletics / Football / Kabaddi"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO & SECURITY */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-5">
              {/* Passport Photo Upload with Strict < 100KB Limit */}
              <div className="p-4 rounded-2xl bg-[#0B0F0A] border border-[#273623] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono text-amber-400 uppercase font-bold">
                      Cadet Passport Photo (35mm × 45mm)
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Strict regimental requirement: Image file must be strictly below 100 KB.
                    </p>
                  </div>
                  <Badge variant="army" size="sm">
                    Max 100 KB
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-32 rounded-xl border-2 border-amber-500/80 bg-black flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-gray-500 font-mono text-[10px]">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{photoPreview ? 'Change Photo (<100KB)' : 'Upload Photo (<100KB)'}</span>
                    </button>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {photoError ? (
                      <div className="text-xs font-mono text-red-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{photoError}</span>
                      </div>
                    ) : (
                      <p className="text-[10px] font-mono text-emerald-400">
                        ✓ JPG, PNG or WEBP accepted. Strict &lt; 100 KB standard applied.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password update section */}
              <div className="p-4 rounded-2xl bg-[#0B0F0A] border border-[#273623] space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono text-amber-400 uppercase font-bold">
                    Change Account Password (Optional)
                  </h4>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">
                  Leave these fields blank if you do not wish to change your current login password.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                      New Password (Min 6 chars)
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
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#273623] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-gray-500">
              Updates will synchronize across Purulia AIM Ground records & Supabase.
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
                {isLoading ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
