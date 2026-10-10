'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Shield,
  Timer,
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Bell,
  ArrowLeft,
  TrendingDown,
  User,
  Send,
  FileCheck,
  FileText,
  Printer,
  Radio,
  Camera,
  Upload,
  Trash2,
  GraduationCap,
  BookOpen,
  Calculator,
  Percent,
  Edit3,
  Save,
  LogOut,
  Megaphone,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Button, Badge, Card, StatMetricCard } from '@/components/ui';
import { ParadeDrillStopwatch } from '@/components';
import { DEFAULT_CADET_REPORT } from '@/components/ProgressReportPDFView';
import { fetchLiveDrillSession, LiveDrillSession, logoutUser } from '@/lib/api';

// Performance Optimization: Dynamic imports with React Suspense & Skeletons (LCP < 2.5s)
const DynamicStudentProgressVisualizer = dynamic(
  () =>
    import('@/components/StudentProgressVisualizer').then(
      mod => mod.StudentProgressVisualizer
    ),
  {
    ssr: false,
    loading: () => <TelemetryChartSkeleton />
  }
);

const DynamicProgressReportPDFView = dynamic(
  () =>
    import('@/components/ProgressReportPDFView').then(
      mod => mod.ProgressReportPDFView
    ),
  {
    ssr: false,
    loading: () => <ReportDossierSkeleton />
  }
);

// High-tech Skeleton Loader for Telemetry Chart
function TelemetryChartSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-[#1A2415] rounded-lg" />
      <div className="h-4 w-1/2 bg-[#161F15] rounded-md" />
      <div className="h-72 w-full bg-[#0E140C] rounded-2xl border border-[#1A2415] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <Activity className="w-4 h-4 text-amber-500 animate-spin" />
          <span>Calibrating Cadet Telemetry Matrix...</span>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader for Evaluation Dossier Sheet
function ReportDossierSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#121811] border border-[#273623] space-y-6 animate-pulse">
      <div className="h-10 w-2/3 mx-auto bg-[#1A2415] rounded-xl" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#161F15] rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-[#0E140C] rounded-2xl border border-[#1A2415]" />
    </div>
  );
}

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<
    'STOPWATCH' | 'EVENTS' | 'TELEMETRY' | 'ACADEMIC' | 'REPORT' | 'ATTENDANCE' | 'SCHEDULE' | 'STORY'
  >('STOPWATCH');
  const [liveDrill, setLiveDrill] = useState<LiveDrillSession | null>(null);
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [storyText, setStoryText] = useState('');

  // Motivational Quote & Trainer Announcements State
  const [dailyQuote, setDailyQuote] = useState<string>(
    'पसीने की स्याही से जो लिखते हैं अपने इरादों को, उनके मुक़द्दर के पन्ने कभी कोरे नहीं हुआ करते! 1600 meters is not a test of your legs, it is a test of your heart and hunger for the Uniform!'
  );
  const [quoteAuthor, setQuoteAuthor] = useState<string>('Havaldar Anup Kumar Mahato (Head Drill Ustad)');
  const [trainerEvents, setTrainerEvents] = useState<any[]>([]);
  const [recruitmentOrders, setRecruitmentOrders] = useState<any[]>([]);

  // Cadet Profile & Passport Photo State
  const [cadetPhoto, setCadetPhoto] = useState<string | null>(null);
  const [cadetName, setCadetName] = useState<string>('');
  const [cadetRoll, setCadetRoll] = useState<string>('');
  const [targetForce, setTargetForce] = useState<string>('Indian Army GD');
  const [bloodGroup, setBloodGroup] = useState<string>('—');
  const [birthMarks, setBirthMarks] = useState<string>('—');
  const [cadetHeight, setCadetHeight] = useState<number>(0);
  const [cadetWeight, setCadetWeight] = useState<number>(0);
  const [cadetChestNormal, setCadetChestNormal] = useState<number>(0);
  const [cadetChestExpanded, setCadetChestExpanded] = useState<number>(0);
  const [attendancePercent, setAttendancePercent] = useState<number>(0);
  const [attendanceStreak, setAttendanceStreak] = useState<string>('New Recruit');
  const [best1600m, setBest1600m] = useState<string>('Not Tested');
  const [isNewRecruit, setIsNewRecruit] = useState<boolean>(true);
  const [photoUploadMsg, setPhotoUploadMsg] = useState<string | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  // Synchronize Cadet Profile dynamically from Registration (localStorage & Backend API)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawProfile = localStorage.getItem('cadet_full_profile');
      const savedName = localStorage.getItem('cadet_name');
      const savedRoll = localStorage.getItem('cadet_dossier_id');
      const savedTarget = localStorage.getItem('cadet_target_force');
      const savedBlood = localStorage.getItem('cadet_blood_group');
      const savedBirthMarks = localStorage.getItem('cadet_birth_marks');
      const savedPhoto = localStorage.getItem('cadet_passport_photo');
      const savedHeight = localStorage.getItem('cadet_height');
      const savedWeight = localStorage.getItem('cadet_weight');
      const savedChestNormal = localStorage.getItem('cadet_chest_normal');
      const savedChestExpanded = localStorage.getItem('cadet_chest_expanded');
      const savedQuals = localStorage.getItem('cadet_qualifications');

      if (savedName) setCadetName(savedName);
      if (savedRoll) setCadetRoll(savedRoll);
      if (savedTarget) setTargetForce(savedTarget);
      if (savedBlood) setBloodGroup(savedBlood);
      if (savedBirthMarks) setBirthMarks(savedBirthMarks);
      if (savedPhoto) setCadetPhoto(savedPhoto);

      if (savedHeight && !isNaN(Number(savedHeight)) && Number(savedHeight) > 0) {
        setCadetHeight(Number(savedHeight));
      }
      if (savedWeight && !isNaN(Number(savedWeight)) && Number(savedWeight) > 0) {
        setCadetWeight(Number(savedWeight));
      }
      if (savedChestNormal && !isNaN(Number(savedChestNormal)) && Number(savedChestNormal) > 0) {
        setCadetChestNormal(Number(savedChestNormal));
      }
      if (savedChestExpanded && !isNaN(Number(savedChestExpanded)) && Number(savedChestExpanded) > 0) {
        setCadetChestExpanded(Number(savedChestExpanded));
      }

      if (rawProfile) {
        try {
          const parsed = JSON.parse(rawProfile);
          if (parsed.fullName) setCadetName(parsed.fullName);
          if (parsed.dossierNumber) setCadetRoll(parsed.dossierNumber);
          if (parsed.targetForce) setTargetForce(parsed.targetForce);
          if (parsed.bloodGroup) setBloodGroup(parsed.bloodGroup);
          if (parsed.birthMarks) setBirthMarks(parsed.birthMarks);
          if (parsed.passportPhoto) setCadetPhoto(parsed.passportPhoto);
          if (parsed.heightCm && !isNaN(Number(parsed.heightCm))) setCadetHeight(Number(parsed.heightCm));
          if (parsed.weightKg && !isNaN(Number(parsed.weightKg))) setCadetWeight(Number(parsed.weightKg));
          if (parsed.chestNormalCm && !isNaN(Number(parsed.chestNormalCm))) setCadetChestNormal(Number(parsed.chestNormalCm));
          if (parsed.chestExpandedCm && !isNaN(Number(parsed.chestExpandedCm))) setCadetChestExpanded(Number(parsed.chestExpandedCm));
          if (parsed.current1600mTime) setBest1600m(parsed.current1600mTime);
        } catch (e) {}
      }

      if (savedQuals) {
        try {
          const parsedQ = JSON.parse(savedQuals);
          setQualifications({
            tenth: parsedQ.tenth || { board: '', stream: 'General', specialization: '', passingYear: '', rollNumber: '', marksObtained: '', fullMarks: '', percentage: '' },
            twelfth: parsedQ.twelfth || { board: '', stream: '', specialization: '', passingYear: '', rollNumber: '', marksObtained: '', fullMarks: '', percentage: '' },
            graduation: parsedQ.graduation || { board: '', stream: '', specialization: '', passingYear: '', rollNumber: '', marksObtained: '', fullMarks: '', percentage: '' },
            postGraduation: parsedQ.postGraduation || { board: '', stream: '', specialization: '', passingYear: '', rollNumber: '', marksObtained: '', fullMarks: '', percentage: '' }
          });
        } catch (e) {}
      }

      const dossierToFetch = savedRoll || (rawProfile ? JSON.parse(rawProfile).dossierNumber : null);
      if (dossierToFetch) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        fetch(`${apiUrl}/admissions/${dossierToFetch}`)
          .then(res => res.ok ? res.json() : null)
          .then(cadet => {
            if (cadet) {
              if (cadet.fullName) setCadetName(cadet.fullName);
              if (cadet.dossierNumber) setCadetRoll(cadet.dossierNumber);
              if (cadet.targetForce) setTargetForce(cadet.targetForce);
              if (cadet.bloodGroup) setBloodGroup(cadet.bloodGroup);
              if (cadet.birthMarks) setBirthMarks(cadet.birthMarks);
              if (cadet.passportPhoto) setCadetPhoto(cadet.passportPhoto);
              if (cadet.heightCm) setCadetHeight(Number(cadet.heightCm));
              if (cadet.weightKg) setCadetWeight(Number(cadet.weightKg));
              if (cadet.chestNormalCm) setCadetChestNormal(Number(cadet.chestNormalCm));
              if (cadet.chestExpandedCm) setCadetChestExpanded(Number(cadet.chestExpandedCm));
              if (cadet.current1600mTime) setBest1600m(cadet.current1600mTime);

              // Update qualifications from authentic backend record if present
              const backendQuals: any = {};
              if (cadet.tenthBoard || cadet.matricBoard) {
                backendQuals.tenth = {
                  board: cadet.tenthBoard || cadet.matricBoard || '',
                  stream: cadet.tenthStream || 'General',
                  specialization: cadet.tenthSpecialization || '',
                  passingYear: cadet.tenthPassingYear || cadet.matricPassingYear || '',
                  rollNumber: cadet.tenthRollNumber || cadet.matricRollNumber || '',
                  marksObtained: cadet.tenthMarksObtained || '',
                  fullMarks: cadet.tenthFullMarks || '',
                  percentage: cadet.tenthPercentage || cadet.matricAggregatePercent || ''
                };
              }
              if (cadet.hasTwelfth || cadet.twelfthBoard) {
                backendQuals.twelfth = {
                  board: cadet.twelfthBoard || '',
                  stream: cadet.twelfthStream || '',
                  specialization: cadet.twelfthSpecialization || '',
                  passingYear: cadet.twelfthPassingYear || '',
                  rollNumber: cadet.twelfthRollNumber || '',
                  marksObtained: cadet.twelfthMarksObtained || '',
                  fullMarks: cadet.twelfthFullMarks || '',
                  percentage: cadet.twelfthPercentage || ''
                };
              }
              if (cadet.hasGraduation || cadet.gradUniversity) {
                backendQuals.graduation = {
                  board: cadet.gradUniversity || '',
                  stream: cadet.gradStream || '',
                  specialization: cadet.gradSpecialization || '',
                  passingYear: cadet.gradPassingYear || '',
                  rollNumber: cadet.gradRollNumber || '',
                  marksObtained: cadet.gradMarksObtained || '',
                  fullMarks: cadet.gradFullMarks || '',
                  percentage: cadet.gradPercentage || ''
                };
              }
              if (cadet.hasPostGraduation || cadet.pgUniversity) {
                backendQuals.postGraduation = {
                  board: cadet.pgUniversity || '',
                  stream: cadet.pgStream || '',
                  specialization: cadet.pgSpecialization || '',
                  passingYear: cadet.pgPassingYear || '',
                  rollNumber: cadet.pgRollNumber || '',
                  marksObtained: cadet.pgMarksObtained || '',
                  fullMarks: cadet.pgFullMarks || '',
                  percentage: cadet.pgPercentage || ''
                };
              }
              if (Object.keys(backendQuals).length > 0) {
                setQualifications((prev: any) => ({ ...prev, ...backendQuals }));
              }
            }
          })
          .catch(() => {});
      }

      // Load Ustad's Daily War Cry Quote
      const storedQuote = localStorage.getItem('aim_daily_motivational_quote');
      const storedAuthor = localStorage.getItem('aim_daily_quote_author');
      if (storedQuote) setDailyQuote(storedQuote);
      if (storedAuthor) setQuoteAuthor(storedAuthor);

      // Load Trainer's Uploaded Events & Orders
      const storedEvents = localStorage.getItem('aim_trainer_events');
      if (storedEvents) {
        try { setTrainerEvents(JSON.parse(storedEvents)); } catch {}
      } else {
        setTrainerEvents([]);
      }

      const storedOrders = localStorage.getItem('aim_trainer_orders');
      if (storedOrders) {
        try { setRecruitmentOrders(JSON.parse(storedOrders)); } catch {}
      }
    } catch (err) {
      console.warn('Could not load cadet profile from local storage:', err);
    }
  }, []);

  // Previous Qualifications Records (10th, 12th, Graduation, Post-Graduation)
  const [qualifications, setQualifications] = useState<any>({
    tenth: {
      board: '',
      stream: 'General',
      specialization: '',
      passingYear: '',
      rollNumber: '',
      marksObtained: '',
      fullMarks: '',
      percentage: ''
    },
    twelfth: {
      board: '',
      stream: '',
      specialization: '',
      passingYear: '',
      rollNumber: '',
      marksObtained: '',
      fullMarks: '',
      percentage: ''
    },
    graduation: {
      board: '',
      stream: '',
      specialization: '',
      passingYear: '',
      rollNumber: '',
      marksObtained: '',
      fullMarks: '',
      percentage: ''
    },
    postGraduation: {
      board: '',
      stream: '',
      specialization: '',
      passingYear: '',
      rollNumber: '',
      marksObtained: '',
      fullMarks: '',
      percentage: ''
    }
  });

  const [activeQualLevel, setActiveQualLevel] = useState<'ALL' | 'tenth' | 'twelfth' | 'graduation' | 'postGraduation'>('ALL');
  const [qualSaveSuccess, setQualSaveSuccess] = useState(false);

  const handleUpdateMarks = (
    level: 'tenth' | 'twelfth' | 'graduation' | 'postGraduation',
    field: string,
    value: string
  ) => {
    setQualifications((prev: any) => {
      const current = { ...(prev[level] || {}) };
      current[field] = value;
      const obt = Number(field === 'marksObtained' ? value : current.marksObtained);
      const total = Number(field === 'fullMarks' ? value : current.fullMarks);
      if (total > 0 && !isNaN(obt) && obt >= 0) {
        current.percentage = ((obt / total) * 100).toFixed(2);
      }
      const updated = { ...prev, [level]: current };
      try {
        localStorage.setItem('cadet_qualifications', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
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
          ✓ 2nd Div (Army GD Qualifying)
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold">
        ⚠ Pass Div (&lt;45%)
      </span>
    );
  };

  useEffect(() => {
    let active = true;
    const checkDrill = async () => {
      try {
        const session = await fetchLiveDrillSession();
        if (active) setLiveDrill(session);
      } catch (e) {
        // silent fallback
      }
    };
    checkDrill();
    const interval = setInterval(checkDrill, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleDirectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_PHOTO_BYTES = 100 * 1024; // Strictly 100 KB
    if (file.size >= MAX_PHOTO_BYTES) {
      const sizeInKb = (file.size / 1024).toFixed(1);
      setPhotoUploadMsg(`Photo is ${sizeInKb} KB. Photos must strictly be lower than 100 KB.`);
      setTimeout(() => setPhotoUploadMsg(null), 4000);
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoUploadMsg('Please upload a valid image file (JPG/PNG/WEBP).');
      setTimeout(() => setPhotoUploadMsg(null), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCadetPhoto(base64);
      try {
        localStorage.setItem('cadet_passport_photo', base64);
        const sizeInKb = (file.size / 1024).toFixed(1);
        setPhotoUploadMsg(`✓ Passport photo updated (${sizeInKb} KB < 100 KB)!`);
        setTimeout(() => setPhotoUploadMsg(null), 3500);
      } catch (err) {
        console.warn('Failed to persist photo to localStorage:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const cadetInitials =
    cadetName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SM';

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      {/* Top Portal Tactical Bar */}
      <header className="no-print border-b border-[#273623] bg-[#0E140C] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-amber-400 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-[#273623] hidden xs:block" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-black text-amber-400 text-base sm:text-lg uppercase tracking-wider flex-shrink-0">
                AIM
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">
                Cadet Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setActiveTab('REPORT')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161F15] hover:bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono bg-[#161F15] px-2.5 py-1 sm:py-1.5 rounded-lg border border-[#273623]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-emerald-400 font-bold">Good Standing</span>
            </div>

            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-[#273623]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden relative shadow-sm">
                {cadetPhoto ? (
                  <img
                    src={cadetPhoto}
                    alt={cadetName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  cadetInitials
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-display font-bold text-white uppercase truncate max-w-[130px]">
                  {cadetName}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Roll: {cadetRoll}
                </div>
              </div>
            </div>

            <button
              onClick={() => logoutUser()}
              title="Sign Out of Cadet Dossier"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-red-200 text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Cadet Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full space-y-5 sm:space-y-7">
        {/* ===================================================================
            USTAD'S DAILY WAR CRY • BATTLEFIELD INSPIRATION QUOTE FIELD
            =================================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#241706] via-[#1B2211] to-[#0E140C] border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.3)] relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 relative z-10">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.6)]">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase bg-amber-500 text-black px-2 py-0.5 rounded font-black tracking-widest shadow-sm">
                  🔥 USTAD&apos;S DAILY WAR CRY
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-amber-400 font-bold">
                  Daily Ground Motivation & Rally Spirit
                </span>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-display font-black italic uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-snug drop-shadow-[0_2px_10px_rgba(245,158,11,0.45)]">
                &ldquo;{dailyQuote}&rdquo;
              </p>
              <div className="text-[11px] font-mono text-gray-400 mt-1 flex items-center gap-1.5">
                <span className="text-amber-500 font-bold">Commanded by:</span>
                <span className="text-white font-bold">{quoteAuthor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE DRILL ALERT BANNER */}
        {liveDrill && liveDrill.status !== 'IDLE' && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-[#1a150c] to-[#0E140C] border-2 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black flex-shrink-0">
                <Radio className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-amber-500 text-black px-2 py-0.5 rounded font-black tracking-wider">
                    {liveDrill.status === 'RUNNING' ? '🔴 LIVE DRILL RUNNING' : '⏸️ DRILL PAUSED'}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    {liveDrill.category} ({liveDrill.distanceMeters}m)
                  </span>
                </div>
                <p className="text-xs text-white mt-0.5 font-sans">
                  Trainer <strong>{liveDrill.trainerName}</strong> is broadcasting. Cadets are in synchronized read-only mode.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('STOPWATCH')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer text-center"
            >
              Open Synchronized Stopwatch →
            </button>
          </div>
        )}

        {/* Cadet Profile Banner */}
        <div className="no-print p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-[#273623] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
            {/* Passport Photo Frame (35mm x 45mm Indian Armed Forces ratio) */}
            <div className="relative group flex-shrink-0">
              <div
                onClick={() => photoInputRef.current?.click()}
                className="w-16 h-20 sm:w-20 sm:h-26 rounded-xl sm:rounded-2xl border-2 border-amber-500/80 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-display font-black text-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] overflow-hidden cursor-pointer relative"
                title="Click to upload / change passport photo (35mm × 45mm)"
              >
                {cadetPhoto ? (
                  <>
                    <img
                      src={cadetPhoto}
                      alt={cadetName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <Camera className="w-5 h-5 text-amber-400" />
                      <span className="text-[8px] font-mono text-white uppercase font-bold tracking-wider">
                        Update
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-1">
                    <span className="font-display font-black text-lg sm:text-xl text-black">
                      {cadetInitials}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-black/80 uppercase mt-0.5">
                      + Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Camera action badge on corner */}
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 p-1 sm:p-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black border-2 border-[#121811] shadow-md transition-transform hover:scale-110 cursor-pointer"
                title="Upload or Change Passport Photo"
              >
                <Camera className="w-3 h-3" />
              </button>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handleDirectPhotoUpload}
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-2xl lg:text-3xl text-white uppercase tracking-wider truncate">
                  {cadetName}
                </h1>
                <Badge variant="army" size="sm">
                  Active Cadet
                </Badge>
                {cadetPhoto && (
                  <Badge variant="saffron" size="sm" className="hidden sm:inline-flex bg-amber-500/20 text-amber-400 border-amber-500/40">
                    ✓ Photo Attested
                  </Badge>
                )}
              </div>
              <div className="text-[11px] sm:text-xs font-mono text-amber-400 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                <span>Batch: Agniveer Morning Alfa</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-300">Target: {targetForce}</span>
                <span className="text-gray-600">•</span>
                <span>Blood: <strong className="text-white font-bold">{bloodGroup}</strong></span>
                {birthMarks && (
                  <>
                    <span className="text-gray-600 hidden sm:inline">•</span>
                    <span className="text-gray-300 hidden sm:inline truncate max-w-[180px]" title={birthMarks}>
                      Mark: {birthMarks}
                    </span>
                  </>
                )}
                <span className="text-gray-600 hidden xs:inline">•</span>
                <span className="text-gray-400 hidden xs:inline">Roll: {cadetRoll}</span>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="text-[10px] font-mono text-gray-400 hover:text-amber-400 flex items-center gap-1 underline transition-colors cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  {cadetPhoto ? 'Update Passport Photo (35x45mm)' : 'Affix Passport Photo (35x45mm)'}
                </button>
                {photoUploadMsg && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {photoUploadMsg}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <div className="bg-[#0B0F0A] p-2.5 sm:p-3 rounded-xl border border-[#273623] text-center px-3 sm:px-5">
              <div className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-500">
                1600m PB
              </div>
              <div className="text-lg sm:text-xl font-display font-black text-amber-400">
                {best1600m}
              </div>
              <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono font-bold truncate">
                {isNewRecruit ? 'Baseline' : '-1m 51s PB'}
              </div>
            </div>

            <div className="bg-[#0B0F0A] p-2.5 sm:p-3 rounded-xl border border-[#273623] text-center px-3 sm:px-5">
              <div className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-500">
                Attendance
              </div>
              <div className="text-lg sm:text-xl font-display font-black text-emerald-400">
                {attendancePercent}%
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono truncate">
                {attendanceStreak}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('REPORT')}
              className="col-span-2 sm:col-span-1 bg-amber-500 hover:bg-amber-400 p-2.5 sm:p-3 rounded-xl text-black flex sm:flex-col items-center justify-center gap-1.5 sm:gap-0 px-4 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 sm:mb-0.5" />
              <span>Dossier</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="no-print flex items-center gap-1.5 sm:gap-2 border-b border-[#273623] pb-2 font-display uppercase tracking-wider text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x w-full">
          {[
            {
              id: 'STOPWATCH',
              label: liveDrill && liveDrill.status !== 'IDLE'
                ? '🔴 Live Parade Drill Timer'
                : '⏱️ Drill & Self-Training Stopwatch'
            },
            { id: 'EVENTS', label: '📢 Rallies & Drill Events' },
            { id: 'TELEMETRY', label: '1600m & Category Telemetry' },
            { id: 'ACADEMIC', label: '🎓 Qualifications (10th/12th/Grad/PG)' },
            { id: 'REPORT', label: 'Official Evaluation Sheet (PDF Export)' },
            { id: 'ATTENDANCE', label: 'Attendance Calendar & Defaulter Check' },
            { id: 'SCHEDULE', label: 'Daily Drill Regimen & Timetable' },
            { id: 'STORY', label: 'Submit Success Story' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all whitespace-nowrap border cursor-pointer flex-shrink-0 text-[11px] sm:text-xs ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===================================================================
            TAB 0: LIVE DRILL STOPWATCH & CADET SELF-TRAINING
            =================================================================== */}
        {activeTab === 'STOPWATCH' && (
          <ParadeDrillStopwatch
            mode="CADET_VIEWER"
            cadetName={cadetName ? `Cadet ${cadetName}` : 'Enlisted Cadet'}
            cadetRoll={cadetRoll}
          />
        )}

        {/* ===================================================================
            TAB: UPCOMING RALLIES & TRAINING EVENTS (UPLOADED BY TRAINERS)
            =================================================================== */}
        {activeTab === 'EVENTS' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 sm:p-6 rounded-3xl bg-[#121811] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                    Official Rallies & Drill Announcements
                  </h3>
                </div>
                <p className="text-xs text-gray-400 font-sans mt-1">
                  Active physical trial rallies, PET simulations, and recruitment notices uploaded live by AIM Drill Instructors.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-[#0E140C] px-3 py-1.5 rounded-xl border border-emerald-500/40">
                ✓ Live from Ustad Command
              </span>
            </div>

            {/* Event Cards */}
            <div className="space-y-4">
              <h4 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <span>Upcoming Physical Trials & PET Simulations ({trainerEvents.length})</span>
              </h4>

              {trainerEvents.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#161F15] border border-[#273623] text-center text-gray-500 font-mono text-xs">
                  No upcoming physical trial rallies or clinics posted yet. Official notifications uploaded by trainers will reflect here automatically.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainerEvents.map((evt: any) => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl bg-[#161F15] border border-[#273623] hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="army" size="sm">{evt.type}</Badge>
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                            {evt.reportingStatus || 'OPEN'}
                          </span>
                        </div>
                        <h4 className="font-display font-black text-base sm:text-lg text-white uppercase leading-snug">
                          {evt.title}
                        </h4>
                        <div className="text-xs font-mono text-gray-300 space-y-1 pt-1">
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{evt.date} • {evt.time}</span>
                          </div>
                          <div className="text-gray-400">📍 {evt.venue}</div>
                          <div className="text-gray-400">🎯 Target: <strong className="text-white">{evt.targetCadre}</strong></div>
                        </div>
                        {evt.guidelines && (
                          <p className="text-xs text-gray-400 bg-[#0E140C] p-2.5 rounded-xl border border-[#273623]">
                            {evt.guidelines}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Official Recruitment Orders & Notices */}
            {recruitmentOrders.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#273623]">
                <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                  Official Recruitment Circulars & Media Orders ({recruitmentOrders.length})
                </h4>
                <div className="space-y-2.5">
                  {recruitmentOrders.map((ord: any) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-[#161F15] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                            {ord.category?.replace('_', ' ') || 'NOTICE'}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">• {ord.authority}</span>
                        </div>
                        <div className="text-sm font-display font-bold text-white uppercase mt-1">
                          {ord.title}
                        </div>
                      </div>
                      <a
                        href={ord.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Document / Media</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 1: TELEMETRY & STUDENT PROGRESS VISUALIZER (MODULE 6)
            =================================================================== */}
        {activeTab === 'TELEMETRY' && (
          <Suspense fallback={<TelemetryChartSkeleton />}>
            <DynamicStudentProgressVisualizer
              cadetId={cadetRoll}
              studentName={cadetName ? `Cadet ${cadetName}` : 'Enlisted Cadet'}
              initialForce="ARMY_GD"
              onExportReport={() => setActiveTab('REPORT')}
            />
          </Suspense>
        )}

        {/* ===================================================================
            TAB: PREVIOUS EDUCATIONAL QUALIFICATIONS (10th, 12th, GRAD, PG)
            =================================================================== */}
        {activeTab === 'ACADEMIC' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Quick Action */}
            <div className="p-4 sm:p-6 rounded-3xl bg-[#121811] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                    Educational Qualifications & Academic Portfolio
                  </h3>
                </div>
                <p className="text-xs text-gray-400 font-sans mt-1">
                  Verified records of 10th Matriculation, 12th Higher Secondary, Graduation and Post-Graduation. Percentages automatically computed in real time.
                </p>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                {qualSaveSuccess && (
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Saved!
                  </span>
                )}
                <Button
                  variant="saffron"
                  size="sm"
                  onClick={() => {
                    try {
                      localStorage.setItem('cadet_qualifications', JSON.stringify(qualifications));
                      setQualSaveSuccess(true);
                      setTimeout(() => setQualSaveSuccess(false), 3000);
                    } catch (e) {
                      console.warn(e);
                    }
                  }}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Academic Dossier
                </Button>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
              <div className="p-4 rounded-2xl bg-[#121811] border border-amber-500/40 space-y-1">
                <span className="text-[10px] uppercase text-gray-400 block">10th Matriculation</span>
                <div className="text-xl sm:text-2xl font-bold text-amber-400">
                  {qualifications.tenth.percentage ? `${qualifications.tenth.percentage}%` : 'N/A'}
                </div>
                <span className="text-[10px] text-gray-400 block truncate">
                  {qualifications.tenth.marksObtained}/{qualifications.tenth.fullMarks} Marks
                </span>
                <span className="text-[9px] text-emerald-400 block font-bold">
                  Army GD Cutoff Cleared
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121811] border border-blue-500/40 space-y-1">
                <span className="text-[10px] uppercase text-gray-400 block">12th Intermediate</span>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {qualifications.twelfth?.percentage ? `${qualifications.twelfth.percentage}%` : 'N/A'}
                </div>
                <span className="text-[10px] text-gray-400 block truncate">
                  {qualifications.twelfth?.marksObtained || 0}/{qualifications.twelfth?.fullMarks || 0} Marks
                </span>
                <span className="text-[9px] text-blue-400 block font-bold">
                  {qualifications.twelfth?.stream || 'Science'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121811] border border-emerald-500/40 space-y-1">
                <span className="text-[10px] uppercase text-gray-400 block">Graduation Degree</span>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {qualifications.graduation?.percentage ? `${qualifications.graduation.percentage}%` : 'N/A'}
                </div>
                <span className="text-[10px] text-gray-400 block truncate">
                  {qualifications.graduation?.marksObtained || 0}/{qualifications.graduation?.fullMarks || 0} Marks
                </span>
                <span className="text-[9px] text-emerald-400 block font-bold">
                  SI & CDS Eligible
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121811] border border-purple-500/40 space-y-1">
                <span className="text-[10px] uppercase text-gray-400 block">Post Graduation</span>
                <div className="text-xl sm:text-2xl font-bold text-purple-400">
                  {qualifications.postGraduation?.percentage ? `${qualifications.postGraduation.percentage}%` : 'N/A'}
                </div>
                <span className="text-[10px] text-gray-400 block truncate">
                  {qualifications.postGraduation?.marksObtained || 0}/{qualifications.postGraduation?.fullMarks || 0} Marks
                </span>
                <span className="text-[9px] text-purple-400 block font-bold">
                  Gazetted Entry
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
              {[
                { id: 'ALL', label: 'All Qualifications (4 Levels)' },
                { id: 'tenth', label: '10th Matric' },
                { id: 'twelfth', label: '12th Inter (10+2)' },
                { id: 'graduation', label: 'Graduation' },
                { id: 'postGraduation', label: 'Post-Graduation' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setActiveQualLevel(lvl.id as any)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    activeQualLevel === lvl.id
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold'
                      : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* LEVEL 1: 10TH MATRICULATION RECORD */}
            {(activeQualLevel === 'ALL' || activeQualLevel === 'tenth') && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#121811] border border-amber-500/40 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273623] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                        10th Standard / Matriculation Record
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        Foundation Qualification • Army Agniveer GD Mandate
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="army" size="sm">Mandatory</Badge>
                    {renderDivisionBadge(qualifications.tenth.percentage)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Board / Council
                    </label>
                    <input
                      type="text"
                      value={qualifications.tenth.board}
                      onChange={e => handleUpdateMarks('tenth', 'board', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Stream / Curriculum
                    </label>
                    <input
                      type="text"
                      value={qualifications.tenth.stream}
                      onChange={e => handleUpdateMarks('tenth', 'stream', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Specialization / Subject Group
                    </label>
                    <input
                      type="text"
                      value={qualifications.tenth.specialization}
                      onChange={e => handleUpdateMarks('tenth', 'specialization', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-1">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={qualifications.tenth.passingYear}
                      onChange={e => handleUpdateMarks('tenth', 'passingYear', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-amber-400 uppercase text-[10px] block mb-1 font-bold">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      value={qualifications.tenth.marksObtained}
                      onChange={e => handleUpdateMarks('tenth', 'marksObtained', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-amber-500/50 rounded-xl px-3 py-2 text-white font-bold text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Full / Total Marks
                    </label>
                    <input
                      type="number"
                      value={qualifications.tenth.fullMarks}
                      onChange={e => handleUpdateMarks('tenth', 'fullMarks', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B0F0A] border border-amber-500/40 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
                      <span>Auto Calculated %</span>
                      <Calculator className="w-3 h-3 text-amber-500" />
                    </span>
                    <span className="text-xl font-black font-mono text-amber-400">
                      {qualifications.tenth.percentage ? `${qualifications.tenth.percentage}%` : '0.00%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 2: 12TH INTERMEDIATE RECORD */}
            {(activeQualLevel === 'ALL' || activeQualLevel === 'twelfth') && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#121811] border border-blue-500/40 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273623] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                        12th Standard / Higher Secondary (10+2) Record
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        Senior Secondary • Army Clerk, Tech & Airmen Branch Entry
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="saffron" size="sm">Technical Entry</Badge>
                    {renderDivisionBadge(qualifications.twelfth?.percentage)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Board / Council
                    </label>
                    <input
                      type="text"
                      value={qualifications.twelfth?.board || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'board', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Stream
                    </label>
                    <input
                      type="text"
                      value={qualifications.twelfth?.stream || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'stream', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Specialization / Major Subjects
                    </label>
                    <input
                      type="text"
                      value={qualifications.twelfth?.specialization || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'specialization', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-1">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={qualifications.twelfth?.passingYear || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'passingYear', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-blue-400 uppercase text-[10px] block mb-1 font-bold">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      value={qualifications.twelfth?.marksObtained || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'marksObtained', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-blue-500/50 rounded-xl px-3 py-2 text-white font-bold text-sm font-mono focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Full / Total Marks
                    </label>
                    <input
                      type="number"
                      value={qualifications.twelfth?.fullMarks || ''}
                      onChange={e => handleUpdateMarks('twelfth', 'fullMarks', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B0F0A] border border-blue-500/40 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
                      <span>Auto Calculated %</span>
                      <Calculator className="w-3 h-3 text-blue-400" />
                    </span>
                    <span className="text-xl font-black font-mono text-blue-400">
                      {qualifications.twelfth?.percentage ? `${qualifications.twelfth.percentage}%` : '0.00%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 3: GRADUATION RECORD */}
            {(activeQualLevel === 'ALL' || activeQualLevel === 'graduation') && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#121811] border border-emerald-500/40 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273623] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                        Graduation / Bachelor's Degree Record
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        Undergraduate • Police Sub-Inspector, CDS & CAPF AC Qualifying
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">Officer Branch</Badge>
                    {renderDivisionBadge(qualifications.graduation?.percentage)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Board / University / Institute
                    </label>
                    <input
                      type="text"
                      value={qualifications.graduation?.board || ''}
                      onChange={e => handleUpdateMarks('graduation', 'board', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Stream / Degree
                    </label>
                    <input
                      type="text"
                      value={qualifications.graduation?.stream || ''}
                      onChange={e => handleUpdateMarks('graduation', 'stream', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Specialization / Honours Major
                    </label>
                    <input
                      type="text"
                      value={qualifications.graduation?.specialization || ''}
                      onChange={e => handleUpdateMarks('graduation', 'specialization', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-1">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={qualifications.graduation?.passingYear || ''}
                      onChange={e => handleUpdateMarks('graduation', 'passingYear', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-emerald-400 uppercase text-[10px] block mb-1 font-bold">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      value={qualifications.graduation?.marksObtained || ''}
                      onChange={e => handleUpdateMarks('graduation', 'marksObtained', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-emerald-500/50 rounded-xl px-3 py-2 text-white font-bold text-sm font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Full / Total Marks
                    </label>
                    <input
                      type="number"
                      value={qualifications.graduation?.fullMarks || ''}
                      onChange={e => handleUpdateMarks('graduation', 'fullMarks', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B0F0A] border border-emerald-500/40 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
                      <span>Auto Calculated %</span>
                      <Calculator className="w-3 h-3 text-emerald-400" />
                    </span>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      {qualifications.graduation?.percentage ? `${qualifications.graduation.percentage}%` : '0.00%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 4: POST GRADUATION RECORD */}
            {(activeQualLevel === 'ALL' || activeQualLevel === 'postGraduation') && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#121811] border border-purple-500/40 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273623] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                        Post Graduation / Master's Degree Record
                      </h4>
                      <span className="text-xs font-mono text-gray-400">
                        Postgraduate • Army Education Corps & Direct Gazetted Wings
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="saffron" size="sm">Specialist Entry</Badge>
                    {renderDivisionBadge(qualifications.postGraduation?.percentage)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Board / University / Institute
                    </label>
                    <input
                      type="text"
                      value={qualifications.postGraduation?.board || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'board', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Stream / Degree
                    </label>
                    <input
                      type="text"
                      value={qualifications.postGraduation?.stream || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'stream', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Specialization / Discipline
                    </label>
                    <input
                      type="text"
                      value={qualifications.postGraduation?.specialization || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'specialization', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-1">
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={qualifications.postGraduation?.passingYear || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'passingYear', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-purple-400 uppercase text-[10px] block mb-1 font-bold">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      value={qualifications.postGraduation?.marksObtained || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'marksObtained', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-purple-500/50 rounded-xl px-3 py-2 text-white font-bold text-sm font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 uppercase text-[10px] block mb-1">
                      Full / Total Marks
                    </label>
                    <input
                      type="number"
                      value={qualifications.postGraduation?.fullMarks || ''}
                      onChange={e => handleUpdateMarks('postGraduation', 'fullMarks', e.target.value)}
                      className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white text-sm font-mono"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B0F0A] border border-purple-500/40 flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 uppercase flex items-center justify-between">
                      <span>Auto Calculated %</span>
                      <Calculator className="w-3 h-3 text-purple-400" />
                    </span>
                    <span className="text-xl font-black font-mono text-purple-400">
                      {qualifications.postGraduation?.percentage ? `${qualifications.postGraduation.percentage}%` : '0.00%'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: OFFICIAL EVALUATION SHEET & PDF REPORT EXPORT (MODULE 6)
            =================================================================== */}
        {activeTab === 'REPORT' && (
          <Suspense fallback={<ReportDossierSkeleton />}>
            <DynamicProgressReportPDFView
              data={{
                ...DEFAULT_CADET_REPORT,
                cadetName,
                dossierNumber: cadetRoll,
                targetForce: targetForce || DEFAULT_CADET_REPORT.targetForce,
                bloodGroup: bloodGroup || DEFAULT_CADET_REPORT.bloodGroup,
                birthMarks: birthMarks || undefined,
                passportPhoto: cadetPhoto || undefined,
                heightCm: cadetHeight,
                weightKg: cadetWeight,
                chestNormalCm: cadetChestNormal,
                chestExpandedCm: cadetChestExpanded,
                attendancePercent: attendancePercent
              }}
              onClose={() => setActiveTab('TELEMETRY')}
            />
          </Suspense>
        )}

        {/* ===================================================================
            TAB 3: ATTENDANCE & DEFAULTER RECORD
            =================================================================== */}
        {activeTab === 'ATTENDANCE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                    Monthly Ground Attendance (October 2026)
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">
                    Automatic defaulter detection flags candidates with 3 consecutive unexcused absences.
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  Active (0 Defaulter Alerts)
                </Badge>
              </div>

              {/* Daily Parade Ground Attendance State */}
              {attendancePercent === 0 ? (
                <div className="py-12 text-center p-6 border border-dashed border-[#273623] rounded-2xl bg-[#0B0F0A] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto border border-amber-500/30">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h5 className="font-display font-bold text-white text-base">New Recruit Muster Status</h5>
                  <p className="text-xs font-mono text-gray-400 max-w-md mx-auto">
                    0 parade ground roll-call attendances recorded. Your daily morning parade attendance markings will appear here once morning roll call is logged by Ustad.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2 pt-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div
                      key={i}
                      className="text-center font-mono text-[11px] text-gray-500 font-bold py-1"
                    >
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const isSunday = day % 7 === 0;
                    const isFuture = day > 1;

                    return (
                      <div
                        key={day}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center font-mono text-xs transition-colors ${
                          isFuture
                            ? 'border-[#1A2415] bg-[#0E140C] text-gray-600'
                            : isSunday
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold'
                        }`}
                      >
                        <span>{day}</span>
                        <span className="text-[9px]">
                          {isFuture ? '' : isSunday ? 'TRIAL' : 'P'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-gray-400 border-t border-[#1A2415]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
                  <span>Present (Morning Drill)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
                  <span>Sunday Super-Timed Trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" />
                  <span>Unexcused Absence</span>
                </div>
              </div>
            </div>

            {/* Attendance Rules & Standing */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-3xl bg-[#161F15] border border-[#273623] space-y-4">
                <h4 className="font-display font-bold text-lg text-white uppercase">
                  AIM Attendance Rules
                </h4>
                <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-sans">
                  <p>
                    • Minimum <strong className="text-amber-400 font-mono">85% monthly attendance</strong> is required to remain in the morning Alfa batch.
                  </p>
                  <p>
                    • <strong className="text-rose-400 font-mono">3 consecutive absences</strong> without informing Anup Sir results in automated suspension to the waiting reserve list.
                  </p>
                  <p>
                    • Reporting time at J.K College Ground Purulia is <strong className="text-white font-mono">05:00 AM sharp</strong>. Cadets arriving after national anthem will not be marked present.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: DAILY DRILL SCHEDULE
            =================================================================== */}
        {activeTab === 'SCHEDULE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                  Phase 1 (05:00 - 05:30 AM)
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                Dynamic Warm-Up & Joint Mobility
              </h4>
              <ul className="space-y-2 text-xs text-gray-300 font-sans">
                <li>• 800m Slow Aerobic Jogging</li>
                <li>• Ankle, Hamstring & Hip Mobility Drills</li>
                <li>• High Knees, Butt Kicks, Carioca Crossover</li>
                <li>• 4 x 50m Accelerated Strides</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[#121811] border border-amber-500/40 space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                  Phase 2 (05:30 - 07:15 AM)
                </span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                Core Track Speed & Endurance
              </h4>
              <ul className="space-y-2 text-xs text-gray-300 font-sans">
                <li>• 6 x 400m Track Intervals at 1m 16s pace (90s rest)</li>
                <li>• Continuous 2400m Tempo Pacing Drill</li>
                <li>• Resistance Band Sprint Starts</li>
                <li>• Incline Sprint Climbs (Stadium Steps)</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                  Phase 3 (07:15 - 08:30 AM)
                </span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                Strength, Beam & Cool-down
              </h4>
              <ul className="space-y-2 text-xs text-gray-300 font-sans">
                <li>• 5 Sets x 10 Strict Beam Pull-ups (Dead-hang)</li>
                <li>• Push-up Pyramid: 50 - 40 - 30 - 20 reps</li>
                <li>• 9-Feet Sandpit Clearance technique</li>
                <li>• Static Decompression & Diaphragmatic Breathing</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: SUBMIT SUCCESS STORY
            =================================================================== */}
        {activeTab === 'STORY' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
            <div className="space-y-2">
              <Badge variant="saffron" size="sm">
                Candidate Voice & Wall of Fame
              </Badge>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                Share Your Transformation Journey
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Cadets who have improved their running pace or qualified preliminary defence recruitment trials can submit their story. Approved stories appear on the AIM Wall of Fame.
              </p>
            </div>

            {storySubmitted ? (
              <div className="p-6 rounded-2xl bg-[#161F15] border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-display font-bold text-lg text-white uppercase">
                  Story Submitted for Review!
                </h4>
                <p className="text-xs text-gray-300">
                  Anup Sir and the editorial desk will review your submission before featuring it on the official Wall of Fame.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStorySubmitted(false)}
                >
                  Submit Another Update
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Your Training Journey & Remarks *
                  </label>
                  <textarea
                    rows={5}
                    value={storyText}
                    onChange={e => setStoryText(e.target.value)}
                    placeholder="Tell future aspirants about your training baseline, your experience under Anup Sir's coaching, and how you cleared your trial..."
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl p-4 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-gray-500">
                    Subject to moderator approval before publication.
                  </span>
                  <Button
                    variant="saffron"
                    size="md"
                    onClick={() => {
                      if (!storyText.trim()) {
                        alert('Please write your story before submitting.');
                        return;
                      }
                      setStorySubmitted(true);
                    }}
                  >
                    Submit Journey
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
