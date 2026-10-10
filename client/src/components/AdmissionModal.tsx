'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  User,
  GraduationCap,
  Ruler,
  Scale,
  FileCheck2,
  AlertOctagon,
  Award,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Printer,
  ExternalLink,
  Loader2,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  Calculator,
  Percent,
  Layers
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { submitCadetAdmission } from '@/lib/api';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dossierId, setDossierId] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSizeKb, setPhotoSizeKb] = useState<number | null>(null);

  // Comprehensive Military Enlistment Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Identification Bio-Data
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Unmarried',
    aadhaarNumber: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    password: '',
    domicileDistrict: 'Purulia',
    policeStation: '',
    villageTown: '',
    postOffice: '',
    pinCode: '',
    casteCategory: 'General',
    passportPhoto: '',
    bloodGroup: 'B+',
    birthMarks: '',

    // Step 2: Comprehensive Qualifications (10th, 12th, Graduation, Post-Graduation)
    highestEducation: '10th Matriculation',
    matricBoard: 'WBBSE (West Bengal Board)',
    matricRollNumber: '',
    matricPassingYear: '2024',
    matricAggregatePercent: '',
    scienceMathPercent: '',

    // 10th Qualification Record
    tenthBoard: 'WBBSE (West Bengal Board of Secondary Education)',
    tenthStream: 'General (Secondary)',
    tenthSpecialization: 'All Compulsory Secondary Subjects',
    tenthPassingYear: '2024',
    tenthRollNumber: '',
    tenthMarksObtained: '',
    tenthFullMarks: '700',
    tenthPercentage: '',

    // 12th Qualification Record
    hasTwelfth: false,
    twelfthBoard: 'WBCHSE (West Bengal Council of Higher Secondary Education)',
    twelfthStream: 'Science',
    twelfthSpecialization: 'Physics, Chemistry, Mathematics',
    twelfthPassingYear: '2026',
    twelfthRollNumber: '',
    twelfthMarksObtained: '',
    twelfthFullMarks: '500',
    twelfthPercentage: '',

    // Graduation Qualification Record
    hasGraduation: false,
    gradUniversity: 'Sidho Kanho Birsha University (SKBU Purulia)',
    gradStream: 'B.Sc (Bachelor of Science)',
    gradSpecialization: 'Physics Honours',
    gradPassingYear: '2024',
    gradRollNumber: '',
    gradMarksObtained: '',
    gradFullMarks: '1800',
    gradPercentage: '',

    // Post Graduation Qualification Record
    hasPostGraduation: false,
    pgUniversity: 'Sidho Kanho Birsha University (SKBU Purulia)',
    pgStream: 'M.Sc (Master of Science)',
    pgSpecialization: 'Applied Physics',
    pgPassingYear: '2026',
    pgRollNumber: '',
    pgMarksObtained: '',
    pgFullMarks: '1200',
    pgPercentage: '',

    nccCertificate: 'None',
    sportsLevel: 'None',
    sportsDiscipline: '',

    // Step 3: Physical Standard Test (PST) & Baseline Telemetry
    targetForce: 'Indian Army Agniveer GD',
    heightCm: '',
    weightKg: '',
    chestNormalCm: '',
    chestExpandedCm: '',
    current1600mTime: '',
    currentBeamPullups: '',
    visionStatus: 'Normal 6/6 (No Spectacles)',
    bodyTattoo: 'No Permanent Tattoos',
    tattooDetails: '',

    // Step 4: Disciplinary, Past Records & Legal Character Declaration
    hasCriminalRecord: 'NO',
    criminalRecordDetails: '',
    hasAttendedPastRally: 'NO',
    pastRallyDetails: '',
    hasMedicalConditionOrSurgery: 'NO',
    medicalHistoryDetails: '',
    physicalMentalIssues: '',
    characterCertificateAvailable: true,
    standToOathConsent: false,
    noSubstanceAbuseConsent: false,
    mediaConsent: true
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const next: any = { ...prev, [name]: value };

        // Automatically calculate 10th percentage
        if (name === 'tenthMarksObtained' || name === 'tenthFullMarks') {
          const obtained = Number(name === 'tenthMarksObtained' ? value : prev.tenthMarksObtained);
          const total = Number(name === 'tenthFullMarks' ? value : prev.tenthFullMarks);
          if (total > 0 && !isNaN(obtained) && obtained >= 0) {
            const pct = ((obtained / total) * 100).toFixed(2);
            next.tenthPercentage = pct;
            next.matricAggregatePercent = pct;
          } else {
            next.tenthPercentage = '';
          }
        }

        // Automatically calculate 12th percentage
        if (name === 'twelfthMarksObtained' || name === 'twelfthFullMarks') {
          const obtained = Number(name === 'twelfthMarksObtained' ? value : prev.twelfthMarksObtained);
          const total = Number(name === 'twelfthFullMarks' ? value : prev.twelfthFullMarks);
          if (total > 0 && !isNaN(obtained) && obtained >= 0) {
            next.twelfthPercentage = ((obtained / total) * 100).toFixed(2);
          } else {
            next.twelfthPercentage = '';
          }
        }

        // Automatically calculate Graduation percentage
        if (name === 'gradMarksObtained' || name === 'gradFullMarks') {
          const obtained = Number(name === 'gradMarksObtained' ? value : prev.gradMarksObtained);
          const total = Number(name === 'gradFullMarks' ? value : prev.gradFullMarks);
          if (total > 0 && !isNaN(obtained) && obtained >= 0) {
            next.gradPercentage = ((obtained / total) * 100).toFixed(2);
          } else {
            next.gradPercentage = '';
          }
        }

        // Automatically calculate Post Graduation percentage
        if (name === 'pgMarksObtained' || name === 'pgFullMarks') {
          const obtained = Number(name === 'pgMarksObtained' ? value : prev.pgMarksObtained);
          const total = Number(name === 'pgFullMarks' ? value : prev.pgFullMarks);
          if (total > 0 && !isNaN(obtained) && obtained >= 0) {
            next.pgPercentage = ((obtained / total) * 100).toFixed(2);
          } else {
            next.pgPercentage = '';
          }
        }

        return next;
      });
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(formData.dob);

  const chestExpansion = Number(formData.chestExpandedCm || 0) - Number(formData.chestNormalCm || 0);

  const handleNext = () => {
    // Basic validation per step
    if (step === 1) {
      if (!formData.fullName || !formData.fatherName || !formData.phone || !formData.dob || !formData.aadhaarNumber) {
        alert('Please complete all mandatory fields: Full Name, Father’s Name, DOB, Phone, and Aadhaar.');
        return;
      }
      if (formData.aadhaarNumber.replace(/\s+/g, '').length !== 12) {
        alert('Please enter a valid 12-digit Aadhaar Card Number.');
        return;
      }
      if (formData.passportPhoto) {
        const base64Data = formData.passportPhoto.includes(',')
          ? formData.passportPhoto.split(',')[1]
          : formData.passportPhoto;
        const approximateBytes = Math.ceil((base64Data.length * 3) / 4);
        if (approximateBytes >= 100 * 1024) {
          const sizeKb = (approximateBytes / 1024).toFixed(1);
          alert(`Passport photograph (${sizeKb} KB) exceeds the 100 KB limit. Photos must strictly be lower than 100 KB.`);
          return;
        }
      }
    } else if (step === 2) {
      if (!formData.tenthMarksObtained || !formData.tenthFullMarks) {
        alert('Please enter your 10th Standard Marks Obtained and Full Marks.');
        return;
      }
      if (Number(formData.tenthMarksObtained) < 0 || Number(formData.tenthFullMarks) <= 0) {
        alert('Please enter valid positive numbers for 10th marks.');
        return;
      }
      if (Number(formData.tenthMarksObtained) > Number(formData.tenthFullMarks)) {
        alert('10th Marks Obtained cannot exceed Full Marks.');
        return;
      }
      if (formData.hasTwelfth) {
        if (!formData.twelfthMarksObtained || !formData.twelfthFullMarks) {
          alert('Please enter your 12th Standard Marks Obtained and Full Marks.');
          return;
        }
        if (Number(formData.twelfthMarksObtained) > Number(formData.twelfthFullMarks)) {
          alert('12th Marks Obtained cannot exceed Full Marks.');
          return;
        }
      }
      if (formData.hasGraduation) {
        if (!formData.gradMarksObtained || !formData.gradFullMarks) {
          alert('Please enter your Graduation Marks Obtained and Full Marks.');
          return;
        }
        if (Number(formData.gradMarksObtained) > Number(formData.gradFullMarks)) {
          alert('Graduation Marks Obtained cannot exceed Full Marks.');
          return;
        }
      }
      if (formData.hasPostGraduation) {
        if (!formData.pgMarksObtained || !formData.pgFullMarks) {
          alert('Please enter your Post Graduation Marks Obtained and Full Marks.');
          return;
        }
        if (Number(formData.pgMarksObtained) > Number(formData.pgFullMarks)) {
          alert('Post Graduation Marks Obtained cannot exceed Full Marks.');
          return;
        }
      }
    } else if (step === 3) {
      if (!formData.heightCm || !formData.weightKg || !formData.chestNormalCm || !formData.chestExpandedCm) {
        alert('Please fill all Physical Standard Test (PST) measurements.');
        return;
      }
      if (chestExpansion < 5) {
        const proceed = confirm(
          `Official Army standard requires minimum 5.0 cm chest expansion (Current: ${chestExpansion} cm). Do you wish to continue and join chest expansion drill?`
        );
        if (!proceed) return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_PHOTO_BYTES = 100 * 1024; // Strictly 100 KB
    if (file.size >= MAX_PHOTO_BYTES) {
      const sizeInKb = (file.size / 1024).toFixed(1);
      setPhotoError(`Photo size is ${sizeInKb} KB. Photos must strictly be lower than 100 KB.`);
      setPhotoSizeKb(null);
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Invalid file format. Please upload a JPG, PNG, or WebP photo.');
      return;
    }

    setPhotoError(null);
    const sizeInKb = parseFloat((file.size / 1024).toFixed(1));
    setPhotoSizeKb(sizeInKb);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, passportPhoto: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, passportPhoto: '' }));
    setPhotoError(null);
    setPhotoSizeKb(null);
  };

  const renderDivisionBadge = (percentStr: string | number) => {
    const p = parseFloat(String(percentStr));
    if (isNaN(p) || p <= 0) return null;
    if (p >= 75) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
          ✓ Distinction (≥75%)
        </span>
      );
    }
    if (p >= 60) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 font-bold">
          ✓ 1st Div (≥60%)
        </span>
      );
    }
    if (p >= 45) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
          ✓ 2nd Div (Army GD Eligible)
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold">
        ⚠ Pass Div (&lt;45%)
      </span>
    );
  };

  const persistQualificationsToLocal = () => {
    try {
      const qData = {
        tenth: {
          board: formData.tenthBoard,
          stream: formData.tenthStream,
          specialization: formData.tenthSpecialization,
          passingYear: formData.tenthPassingYear,
          rollNumber: formData.tenthRollNumber,
          marksObtained: formData.tenthMarksObtained,
          fullMarks: formData.tenthFullMarks,
          percentage: formData.tenthPercentage
        },
        twelfth: formData.hasTwelfth ? {
          board: formData.twelfthBoard,
          stream: formData.twelfthStream,
          specialization: formData.twelfthSpecialization,
          passingYear: formData.twelfthPassingYear,
          rollNumber: formData.twelfthRollNumber,
          marksObtained: formData.twelfthMarksObtained,
          fullMarks: formData.twelfthFullMarks,
          percentage: formData.twelfthPercentage
        } : null,
        graduation: formData.hasGraduation ? {
          board: formData.gradUniversity,
          stream: formData.gradStream,
          specialization: formData.gradSpecialization,
          passingYear: formData.gradPassingYear,
          rollNumber: formData.gradRollNumber,
          marksObtained: formData.gradMarksObtained,
          fullMarks: formData.gradFullMarks,
          percentage: formData.gradPercentage
        } : null,
        postGraduation: formData.hasPostGraduation ? {
          board: formData.pgUniversity,
          stream: formData.pgStream,
          specialization: formData.pgSpecialization,
          passingYear: formData.pgPassingYear,
          rollNumber: formData.pgRollNumber,
          marksObtained: formData.pgMarksObtained,
          fullMarks: formData.pgFullMarks,
          percentage: formData.pgPercentage
        } : null
      };
      localStorage.setItem('cadet_qualifications', JSON.stringify(qData));
    } catch (e) {
      console.warn('Failed to save cadet qualifications to localStorage:', e);
    }
  };

  const handleSubmit = async () => {
    if (!formData.standToOathConsent || !formData.noSubstanceAbuseConsent) {
      alert('Mandatory Stand-To Oath & Anti-Substance Abuse Declarations must be confirmed.');
      return;
    }
    // Pre-dispatch strict verification: photo must be lower than 100 KB
    if (formData.passportPhoto) {
      const base64Data = formData.passportPhoto.includes(',')
        ? formData.passportPhoto.split(',')[1]
        : formData.passportPhoto;
      const approximateBytes = Math.ceil((base64Data.length * 3) / 4);
      if (approximateBytes >= 100 * 1024) {
        const sizeKb = (approximateBytes / 1024).toFixed(1);
        alert(`Passport photo exceeds strict 100 KB limit (${sizeKb} KB). Photo must be lower than 100 KB.`);
        return;
      }
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitCadetAdmission(formData);
      const assignedId = res.dossierNumber || `AIM-CADET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setDossierId(assignedId);
      if (formData.passportPhoto) {
        try {
          localStorage.setItem('cadet_passport_photo', formData.passportPhoto);
        } catch (e) {
          console.warn('Could not save photo to localStorage:', e);
        }
      }
      if (formData.fullName) {
        localStorage.setItem('cadet_name', formData.fullName);
      }
      if (formData.bloodGroup) {
        localStorage.setItem('cadet_blood_group', formData.bloodGroup);
      }
      if (formData.birthMarks) {
        localStorage.setItem('cadet_birth_marks', formData.birthMarks);
      }
      if (formData.targetForce) {
        localStorage.setItem('cadet_target_force', formData.targetForce);
      }
      if (formData.heightCm) {
        localStorage.setItem('cadet_height', String(formData.heightCm));
      }
      if (formData.weightKg) {
        localStorage.setItem('cadet_weight', String(formData.weightKg));
      }
      if (formData.chestNormalCm) {
        localStorage.setItem('cadet_chest_normal', String(formData.chestNormalCm));
      }
      if (formData.chestExpandedCm) {
        localStorage.setItem('cadet_chest_expanded', String(formData.chestExpandedCm));
      }
      localStorage.setItem('cadet_dossier_id', assignedId);
      try {
        localStorage.setItem('cadet_full_profile', JSON.stringify({ ...formData, dossierNumber: assignedId }));
      } catch (e) {}
      persistQualificationsToLocal();
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Backend admission submission error:', err);
      const errorMsg = err.message || 'Failed to submit admission dossier to server';
      setServerError(`Submission Failed: ${errorMsg}`);
      alert(`Admission Submission Failed:\n\n${errorMsg}\n\nPlease check your inputs (photo must be lower than 100 KB).`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0B0F0A] border border-[#273623] rounded-2xl shadow-[0_0_60px_rgba(75,97,53,0.35)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-6 border-b border-[#273623] bg-[#121811] flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-sm sm:text-xl text-white uppercase tracking-wider">
                  Cadet Enlistment Order
                </h3>
                <Badge variant="army" size="sm" className="hidden sm:inline-flex">
                  100% Free
                </Badge>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-400 font-mono truncate max-w-[210px] sm:max-w-none">
                Regimental Training Directorate • Form R-01
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A2415] border border-transparent hover:border-[#273623] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 font-sans space-y-4 sm:space-y-6">
          {isSubmitted ? (
            /* Submission Official Dossier Acknowledgment */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                  Enlistment Dossier Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mt-2">
                  Jai Hind, <strong className="text-amber-400">{formData.fullName}</strong>. Your preliminary military intake dossier has been entered into the Quarter Guard muster roll under Chief Drill Instructor <strong className="text-white">Havaldar Anup Kumar Mahato (Ex-Army)</strong>.
                </p>
              </div>

              {/* Official Induction Card */}
              <div className="bg-[#121811] p-5 rounded-2xl border border-amber-500/50 text-left text-xs font-mono space-y-3 max-w-xl mx-auto shadow-xl">
                <div className="flex items-center justify-between border-b border-[#273623] pb-2.5">
                  <div>
                    <span className="text-gray-500 uppercase text-[10px] block">Cadet Dossier ID</span>
                    <span className="text-amber-400 font-bold text-base">{dossierId}</span>
                  </div>
                  <Badge variant="saffron" size="sm">
                    Status: Enlisted For First Light Drill
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
                  {formData.passportPhoto && (
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl border-2 border-amber-500/70 overflow-hidden bg-black flex-shrink-0 shadow-lg relative mx-auto sm:mx-0">
                      <img
                        src={formData.passportPhoto}
                        alt="Cadet Passport Photo"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] font-mono text-amber-400 text-center py-0.5 font-bold uppercase tracking-wider">
                        ATTESTED
                      </span>
                    </div>
                  )}

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                    <div>
                      <span className="text-gray-500 text-[10px] block">TARGET RECRUITMENT WING:</span>
                      <span className="font-bold text-white">{formData.targetForce}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">PARADE GROUND:</span>
                      <span className="font-bold text-white">J.K. College Field & Purulia Stadium</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">FIRST LIGHT STAND-TO:</span>
                      <span className="font-bold text-lime-400">05:00am hrs IST Sharp (Daily)</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block">CRIMINAL / DISCIPLINARY RECORD:</span>
                      <span className="font-bold text-emerald-400">Declared Clean (NIL FIR)</span>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-[#1A2415]">
                      <span className="text-gray-500 text-[10px] block uppercase font-mono">Academic Qualifications Portfolio:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1 font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#0E140C] border border-amber-500/40 text-amber-400 text-[10px]">
                          10th: {formData.tenthMarksObtained}/{formData.tenthFullMarks} ({formData.tenthPercentage}%) • {formData.tenthBoard.split(' ')[0]}
                        </span>
                        {formData.hasTwelfth && formData.twelfthPercentage && (
                          <span className="px-2 py-0.5 rounded bg-[#0E140C] border border-blue-500/40 text-blue-400 text-[10px]">
                            12th ({formData.twelfthStream}): {formData.twelfthMarksObtained}/{formData.twelfthFullMarks} ({formData.twelfthPercentage}%)
                          </span>
                        )}
                        {formData.hasGraduation && formData.gradPercentage && (
                          <span className="px-2 py-0.5 rounded bg-[#0E140C] border border-emerald-500/40 text-emerald-400 text-[10px]">
                            Grad ({formData.gradStream}): {formData.gradMarksObtained}/{formData.gradFullMarks} ({formData.gradPercentage}%)
                          </span>
                        )}
                        {formData.hasPostGraduation && formData.pgPercentage && (
                          <span className="px-2 py-0.5 rounded bg-[#0E140C] border border-purple-500/40 text-purple-400 text-[10px]">
                            PG ({formData.pgStream}): {formData.pgMarksObtained}/{formData.pgFullMarks} ({formData.pgPercentage}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1A2415] text-[11px] text-gray-400 space-y-1">
                  <div className="text-amber-300 font-bold uppercase">Mandatory First Muster Items:</div>
                  <div>• PT Kit: Running shoes, physical training shorts/trackpants.</div>
                  <div>• Physical Documents: Aadhaar Card, 10th Admit/Marksheet, 2 Passport Photos.</div>
                  <div>• Reporting Desk: J.K. College Field Pavilion with Hav. Anup Sir.</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2">
                <Button
                  variant="saffron"
                  size="md"
                  className="w-full sm:w-auto justify-center"
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                    onClose();
                  }}
                >
                  Acknowledge & Return
                </Button>
                <a
                  href="/portal/student"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <User className="w-4 h-4" />
                  Go to Cadet Profile →
                </a>
                <a
                  href={`http://localhost:4000/api/v1/mvc/cadet-card/${dossierId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600/30 font-mono text-xs font-bold transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  View Official Admit Card
                </a>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto justify-center"
                  leftIcon={<Printer className="w-4 h-4 text-amber-400" />}
                  onClick={() => window.print()}
                >
                  Print Induction Dossier
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* Stepper Progress Bar */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#273623] text-center font-mono">
                {[
                  { num: 1, title: 'Bio-Data & ID', icon: <User className="w-3.5 h-3.5" /> },
                  { num: 2, title: 'Education & NCC', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                  { num: 3, title: 'PST & Telemetry', icon: <Ruler className="w-3.5 h-3.5" /> },
                  { num: 4, title: 'Legal & Stand-To', icon: <AlertOctagon className="w-3.5 h-3.5" /> }
                ].map(s => (
                  <div
                    key={s.num}
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-2 rounded-lg transition-all cursor-pointer ${step === s.num
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 font-bold'
                      : step > s.num
                        ? 'text-emerald-400 border border-emerald-500/30 bg-[#121811]'
                        : 'text-gray-500 border border-transparent'
                      }`}
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-current flex items-center justify-center text-[9px] sm:text-[10px]">
                      {step > s.num ? '✓' : s.num}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider hidden sm:inline">{s.title}</span>
                  </div>
                ))}
              </div>

              {serverError && (
                <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-mono mb-4">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* STEP 1: PERSONAL & IDENTIFICATION BIO-DATA */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#121811] p-3 rounded-xl border border-[#273623] text-xs font-mono gap-2">
                    <span className="text-amber-400 font-bold uppercase">Section 1: Identification & Security Credentials</span>
                    {onOpenLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenLogin();
                        }}
                        className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
                      >
                        Already Enlisted? Login to Cadet Dossier →
                      </button>
                    )}
                  </div>

                  {/* Passport Sized Photograph (35mm x 45mm) Upload Module */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#121811] border border-amber-500/40 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-amber-400" />
                          Affix Passport-Sized Photograph (35mm × 45mm)
                        </span>
                        <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                          Upload front-facing photo on light background. Must strictly be lower than 100 KB.
                        </p>
                      </div>
                      {formData.passportPhoto && (
                        <Badge variant="army" size="sm" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                          ✓ Photo Affixed {photoSizeKb ? `(${photoSizeKb} KB / <100 KB)` : '(<100 KB)'}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pt-1">
                      {/* 35mm x 45mm Passport Photo Frame */}
                      <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl border-2 border-dashed border-amber-500/60 bg-[#0B0F0A] flex flex-col items-center justify-center overflow-hidden flex-shrink-0 group shadow-inner">
                        {formData.passportPhoto ? (
                          <>
                            <img
                              src={formData.passportPhoto}
                              alt="Cadet Passport Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer text-[10px] font-mono flex items-center gap-1 font-bold shadow-md"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-black/85 border-t border-[#273623] py-0.5 text-center text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                              35mm × 45mm
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-gray-500">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase leading-tight">
                              AFFIX PHOTO
                            </span>
                            <span className="text-[9px] text-amber-400/80 font-mono mt-0.5">
                              35mm × 45mm
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Controls and Guidelines */}
                      <div className="flex-1 w-full space-y-2.5 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{formData.passportPhoto ? 'Change Photo' : 'Upload Passport Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>

                          {formData.passportPhoto && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A2415] hover:bg-rose-950/40 border border-[#273623] hover:border-rose-500/50 text-gray-300 hover:text-rose-400 font-mono text-xs transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        {photoError && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono bg-rose-950/30 p-2 rounded-lg border border-rose-900/50">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{photoError}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-gray-400 font-sans space-y-1">
                          <div>• Max file size: <strong className="text-amber-400 font-bold">Strictly lower than 100 KB</strong> (Govt / Defence Exam Standard)</div>
                          <div>• Ensure clear frontal view with both ears visible, neutral background</div>
                          <div>• Synchronizes immediately with your <strong>Cadet Profile</strong> & <strong>Admit Card</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Full Name (As per 10th Class Certificate) *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Cadet Full Name"
                      className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Father's / Guardian's Full Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        required
                        value={formData.fatherName}
                        onChange={handleChange}
                        placeholder="Father's Name"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Mother's Full Name *
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="Mother's Name"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                      />
                      {age !== null && (
                        <span className={`text-[10px] font-mono mt-1 block ${age >= 17 && age <= 23 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Age: {age} yrs {age >= 17 && age <= 21 ? '(Agniveer GD Eligible)' : '(Police/Paramilitary Range)'}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female (Lady Constable / Agniveer)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Marital Status *
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="Unmarried">Unmarried (Mandatory for Agniveer)</option>
                        <option value="Married">Married (Police/Civilian only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Blood Group *
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="A+">A+ (A Positive)</option>
                        <option value="A-">A- (A Negative)</option>
                        <option value="B+">B+ (B Positive)</option>
                        <option value="B-">B- (B Negative)</option>
                        <option value="AB+">AB+ (AB Positive)</option>
                        <option value="AB-">AB- (AB Negative)</option>
                        <option value="O+">O+ (O Positive)</option>
                        <option value="O-">O- (O Negative)</option>
                        <option value="Unknown (To be Tested)">Unknown (To be Tested)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Aadhaar Card Number (12 Digits) *
                      </label>
                      <input
                        type="text"
                        name="aadhaarNumber"
                        required
                        maxLength={14}
                        value={formData.aadhaarNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Caste / Reservation Category *
                      </label>
                      <select
                        name="casteCategory"
                        value={formData.casteCategory}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="General">General / Unreserved</option>
                        <option value="OBC">OBC (Other Backward Classes)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe - Height Relaxations apply)</option>
                        <option value="Gorkha/Tribal">Gorkha / Hill Tribes (PST Relaxations apply)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Physical Birth Marks / Identification Marks on Body *
                    </label>
                    <input
                      type="text"
                      name="birthMarks"
                      value={formData.birthMarks}
                      onChange={handleChange}
                      placeholder="e.g. A dark mole on the right cheek / A scar on the left forearm"
                      className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                      Permanent visible bodily identification mark (Mandatory for Indian Armed Forces / Police Rally verification).
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Primary Mobile & WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Emergency Contact / Parent Phone *
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder="Alternate phone number"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Account Login Credentials */}
                  <div className="p-3.5 rounded-xl bg-[#0E140C] border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Cadet Login & Security Credentials
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">Used for Cadet Dossier Login</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                          Email Address (Login ID) *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="cadet.name@gmail.com"
                          className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                          Create Password (min. 6 characters) *
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Domicile District *
                      </label>
                      <select
                        name="domicileDistrict"
                        value={formData.domicileDistrict}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="Purulia">Purulia</option>
                        <option value="Bankura">Bankura</option>
                        <option value="Jhargram">Jhargram</option>
                        <option value="Paschim Medinipur">Paschim Medinipur</option>
                        <option value="Purba Medinipur">Purba Medinipur</option>
                        <option value="Birbhum">Birbhum</option>
                        <option value="Other West Bengal District">Other WB District</option>
                        <option value="Jharkhand (Inter-State Aspirant)">Jharkhand Native</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Police Station (Thana) *
                      </label>
                      <input
                        type="text"
                        name="policeStation"
                        value={formData.policeStation}
                        onChange={handleChange}
                        placeholder="e.g. Purulia Town / Hura"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Village / Street & PIN *
                      </label>
                      <input
                        type="text"
                        name="villageTown"
                        value={formData.villageTown}
                        onChange={handleChange}
                        placeholder="e.g. Manbazar, 723101"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EDUCATIONAL QUALIFICATIONS & MILITARY CERTS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#121811] p-3 rounded-xl border border-[#273623] text-xs font-mono gap-1.5">
                    <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      Section 2: Educational Qualifications & Academic Records
                    </span>
                    <span className="text-gray-400 text-[11px] flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-amber-500" />
                      Automatic percentage calculation on marks entry
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Highest Completed Educational Qualification *
                    </label>
                    <select
                      name="highestEducation"
                      value={formData.highestEducation}
                      onChange={handleChange}
                      className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="10th Matriculation">10th Matriculation (Standard GD Criteria)</option>
                      <option value="12th Intermediate (Science)">12th Intermediate - Science (PCM / Bio)</option>
                      <option value="12th Intermediate (Arts/Commerce)">12th Intermediate - Arts / Commerce</option>
                      <option value="Diploma / ITI">Diploma / Technical ITI</option>
                      <option value="Graduate / Degree">Graduate / Bachelor's Degree (SI Eligible)</option>
                      <option value="Post Graduate / Master's">Post Graduate / Master's Degree (Officer Eligible)</option>
                    </select>
                  </div>

                  {/* -------------------------------------------------------------
                      1. 10TH MATRICULATION QUALIFICATION RECORD (MANDATORY)
                      ------------------------------------------------------------- */}
                  <div className="bg-[#121811] p-3.5 sm:p-4 rounded-xl border border-amber-500/40 space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#273623] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold font-mono text-white uppercase">
                            10th Standard / Matriculation Record
                          </h4>
                          <span className="text-[10px] text-amber-400 font-mono">
                            Mandatory • Army GD Minimum: 45% Aggregate
                          </span>
                        </div>
                      </div>
                      <Badge variant="army" size="sm">
                        Foundation
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          10th Board / Council *
                        </label>
                        <select
                          name="tenthBoard"
                          value={formData.tenthBoard}
                          onChange={handleChange}
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="WBBSE (West Bengal Board)">WBBSE (West Bengal Secondary Board)</option>
                          <option value="CBSE">CBSE (Central Board)</option>
                          <option value="ICSE / CISCE">ICSE / CISCE</option>
                          <option value="JAC (Jharkhand Academic Council)">JAC (Jharkhand Council)</option>
                          <option value="Bihar School Examination Board">BSEB (Bihar Board)</option>
                          <option value="Other Recognized State Board">Other Recognized State Board</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          Stream / Curriculum *
                        </label>
                        <input
                          type="text"
                          name="tenthStream"
                          value={formData.tenthStream}
                          onChange={handleChange}
                          placeholder="e.g. General / Secondary / Madhyamik"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          Specialization / Subject Group *
                        </label>
                        <input
                          type="text"
                          name="tenthSpecialization"
                          value={formData.tenthSpecialization}
                          onChange={handleChange}
                          placeholder="e.g. All Compulsory Secondary Subjects"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          10th Roll No / Reg No
                        </label>
                        <input
                          type="text"
                          name="tenthRollNumber"
                          value={formData.tenthRollNumber}
                          onChange={handleChange}
                          placeholder="e.g. 1042-WB-2024"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          10th Passing Year *
                        </label>
                        <input
                          type="number"
                          name="tenthPassingYear"
                          min="2010"
                          max="2026"
                          value={formData.tenthPassingYear}
                          onChange={handleChange}
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          Science & Math % *
                        </label>
                        <input
                          type="number"
                          name="scienceMathPercent"
                          min="30"
                          max="100"
                          value={formData.scienceMathPercent}
                          onChange={handleChange}
                          placeholder="e.g. 52%"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Marks Obtained, Full Marks & Automatic Percentage Calculation */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-mono text-amber-400 uppercase font-bold mb-1">
                          10th Marks Obtained *
                        </label>
                        <input
                          type="number"
                          name="tenthMarksObtained"
                          min="0"
                          value={formData.tenthMarksObtained}
                          onChange={handleChange}
                          placeholder="e.g. 525"
                          className="w-full bg-[#0B0F0A] border border-amber-500/50 rounded-lg px-3 py-2 text-white text-sm font-bold font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                          10th Full / Total Marks *
                        </label>
                        <input
                          type="number"
                          name="tenthFullMarks"
                          min="100"
                          value={formData.tenthFullMarks}
                          onChange={handleChange}
                          placeholder="e.g. 700"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-sm font-mono"
                        />
                      </div>

                      <div className="bg-[#0B0F0A] border border-amber-500/40 rounded-lg p-2.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-400 uppercase">
                            10th Calculated % (Auto)
                          </span>
                          <span className="text-[9px] font-mono text-amber-400 font-bold uppercase flex items-center gap-0.5">
                            <Calculator className="w-3 h-3" /> Auto
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-1 mt-1">
                          <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
                            {formData.tenthPercentage ? `${formData.tenthPercentage}%` : '0.00%'}
                          </span>
                          {renderDivisionBadge(formData.tenthPercentage)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      2. 12TH INTERMEDIATE / HIGHER SECONDARY (10+2)
                      ------------------------------------------------------------- */}
                  <div className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    formData.hasTwelfth
                      ? 'bg-[#121811] border-blue-500/50 shadow-md'
                      : 'bg-[#121811]/60 border-[#273623]'
                  }`}>
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="hasTwelfth"
                          checked={formData.hasTwelfth}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-[#273623] text-blue-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold font-mono text-white uppercase block">
                              12th Standard / Higher Secondary (10+2 / Intermediate)
                            </span>
                            <span className="text-[10px] text-gray-400 font-sans">
                              Check if completed or appearing (Army Clerk, Technical & Airmen Criteria)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={formData.hasTwelfth ? 'saffron' : 'outline'} size="sm">
                        {formData.hasTwelfth ? 'Enabled' : 'Optional'}
                      </Badge>
                    </label>

                    {formData.hasTwelfth && (
                      <div className="space-y-3 pt-3 mt-3 border-t border-[#273623] animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              12th Board / Council *
                            </label>
                            <select
                              name="twelfthBoard"
                              value={formData.twelfthBoard}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                            >
                              <option value="WBCHSE (West Bengal Council of Higher Secondary)">WBCHSE (West Bengal Council)</option>
                              <option value="CBSE (Class XII)">CBSE (Class XII)</option>
                              <option value="ISC (CISCE 10+2)">ISC (CISCE 10+2)</option>
                              <option value="JAC (Jharkhand Academic Council Intermediate)">JAC (Jharkhand Council)</option>
                              <option value="State Technical / ITI Council">State Technical / ITI Council</option>
                              <option value="Other Recognized 10+2 Board">Other Recognized 10+2 Board</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              12th Stream *
                            </label>
                            <select
                              name="twelfthStream"
                              value={formData.twelfthStream}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                            >
                              <option value="Science">Science (PCM / Physics-Chemistry-Math)</option>
                              <option value="Science (PCB)">Science (PCB / Bio-Science)</option>
                              <option value="Arts / Humanities">Arts / Humanities</option>
                              <option value="Commerce">Commerce</option>
                              <option value="Vocational / Technical Diploma">Vocational / Technical Diploma</option>
                              <option value="Other">Other Stream</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Specialization / Major Subjects *
                            </label>
                            <input
                              type="text"
                              name="twelfthSpecialization"
                              value={formData.twelfthSpecialization}
                              onChange={handleChange}
                              placeholder="e.g. Physics, Chemistry, Mathematics"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              12th Roll No / Reg No
                            </label>
                            <input
                              type="text"
                              name="twelfthRollNumber"
                              value={formData.twelfthRollNumber}
                              onChange={handleChange}
                              placeholder="e.g. 2108-WB-2026"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              12th Passing Year
                            </label>
                            <input
                              type="number"
                              name="twelfthPassingYear"
                              min="2012"
                              max="2026"
                              value={formData.twelfthPassingYear}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Marks Obtained, Full Marks & Automatic Percentage Calculation */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-mono text-blue-400 uppercase font-bold mb-1">
                              12th Marks Obtained
                            </label>
                            <input
                              type="number"
                              name="twelfthMarksObtained"
                              min="0"
                              value={formData.twelfthMarksObtained}
                              onChange={handleChange}
                              placeholder="e.g. 410"
                              className="w-full bg-[#0B0F0A] border border-blue-500/50 rounded-lg px-3 py-2 text-white text-sm font-bold font-mono focus:outline-none focus:border-blue-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              12th Full / Total Marks
                            </label>
                            <input
                              type="number"
                              name="twelfthFullMarks"
                              min="100"
                              value={formData.twelfthFullMarks}
                              onChange={handleChange}
                              placeholder="e.g. 500"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-sm font-mono"
                            />
                          </div>

                          <div className="bg-[#0B0F0A] border border-blue-500/40 rounded-lg p-2.5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-400 uppercase">
                                12th Calculated % (Auto)
                              </span>
                              <span className="text-[9px] font-mono text-blue-400 font-bold uppercase flex items-center gap-0.5">
                                <Calculator className="w-3 h-3" /> Auto
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between gap-1 mt-1">
                              <span className="text-base sm:text-lg font-bold font-mono text-blue-400">
                                {formData.twelfthPercentage ? `${formData.twelfthPercentage}%` : '0.00%'}
                              </span>
                              {renderDivisionBadge(formData.twelfthPercentage)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* -------------------------------------------------------------
                      3. GRADUATION / BACHELOR'S DEGREE (SUB-INSPECTOR & CDS ENTRY)
                      ------------------------------------------------------------- */}
                  <div className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    formData.hasGraduation
                      ? 'bg-[#121811] border-emerald-500/50 shadow-md'
                      : 'bg-[#121811]/60 border-[#273623]'
                  }`}>
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="hasGraduation"
                          checked={formData.hasGraduation}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-[#273623] text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold font-mono text-white uppercase block">
                              Graduation / Bachelor's Degree
                            </span>
                            <span className="text-[10px] text-gray-400 font-sans">
                              Check if completed or pursuing (Police Sub-Inspector, CDS, AFCAT & CAPF AC)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={formData.hasGraduation ? 'army' : 'outline'} size="sm">
                        {formData.hasGraduation ? 'Enabled' : 'Optional'}
                      </Badge>
                    </label>

                    {formData.hasGraduation && (
                      <div className="space-y-3 pt-3 mt-3 border-t border-[#273623] animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Board / University / Institute *
                            </label>
                            <input
                              type="text"
                              name="gradUniversity"
                              value={formData.gradUniversity}
                              onChange={handleChange}
                              placeholder="e.g. Sidho Kanho Birsha University (SKBU Purulia)"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Graduation Stream / Degree *
                            </label>
                            <select
                              name="gradStream"
                              value={formData.gradStream}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                            >
                              <option value="B.Sc (Bachelor of Science)">B.Sc (Bachelor of Science)</option>
                              <option value="B.A (Bachelor of Arts)">B.A (Bachelor of Arts)</option>
                              <option value="B.Com (Bachelor of Commerce)">B.Com (Bachelor of Commerce)</option>
                              <option value="B.Tech / B.E (Engineering)">B.Tech / B.E (Engineering)</option>
                              <option value="BCA (Computer Applications)">BCA (Computer Applications)</option>
                              <option value="BBA / BMS">BBA / BMS (Management)</option>
                              <option value="Other Bachelor Degree">Other Bachelor Degree</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Specialization / Honours Major *
                            </label>
                            <input
                              type="text"
                              name="gradSpecialization"
                              value={formData.gradSpecialization}
                              onChange={handleChange}
                              placeholder="e.g. Physics Honours / Mathematics / History"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Graduation Roll / Reg No
                            </label>
                            <input
                              type="text"
                              name="gradRollNumber"
                              value={formData.gradRollNumber}
                              onChange={handleChange}
                              placeholder="e.g. SKBU/UG/2021/045"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Graduation Passing Year
                            </label>
                            <input
                              type="number"
                              name="gradPassingYear"
                              min="2014"
                              max="2026"
                              value={formData.gradPassingYear}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Marks Obtained, Full Marks & Automatic Percentage Calculation */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-mono text-emerald-400 uppercase font-bold mb-1">
                              Graduation Marks Obtained
                            </label>
                            <input
                              type="number"
                              name="gradMarksObtained"
                              min="0"
                              value={formData.gradMarksObtained}
                              onChange={handleChange}
                              placeholder="e.g. 1380"
                              className="w-full bg-[#0B0F0A] border border-emerald-500/50 rounded-lg px-3 py-2 text-white text-sm font-bold font-mono focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Graduation Full / Total Marks
                            </label>
                            <input
                              type="number"
                              name="gradFullMarks"
                              min="100"
                              value={formData.gradFullMarks}
                              onChange={handleChange}
                              placeholder="e.g. 1800"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-sm font-mono"
                            />
                          </div>

                          <div className="bg-[#0B0F0A] border border-emerald-500/40 rounded-lg p-2.5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-400 uppercase">
                                Graduation Calculated % (Auto)
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-0.5">
                                <Calculator className="w-3 h-3" /> Auto
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between gap-1 mt-1">
                              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                                {formData.gradPercentage ? `${formData.gradPercentage}%` : '0.00%'}
                              </span>
                              {renderDivisionBadge(formData.gradPercentage)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* -------------------------------------------------------------
                      4. POST GRADUATION / MASTER'S DEGREE (GAZETTED & SPECIALIST ENTRY)
                      ------------------------------------------------------------- */}
                  <div className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    formData.hasPostGraduation
                      ? 'bg-[#121811] border-purple-500/50 shadow-md'
                      : 'bg-[#121811]/60 border-[#273623]'
                  }`}>
                    <label className="flex items-center justify-between cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="hasPostGraduation"
                          checked={formData.hasPostGraduation}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-[#273623] text-purple-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold font-mono text-white uppercase block">
                              Post Graduation / Master's Degree
                            </span>
                            <span className="text-[10px] text-gray-400 font-sans">
                              Check if completed or pursuing (Army Education Corps, Higher Gazetted & Specialist Wings)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={formData.hasPostGraduation ? 'saffron' : 'outline'} size="sm">
                        {formData.hasPostGraduation ? 'Enabled' : 'Optional'}
                      </Badge>
                    </label>

                    {formData.hasPostGraduation && (
                      <div className="space-y-3 pt-3 mt-3 border-t border-[#273623] animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Board / University / Institute *
                            </label>
                            <input
                              type="text"
                              name="pgUniversity"
                              value={formData.pgUniversity}
                              onChange={handleChange}
                              placeholder="e.g. Sidho Kanho Birsha University (SKBU Purulia)"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Post Graduation Stream / Degree *
                            </label>
                            <select
                              name="pgStream"
                              value={formData.pgStream}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                            >
                              <option value="M.Sc (Master of Science)">M.Sc (Master of Science)</option>
                              <option value="M.A (Master of Arts)">M.A (Master of Arts)</option>
                              <option value="M.Com (Master of Commerce)">M.Com (Master of Commerce)</option>
                              <option value="M.Tech / M.E">M.Tech / M.E</option>
                              <option value="MBA / PGDM">MBA / PGDM</option>
                              <option value="MCA (Computer Applications)">MCA (Computer Applications)</option>
                              <option value="Other Master Degree">Other Master Degree</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Specialization / Discipline *
                            </label>
                            <input
                              type="text"
                              name="pgSpecialization"
                              value={formData.pgSpecialization}
                              onChange={handleChange}
                              placeholder="e.g. Applied Physics / Mathematics / English"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-purple-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Post Graduation Roll / Reg No
                            </label>
                            <input
                              type="text"
                              name="pgRollNumber"
                              value={formData.pgRollNumber}
                              onChange={handleChange}
                              placeholder="e.g. SKBU/PG/2024/018"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              Post Graduation Passing Year
                            </label>
                            <input
                              type="number"
                              name="pgPassingYear"
                              min="2016"
                              max="2026"
                              value={formData.pgPassingYear}
                              onChange={handleChange}
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs font-mono"
                            />
                          </div>
                        </div>

                        {/* Marks Obtained, Full Marks & Automatic Percentage Calculation */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-mono text-purple-400 uppercase font-bold mb-1">
                              PG Marks Obtained
                            </label>
                            <input
                              type="number"
                              name="pgMarksObtained"
                              min="0"
                              value={formData.pgMarksObtained}
                              onChange={handleChange}
                              placeholder="e.g. 920"
                              className="w-full bg-[#0B0F0A] border border-purple-500/50 rounded-lg px-3 py-2 text-white text-sm font-bold font-mono focus:outline-none focus:border-purple-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                              PG Full / Total Marks
                            </label>
                            <input
                              type="number"
                              name="pgFullMarks"
                              min="100"
                              value={formData.pgFullMarks}
                              onChange={handleChange}
                              placeholder="e.g. 1200"
                              className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-sm font-mono"
                            />
                          </div>

                          <div className="bg-[#0B0F0A] border border-purple-500/40 rounded-lg p-2.5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-gray-400 uppercase">
                                PG Calculated % (Auto)
                              </span>
                              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase flex items-center gap-0.5">
                                <Calculator className="w-3 h-3" /> Auto
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between gap-1 mt-1">
                              <span className="text-base sm:text-lg font-bold font-mono text-purple-400">
                                {formData.pgPercentage ? `${formData.pgPercentage}%` : '0.00%'}
                              </span>
                              {renderDivisionBadge(formData.pgPercentage)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NCC and Sports Special Quota */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="bg-[#121811] p-3.5 rounded-xl border border-[#273623] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          National Cadet Corps (NCC) Certificate
                        </label>
                      </div>
                      <select
                        name="nccCertificate"
                        value={formData.nccCertificate}
                        onChange={handleChange}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="None">None (No NCC Training)</option>
                        <option value="NCC 'A' Certificate">NCC 'A' Certificate (5 Bonus Marks)</option>
                        <option value="NCC 'B' Certificate">NCC 'B' Certificate (10 Bonus Marks)</option>
                        <option value="NCC 'C' Certificate">NCC 'C' Certificate (Exam Exemption / Maximum Bonus)</option>
                        <option value="NCC 'C' with Republic Day Camp (RDC)">NCC 'C' with Republic Day Parade (RDC)</option>
                      </select>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Valid NCC certificate holder details are directly synchronized for rally merit priority.
                      </p>
                    </div>

                    <div className="bg-[#121811] p-3.5 rounded-xl border border-[#273623] space-y-2">
                      <label className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Sports Representation Level
                      </label>
                      <select
                        name="sportsLevel"
                        value={formData.sportsLevel}
                        onChange={handleChange}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="None">No Recognized Sports Certificate</option>
                        <option value="District Level Sports">District Level Representation (1st/2nd position)</option>
                        <option value="State Level Sports">State Level Championship</option>
                        <option value="National / All India Inter-University">National / All India Inter-University Level</option>
                      </select>
                      <input
                        type="text"
                        name="sportsDiscipline"
                        value={formData.sportsDiscipline}
                        onChange={handleChange}
                        placeholder="Sport discipline (e.g. Athletics 400m, Football, Kabaddi)"
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PHYSICAL STANDARDS (PST) & BASELINE TELEMETRY */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#121811] p-3 rounded-xl border border-[#273623] text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase">Section 3: Physical Standard Test (PST) & Stopwatch Telemetry</span>
                    <span className="text-gray-400">Accurate Tape & Scale Measurements</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Target Defence / Police Wing *
                    </label>
                    <select
                      name="targetForce"
                      value={formData.targetForce}
                      onChange={handleChange}
                      className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="Indian Army Agniveer GD">Indian Army Agniveer General Duty (1600m in ≤5m 30s • 10 Pull-ups)</option>
                      <option value="Indian Army Technical / Clerk">Indian Army Agniveer Technical / Clerk</option>
                      <option value="West Bengal Police Constable">West Bengal Police Constable (1600m in 6m 30s)</option>
                      <option value="West Bengal Police SI Cadre">West Bengal Police Sub-Inspector (800m in 3m 00s)</option>
                      <option value="Kolkata Police Force">Kolkata Police Constable & SI</option>
                      <option value="Railway Protection Force (RPF/RPSF)">Railway Protection Force (RPF/RPSF Constable & SI)</option>
                      <option value="SSC GD Paramilitary (CAPF)">SSC GD Paramilitary (BSF, CRPF, CISF, SSB, ITBP 5.0 km)</option>
                      <option value="Indian Navy / Air Force (Agniveer)">Indian Navy (SSR/MR) / Indian Air Force (Vayu)</option>
                    </select>
                  </div>

                  {/* PST Measurements Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#121811] p-3 rounded-xl border border-[#273623]">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Height (cm) *</label>
                      <input
                        type="number"
                        name="heightCm"
                        required
                        min="145"
                        max="210"
                        value={formData.heightCm}
                        onChange={handleChange}
                        placeholder="e.g. 170"
                        className="w-full bg-transparent text-white font-display text-lg font-bold outline-none"
                      />
                      <span className="text-[10px] text-gray-500 font-mono">Army GD: Min 169 cm</span>
                    </div>

                    <div className="bg-[#121811] p-3 rounded-xl border border-[#273623]">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Weight (kg) *</label>
                      <input
                        type="number"
                        name="weightKg"
                        required
                        min="40"
                        max="120"
                        value={formData.weightKg}
                        onChange={handleChange}
                        placeholder="e.g. 64"
                        className="w-full bg-transparent text-white font-display text-lg font-bold outline-none"
                      />
                      <span className="text-[10px] text-gray-500 font-mono">Proportional to height</span>
                    </div>

                    <div className="bg-[#121811] p-3 rounded-xl border border-[#273623]">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Chest Normal (cm) *</label>
                      <input
                        type="number"
                        name="chestNormalCm"
                        required
                        min="65"
                        max="120"
                        value={formData.chestNormalCm}
                        onChange={handleChange}
                        placeholder="e.g. 78"
                        className="w-full bg-transparent text-white font-display text-lg font-bold outline-none"
                      />
                      <span className="text-[10px] text-gray-500 font-mono">Min 77 cm</span>
                    </div>

                    <div className="bg-[#121811] p-3 rounded-xl border border-[#273623]">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Chest Expanded (cm) *</label>
                      <input
                        type="number"
                        name="chestExpandedCm"
                        required
                        min="70"
                        max="130"
                        value={formData.chestExpandedCm}
                        onChange={handleChange}
                        placeholder="e.g. 84"
                        className="w-full bg-transparent text-white font-display text-lg font-bold outline-none"
                      />
                      <span className={`text-[10px] font-mono font-bold ${chestExpansion >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Expansion: {chestExpansion >= 0 ? `+${chestExpansion} cm` : '0 cm'} (Min 5cm)
                      </span>
                    </div>
                  </div>

                  {/* Stopwatch Telemetry Baselines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Current Best 1600m Running Time (Minutes:Seconds)
                      </label>
                      <input
                        type="text"
                        name="current1600mTime"
                        value={formData.current1600mTime}
                        onChange={handleChange}
                        placeholder="e.g. 06m 15s (or 'Not tested yet')"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Current Beam Pull-ups Repetitions (Dead-Hang)
                      </label>
                      <input
                        type="number"
                        name="currentBeamPullups"
                        min="0"
                        max="30"
                        value={formData.currentBeamPullups}
                        onChange={handleChange}
                        placeholder="e.g. 6 reps (Army target is 10)"
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2.5 text-white text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Medical Vision & Tattoo Disqualification Checks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Visual Acuity / Spectacles
                      </label>
                      <select
                        name="visionStatus"
                        value={formData.visionStatus}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="Normal 6/6 (No Spectacles)">Normal 6/6 Vision (No Spectacles)</option>
                        <option value="Wears Spectacles / Power Glasses">Wears Spectacles / Corrective Glasses</option>
                        <option value="History of Eye Laser Surgery">History of LASIK / Eye Surgery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                        Permanent Body Tattoo Policy
                      </label>
                      <select
                        name="bodyTattoo"
                        value={formData.bodyTattoo}
                        onChange={handleChange}
                        className="w-full bg-[#121811] border border-[#273623] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="No Permanent Tattoos">No Permanent Tattoos on Body</option>
                        <option value="Tattoo on Inner Forearm Only">Tattoo Only on Inner Face of Forearm (Permitted)</option>
                        <option value="Tribal Cultural Tattoo">Tribal Religious / Cultural Tattoo</option>
                        <option value="Tattoo on Hands/Neck/Chest">Tattoo on Hands / Neck / Chest (Army Review Required)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Specify Tattoo Details (Location, Dimension & Design)
                    </label>
                    <input
                      type="text"
                      name="tattooDetails"
                      value={formData.tattooDetails}
                      onChange={handleChange}
                      placeholder="e.g. Small religious Om symbol on inner forearm, 2cm x 2cm / NIL if no tattoos"
                      className="w-full bg-[#121811] border border-[#273623] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm font-sans"
                    />
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                      Indian Army Policy: Permanent body tattoos are permitted only on inner face of forearms or for tribal communities.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: DISCIPLINARY, PAST RECORDS & STAND-TO OATH */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-[#121811] p-3 rounded-xl border border-[#273623] text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase">Section 4: Legal Records, Character & Military Oath</span>
                    <span className="text-gray-400 text-[11px]">Strict NIL-Criminal Antecedents Mandate</span>
                  </div>

                  {/* Criminal Case / FIR Declaration */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#121811] border border-[#273623] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          <span>Criminal Cases & Police FIR Declaration *</span>
                        </h5>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Has any FIR, police investigation, or criminal prosecution ever been instituted against you in any Court of Law or Police Station?
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs pt-1 sm:pt-0">
                        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400">
                          <input
                            type="radio"
                            name="hasCriminalRecord"
                            value="NO"
                            checked={formData.hasCriminalRecord === 'NO'}
                            onChange={handleChange}
                          />
                          <span>NO (Clean Record)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
                          <input
                            type="radio"
                            name="hasCriminalRecord"
                            value="YES"
                            checked={formData.hasCriminalRecord === 'YES'}
                            onChange={handleChange}
                          />
                          <span>YES</span>
                        </label>
                      </div>
                    </div>

                    {formData.hasCriminalRecord === 'YES' && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-mono text-rose-400 uppercase mb-1">
                          Provide Complete Case Details (Case No, Thana, Charges, Status) *
                        </label>
                        <textarea
                          name="criminalRecordDetails"
                          rows={2}
                          value={formData.criminalRecordDetails}
                          onChange={handleChange}
                          placeholder="State FIR number, Police Station, nature of allegation, and present status..."
                          className="w-full bg-[#0B0F0A] border border-rose-500/50 rounded-lg p-2.5 text-white text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Past Rally Experience */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#121811] border border-[#273623] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>Past Defence / Police Rally Experience</span>
                        </h5>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Have you previously appeared in any Indian Army, Police, or Paramilitary physical rally or exam?
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs pt-1 sm:pt-0">
                        <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                          <input
                            type="radio"
                            name="hasAttendedPastRally"
                            value="NO"
                            checked={formData.hasAttendedPastRally === 'NO'}
                            onChange={handleChange}
                          />
                          <span>First Time Candidate</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                          <input
                            type="radio"
                            name="hasAttendedPastRally"
                            value="YES"
                            checked={formData.hasAttendedPastRally === 'YES'}
                            onChange={handleChange}
                          />
                          <span>Experienced Candidate</span>
                        </label>
                      </div>
                    </div>

                    {formData.hasAttendedPastRally === 'YES' && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-mono text-amber-400 uppercase mb-1">
                          Past Rally Ground, Year & Result
                        </label>
                        <input
                          type="text"
                          name="pastRallyDetails"
                          value={formData.pastRallyDetails}
                          onChange={handleChange}
                          placeholder="e.g. Army Rally Barrackpore 2024 (Failed in 1600m by 8 seconds) / WBP 2023 (PET Qualified)"
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg p-2 text-white text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Medical History & Fracture Declaration */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#121811] border border-[#273623] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-lime-400 flex-shrink-0" />
                          <span>Major Surgical / Fracture / Orthopedic History</span>
                        </h5>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Any past bone fractures, joint dislocations, knock-knees, flat foot, or abdominal surgeries?
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs pt-1 sm:pt-0">
                        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400">
                          <input
                            type="radio"
                            name="hasMedicalConditionOrSurgery"
                            value="NO"
                            checked={formData.hasMedicalConditionOrSurgery === 'NO'}
                            onChange={handleChange}
                          />
                          <span>NIL / Fully Fit</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                          <input
                            type="radio"
                            name="hasMedicalConditionOrSurgery"
                            value="YES"
                            checked={formData.hasMedicalConditionOrSurgery === 'YES'}
                            onChange={handleChange}
                          />
                          <span>Have Past Injury</span>
                        </label>
                      </div>
                    </div>

                    {formData.hasMedicalConditionOrSurgery === 'YES' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          name="medicalHistoryDetails"
                          value={formData.medicalHistoryDetails}
                          onChange={handleChange}
                          placeholder="Specify injury type, bone affected, or past surgery year..."
                          className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg p-2 text-white text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Physical or Mental Issues Declaration Textbox */}
                  <div className="p-4 rounded-xl bg-[#121811] border border-[#273623] space-y-2">
                    <label className="block text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Specify Physical or Mental Issues (If Any) *
                    </label>
                    <textarea
                      name="physicalMentalIssues"
                      rows={2}
                      value={formData.physicalMentalIssues}
                      onChange={handleChange}
                      placeholder="Specify any physical limitations, recurring pain, asthma/respiratory issues, fainting history, chronic medical conditions, or mental/psychological health history (Enter 'NIL / Fully Fit' if none)..."
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg p-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-xs font-mono"
                    />
                    <span className="text-[10px] text-gray-500 font-mono block">
                      Strictly confidential medical telemetry for drill safety and individualized coaching adjustment.
                    </span>
                  </div>

                  {/* Stand-To Oath & Anti-Substance Abuse Declarations */}
                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161F15] border border-amber-500/40 cursor-pointer">
                      <input
                        type="checkbox"
                        name="standToOathConsent"
                        required
                        checked={formData.standToOathConsent}
                        onChange={handleChange}
                        className="mt-1 rounded border-[#273623] text-amber-500 focus:ring-0"
                      />
                      <span className="text-xs text-gray-200 leading-relaxed font-sans">
                        <strong className="text-amber-400 block uppercase font-mono font-bold">
                          The Regimental Stand-To Discipline Oath:
                        </strong>
                        I solemnly swear on my personal honour that I will maintain uncompromising military discipline at the J.K. College Ground. I pledge to report punctually for First Light Stand-To at 05:00am hrs IST, obey all drill commands of Chief Drill Instructor Havaldar Anup Kumar Mahato and assigned Ustads, and adhere strictly to the 3-unexcused-absence dismissal rule.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161F15] border border-emerald-500/40 cursor-pointer">
                      <input
                        type="checkbox"
                        name="noSubstanceAbuseConsent"
                        required
                        checked={formData.noSubstanceAbuseConsent}
                        onChange={handleChange}
                        className="mt-1 rounded border-[#273623] text-emerald-500 focus:ring-0"
                      />
                      <span className="text-xs text-gray-200 leading-relaxed font-sans">
                        <strong className="text-emerald-400 block uppercase font-mono font-bold">
                          Zero Tolerance Anti-Doping & Substance Declaration:
                        </strong>
                        I certify that I do not consume drugs, performance-enhancing substances, or narcotics. I acknowledge that Purulia Aim Physical Institute operates with zero fees and provides authentic natural conditioning (sattu, chana, cadence training). Any false declaration will result in immediate discharge from the institute and referral to recruitment authorities.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-[#273623] mt-4 sm:mt-6">
                {step > 1 ? (
                  <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} className="w-full sm:w-auto justify-center">
                    ← Previous Section
                  </Button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                <Button
                  variant="saffron"
                  size="md"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : undefined}
                  className="w-full sm:w-auto justify-center font-bold"
                >
                  {isSubmitting
                    ? 'Recording into Muster...'
                    : step === 4
                      ? 'Submit Cadet Enlistment (₹0)'
                      : 'Save & Proceed →'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

