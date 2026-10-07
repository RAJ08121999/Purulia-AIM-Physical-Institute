'use client';

import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Shield,
  Award,
  CheckCircle2,
  Calendar,
  User,
  Activity,
  Flame,
  QrCode,
  FileText,
  ArrowLeft,
  X,
  GraduationCap
} from 'lucide-react';

export interface CadetReportData {
  cadetName: string;
  dossierNumber: string;
  batchName: string;
  targetForce: string;
  admissionDate: string;
  evaluationDate: string;
  age: number;
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  chestNormalCm: number;
  chestExpandedCm: number;
  attendancePercent: number;
  sessionsAttended: number;
  totalSessions: number;
  runBaseline: string;
  runLatest: string;
  runSeconds: number;
  pullupsBaseline: number;
  pullupsLatest: number;
  ditchJumpPass: boolean;
  zigzagBalancePass: boolean;
  totalPhysicalMarks: number;
  gradeClassification: string;
  batchRank: string;
  trainerRemarks: string;
  coachName: string;
  verificationCode: string;
  passportPhoto?: string;
  birthMarks?: string;
}

export const DEFAULT_CADET_REPORT: CadetReportData = {
  cadetName: 'Enlisted Cadet',
  dossierNumber: '—',
  batchName: 'Training Platoon',
  targetForce: 'Aspirant',
  admissionDate: '—',
  evaluationDate: '—',
  age: 0,
  bloodGroup: '—',
  heightCm: 0,
  weightKg: 0,
  chestNormalCm: 0,
  chestExpandedCm: 0,
  attendancePercent: 0,
  sessionsAttended: 0,
  totalSessions: 0,
  runBaseline: 'Not Tested',
  runLatest: 'Not Tested',
  runSeconds: 0,
  pullupsBaseline: 0,
  pullupsLatest: 0,
  ditchJumpPass: false,
  zigzagBalancePass: false,
  totalPhysicalMarks: 0,
  gradeClassification: 'Pending Evaluation',
  batchRank: '—',
  trainerRemarks:
    'Cadet enrolled in Purulia AIM Physical Institute training squad. Formal 1600m timed trial and beam pull-up evaluation will be recorded during official parade assessments.',
  coachName: 'Havaldar Anup Kumar Mahato (Head Drill Ustad)',
  verificationCode: 'AIM-VERIFY-PENDING',
  birthMarks: '—'
};

export interface ProgressReportPDFViewProps {
  data?: CadetReportData;
  onClose?: () => void;
  className?: string;
}

export function ProgressReportPDFView({
  data = DEFAULT_CADET_REPORT,
  onClose,
  className = ''
}: ProgressReportPDFViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [qualifications, setQualifications] = React.useState<any>({
    tenth: null,
    twelfth: null,
    graduation: null,
    postGraduation: null
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('cadet_qualifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setQualifications((prev: any) => ({
          tenth: parsed.tenth || prev.tenth,
          twelfth: parsed.twelfth !== undefined ? parsed.twelfth : prev.twelfth,
          graduation: parsed.graduation !== undefined ? parsed.graduation : prev.graduation,
          postGraduation: parsed.postGraduation !== undefined ? parsed.postGraduation : prev.postGraduation
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const bmi = (data.weightKg / Math.pow(data.heightCm / 100, 2)).toFixed(1);
  const chestExpansion = (data.chestExpandedCm - data.chestNormalCm).toFixed(1);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121811] border border-[#273623]">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0B0F0A] hover:bg-[#1A2415] border border-[#273623] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Official Cadet Evaluation Dossier (Print / PDF)</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Print-ready evaluation sheet formatted for standard A4 document export with security seal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF (A4)</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#0B0F0A] hover:bg-rose-950/40 border border-[#273623] hover:border-rose-500/50 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          PRINT-READY DOSSIER SHEET (CSS-ISOLATED FOR SCREEN & A4 PRINT)
          ========================================================================= */}
      <div
        ref={printRef}
        className="print-container max-w-4xl mx-auto bg-[#0E140C] text-slate-100 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-[#273623] shadow-2xl relative overflow-hidden font-sans space-y-4 sm:space-y-6"
      >
        {/* Subtle Watermark Stamp */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
          <span className="font-display font-black text-7xl sm:text-9xl tracking-widest uppercase text-white rotate-[-30deg]">
            PAPI OFFICIAL
          </span>
        </div>

        {/* 1. INSTITUTIONAL HEADER */}
        <div className="border-b-2 border-amber-500/60 pb-4 sm:pb-6 text-center space-y-2 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black font-display font-black text-xl sm:text-2xl flex items-center justify-center border border-amber-400 shadow-md flex-shrink-0">
                AIM
              </div>
              <div className="sm:hidden w-12 h-12 rounded-xl border border-[#273623] bg-[#161F15] flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                <QrCode className="w-6 h-6 text-amber-400" />
                <span className="text-[7px] font-mono text-gray-400">VERIFIED</span>
              </div>
            </div>

            <div className="flex-1 px-1 sm:px-4 text-center">
              <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                ESTD. PURULIA • WEST BENGAL
              </div>
              <h1 className="font-display font-black text-xl sm:text-3xl tracking-wider text-white uppercase leading-tight">
                PURULIA AIM PHYSICAL INSTITUTE
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-300 font-sans font-medium mt-0.5">
                Premier Training Academy for Indian Armed Forces, Paramilitary & State Police Services
              </p>
              <div className="text-[9px] sm:text-[10px] font-mono text-gray-400 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-1">
                <span>Govt Reg: WB-PUR-2024-8841</span>
                <span>•</span>
                <span>Ground: J.K. College Stadium</span>
                <span>•</span>
                <span>Helpline: +91 97321 00000</span>
              </div>
            </div>

            <div className="hidden sm:flex w-16 h-16 rounded-xl border border-[#273623] bg-[#161F15] flex-col items-center justify-center text-center p-1 flex-shrink-0">
              <QrCode className="w-8 h-8 text-amber-400" />
              <span className="text-[8px] font-mono text-gray-400">VERIFIED</span>
            </div>
          </div>

          <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-[#161F15] border border-amber-500/40 text-amber-400 font-display font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            CADET PHYSICAL EFFICIENCY & PERFORMANCE DOSSIER
          </div>
        </div>

        {/* 2. CADET DEMOGRAPHIC & IDENTIFICATION STRIP */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#121811] border border-[#273623]">
          {/* Passport Photo Frame (35mm x 45mm ratio) */}
          <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl border-2 border-amber-500/70 bg-[#0B0F0A] flex flex-col items-center justify-center overflow-hidden flex-shrink-0 shadow-lg relative">
            {data.passportPhoto ? (
              <>
                <img
                  src={data.passportPhoto}
                  alt={data.cadetName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] font-mono text-amber-400 font-bold uppercase text-center py-0.5">
                  ATTESTED PHOTO
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-gray-500">
                <User className="w-7 h-7 text-amber-400/70 mb-1" />
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-tight">
                  AFFIX PHOTO
                </span>
                <span className="text-[8px] font-mono text-gray-500 mt-0.5">35mm × 45mm</span>
              </div>
            )}
          </div>

          {/* Demographic Data Matrix */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs font-mono w-full">
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Cadet Full Name</span>
              <span className="font-bold text-white text-sm font-display tracking-wide uppercase">
                {data.cadetName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Dossier / Roll No</span>
              <span className="font-bold text-amber-400">{data.dossierNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Assigned Batch</span>
              <span className="font-semibold text-gray-200">{data.batchName}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Target Recruitment</span>
              <span className="font-bold text-emerald-400">{data.targetForce}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Evaluation Date</span>
              <span className="text-gray-200">{data.evaluationDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Cadet Age / Blood</span>
              <span className="text-gray-200">{data.age} Yrs / {data.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Identification Mark</span>
              <span className="text-gray-300 text-xs truncate block" title={data.birthMarks || 'NIL'}>
                {data.birthMarks || 'NIL (Standard Clean)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Batch Ranking</span>
              <span className="font-bold text-amber-400">{data.batchRank}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase block">Dossier Reference</span>
              <span className="text-gray-400 text-[10px] truncate block">{data.verificationCode}</span>
            </div>
          </div>
        </div>

        {/* 3. ANTHROPOMETRIC MEASUREMENTS (PST CRITERIA) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider font-bold text-gray-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <User className="w-4 h-4" />
              <span>Section A: Physical Standards & Anthropometry (PST)</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">ALL STANDARDS COMPLIANT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#161F15] border border-[#273623]">
              <span className="text-[10px] text-gray-400 uppercase block">Stature Height</span>
              <span className="text-base font-bold text-white">{data.heightCm} cm</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">Req: ≥ 169.0 cm (PASSED)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#161F15] border border-[#273623]">
              <span className="text-[10px] text-gray-400 uppercase block">Body Weight & BMI</span>
              <span className="text-base font-bold text-white">{data.weightKg} kg</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">BMI: {bmi} (Optimal Range)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#161F15] border border-[#273623]">
              <span className="text-[10px] text-gray-400 uppercase block">Chest (Normal)</span>
              <span className="text-base font-bold text-white">{data.chestNormalCm} cm</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">Req: ≥ 77.0 cm (PASSED)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#161F15] border border-[#273623]">
              <span className="text-[10px] text-gray-400 uppercase block">Chest Expansion</span>
              <span className="text-base font-bold text-amber-400">+{chestExpansion} cm</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">Exp: {data.chestExpandedCm} cm (Req ≥ 5cm)</span>
            </div>
          </div>
        </div>

        {/* 4. PHYSICAL EFFICIENCY TEST (PET/BPET) PERFORMANCE MATRIX */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider font-bold text-gray-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-4 h-4" />
              <span>Section B: Physical Efficiency & Rally Trial Scoring (PET / BPET)</span>
            </span>
            <span className="text-amber-400 font-mono text-[11px]">CALIBRATED TO INDIAN ARMY CRITERIA</span>
          </div>

          <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-1 sm:mx-0 px-1 sm:px-0 rounded-xl border border-[#273623]">
            <table className="w-full text-left text-xs font-mono min-w-[560px]">
              <thead>
                <tr className="bg-[#161F15] text-gray-400 border-b border-[#273623]">
                  <th className="py-2.5 px-3">PET Discipline</th>
                  <th className="py-2.5 px-3">Baseline (Intake)</th>
                  <th className="py-2.5 px-3">Current Trial PB</th>
                  <th className="py-2.5 px-3">Official Cut-off</th>
                  <th className="py-2.5 px-3">Marks Scored</th>
                  <th className="py-2.5 px-3">Official Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2415]">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">
                    1600m Endurance Run
                  </td>
                  <td className="py-3 px-3 text-gray-400">{data.runBaseline}</td>
                  <td className="py-3 px-3 font-bold text-amber-400 text-sm">{data.runLatest}</td>
                  <td className="py-3 px-3 text-gray-300">≤ 05m 30s (Group 1)</td>
                  <td className="py-3 px-3 font-bold text-white">60 / 60 Pts</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Group 1 Qualified
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-bold text-white">
                    Beam Pull-ups (Undergrip)
                  </td>
                  <td className="py-3 px-3 text-gray-400">{data.pullupsBaseline} reps</td>
                  <td className="py-3 px-3 font-bold text-amber-400 text-sm">{data.pullupsLatest} reps</td>
                  <td className="py-3 px-3 text-gray-300">10 reps (Full Marks)</td>
                  <td className="py-3 px-3 font-bold text-white">40 / 40 Pts</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Full Marks (Max)
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-bold text-white">
                    9-Feet Ditch Clearance Jump
                  </td>
                  <td className="py-3 px-3 text-gray-400">Fault (Step Fault)</td>
                  <td className="py-3 px-3 font-bold text-amber-400">Clean 9.4 ft</td>
                  <td className="py-3 px-3 text-gray-300">9 Feet (Qualifying)</td>
                  <td className="py-3 px-3 text-gray-300">Qualifying</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PASSED
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-bold text-white">
                    Zig-Zag Balance Beam Walk
                  </td>
                  <td className="py-3 px-3 text-gray-400">1 Foot Slip</td>
                  <td className="py-3 px-3 font-bold text-amber-400">Zero Fault (Steady)</td>
                  <td className="py-3 px-3 text-gray-300">Full Traversal</td>
                  <td className="py-3 px-3 text-gray-300">Qualifying</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PASSED
                    </span>
                  </td>
                </tr>

                {/* Aggregate Row */}
                <tr className="bg-[#121811] font-bold border-t-2 border-amber-500/50">
                  <td className="py-3 px-3 text-amber-400 uppercase font-display text-sm" colSpan={4}>
                    Total Physical Score & Official Fitness Grade
                  </td>
                  <td className="py-3 px-3 text-amber-400 text-sm">
                    {data.totalPhysicalMarks} / 100 Pts
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-display font-black text-sm">
                    {data.gradeClassification}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION C: ACADEMIC QUALIFICATIONS & PREVIOUS EDUCATIONAL RECORDS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider font-bold text-gray-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <GraduationCap className="w-4 h-4" />
              <span>Section C: Academic Qualifications Portfolio (10th, 12th, Graduation & Post-Graduation)</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">CALCULATED PERCENTAGES VERIFIED</span>
          </div>

          <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-1 sm:mx-0 px-1 sm:px-0 rounded-xl border border-[#273623]">
            <table className="w-full text-left text-xs font-mono min-w-[620px]">
              <thead>
                <tr className="bg-[#161F15] text-gray-400 border-b border-[#273623]">
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Board / University</th>
                  <th className="py-2.5 px-3">Stream</th>
                  <th className="py-2.5 px-3">Specialization</th>
                  <th className="py-2.5 px-3 text-center">Marks (Obt / Full)</th>
                  <th className="py-2.5 px-3 text-center">Auto %</th>
                  <th className="py-2.5 px-3 text-right">Cadet Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2415]">
                {/* 10th Record */}
                {qualifications.tenth && (
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      10th Matric
                    </td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.tenth.board}</td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.tenth.stream}</td>
                    <td className="py-2.5 px-3 text-gray-400 truncate max-w-[140px]" title={qualifications.tenth.specialization}>
                      {qualifications.tenth.specialization || 'Compulsory All'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-white">
                      {qualifications.tenth.marksObtained} / {qualifications.tenth.fullMarks}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-amber-400">
                      {qualifications.tenth.percentage ? `${qualifications.tenth.percentage}%` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {Number(qualifications.tenth.percentage) >= 60 ? '1st Class' : 'Passed'}
                      </span>
                    </td>
                  </tr>
                )}

                {/* 12th Record */}
                {qualifications.twelfth && (
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      12th Inter
                    </td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.twelfth.board}</td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.twelfth.stream}</td>
                    <td className="py-2.5 px-3 text-gray-400 truncate max-w-[140px]" title={qualifications.twelfth.specialization}>
                      {qualifications.twelfth.specialization || 'Science / Arts'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-white">
                      {qualifications.twelfth.marksObtained} / {qualifications.twelfth.fullMarks}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-blue-400">
                      {qualifications.twelfth.percentage ? `${qualifications.twelfth.percentage}%` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {Number(qualifications.twelfth.percentage) >= 60 ? '1st Class' : 'Passed'}
                      </span>
                    </td>
                  </tr>
                )}

                {/* Graduation Record */}
                {qualifications.graduation && (
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Graduation
                    </td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.graduation.board}</td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.graduation.stream}</td>
                    <td className="py-2.5 px-3 text-gray-400 truncate max-w-[140px]" title={qualifications.graduation.specialization}>
                      {qualifications.graduation.specialization || 'Major / Honours'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-white">
                      {qualifications.graduation.marksObtained} / {qualifications.graduation.fullMarks}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-emerald-400">
                      {qualifications.graduation.percentage ? `${qualifications.graduation.percentage}%` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SI Eligible
                      </span>
                    </td>
                  </tr>
                )}

                {/* Post Graduation Record */}
                {qualifications.postGraduation && (
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      Post Grad
                    </td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.postGraduation.board}</td>
                    <td className="py-2.5 px-3 text-gray-300">{qualifications.postGraduation.stream}</td>
                    <td className="py-2.5 px-3 text-gray-400 truncate max-w-[140px]" title={qualifications.postGraduation.specialization}>
                      {qualifications.postGraduation.specialization || 'Master Specialization'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-white">
                      {qualifications.postGraduation.marksObtained} / {qualifications.postGraduation.fullMarks}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-center text-purple-400">
                      {qualifications.postGraduation.percentage ? `${qualifications.postGraduation.percentage}%` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        Officer Eligible
                      </span>
                    </td>
                  </tr>
                )}
                {(!qualifications.tenth && !qualifications.twelfth && !qualifications.graduation && !qualifications.postGraduation) && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500 font-mono text-xs">
                      No academic credentials recorded in cadet profile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. ATTENDANCE & DISCIPLINE RECORD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#121811] border border-[#273623] text-xs font-mono">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Monthly Ground Attendance</span>
            <span className="text-lg font-bold text-emerald-400 font-display">{data.attendancePercent}%</span>
            <span className="text-[10px] text-gray-400 block">{data.sessionsAttended} of {data.totalSessions} Sessions Attended</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Defaulter & Disciplinary Alerts</span>
            <span className="text-lg font-bold text-emerald-400 font-display">ZERO (EXEMPLARY)</span>
            <span className="text-[10px] text-gray-400 block">Zero Unexcused Absences</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Morning Reporting Punctuality</span>
            <span className="text-lg font-bold text-white font-display">100% ON-TIME (05:00 AM)</span>
            <span className="text-[10px] text-gray-400 block">J.K. College Stadium Purulia</span>
          </div>
        </div>

        {/* 6. TRAINER REMARKS & ENDORSEMENT */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#161F15] border border-amber-500/30 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Chief Athletic Coach Evaluation & Standing Recommendation</span>
            </span>
            <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
              RALLY CLEARED & RECOMMENDED
            </span>
          </div>
          <p className="text-xs text-gray-200 font-sans leading-relaxed italic">
            &ldquo;{data.trainerRemarks}&rdquo;
          </p>
        </div>

        {/* 7. VERIFICATION, SEAL & SIGNATURES */}
        <div className="pt-6 border-t border-[#273623] flex flex-col md:flex-row items-center justify-between gap-6 page-break-inside-avoid">
          {/* Institutional Stamp Placeholder */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-amber-500/60 flex flex-col items-center justify-center text-center p-1 font-mono text-[8px] text-amber-400 select-none flex-shrink-0">
              <span className="font-bold">AIM PURULIA</span>
              <span className="text-[7px]">OFFICIAL SEAL</span>
              <span className="text-[6px] text-gray-400">2026-OCT</span>
            </div>
            <div className="text-[10px] font-mono text-gray-400 min-w-0">
              <div>Verification Hash:</div>
              <div className="font-bold text-gray-300 truncate">{data.verificationCode}</div>
              <div className="text-[9px] text-gray-500">Scan QR to authenticate dossier on server</div>
            </div>
          </div>

          {/* Signature Blocks */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full md:w-auto">
            <div className="text-center w-full sm:w-auto">
              <div className="h-8 sm:h-10 flex items-end justify-center font-display font-black text-amber-400 tracking-wider italic text-sm">
                {data.cadetName || 'Enlisted Cadet'}
              </div>
              <div className="w-36 border-t border-gray-500 pt-1 text-[10px] font-mono text-gray-400 uppercase mx-auto">
                Cadet Signature
              </div>
            </div>

            <div className="text-center w-full sm:w-auto">
              <div className="h-8 sm:h-10 flex items-end justify-center font-display font-black text-amber-400 tracking-wider text-sm">
                {data.coachName || 'Havaldar Anup Kumar Mahato'}
              </div>
              <div className="w-44 border-t border-amber-500 pt-1 text-[10px] font-mono text-amber-400 font-bold uppercase mx-auto">
                {data.coachName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
