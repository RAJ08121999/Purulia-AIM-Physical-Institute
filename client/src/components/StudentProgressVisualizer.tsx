'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Timer,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Target,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export type TargetForceKey = 'ARMY_GD' | 'WB_POLICE' | 'RPF_CONSTABLE' | 'SSC_GD';
export type MetricType = '1600M_RUN' | 'PULLUPS' | 'TOTAL_MARKS';
export type RunCategoryKey = '100M' | '400M' | '800M' | '1600M' | '5KM' | '10KM';

import { fetchRunTrials, RunTrial } from '@/lib/api';

export interface TrialDataPoint {
  id: string;
  trialDate: string;
  timeSeconds: number; // run time in seconds
  displayTime: string; // e.g. "05m 24s" or "11.60s"
  pullups: number;     // reps
  marks: number;       // total points out of 100
  note: string;
  ditchPass?: boolean;
  zigzagPass?: boolean;
  source?: 'TRAINER_DRILL' | 'CADET_SELF_TRAINING' | 'OFFICIAL_TRIAL';
}

export interface CategorySpec {
  key: RunCategoryKey;
  label: string;
  short: string;
  icon: string;
  distanceMeters: number;
  benchmarkSeconds: number;
  benchmarkFormatted: string;
  maxSeconds: number;
  yMin: number;
  yMax: number;
  formatTick: (val: number) => string;
  formatTooltip: (val: number) => string;
}

export const RUN_CATEGORY_SPECS: Record<RunCategoryKey, CategorySpec> = {
  '100M': {
    key: '100M',
    label: '100m Sprint',
    short: '100m',
    icon: '⚡',
    distanceMeters: 100,
    benchmarkSeconds: 12.5,
    benchmarkFormatted: '12.50s',
    maxSeconds: 14.5,
    yMin: 10,
    yMax: 16,
    formatTick: (val) => `${val.toFixed(1)}s`,
    formatTooltip: (val) => `${val.toFixed(2)}s`
  },
  '400M': {
    key: '400M',
    label: '400m Anaerobic Sprint',
    short: '400m',
    icon: '🏃',
    distanceMeters: 400,
    benchmarkSeconds: 60.0,
    benchmarkFormatted: '01m 00s',
    maxSeconds: 72.0,
    yMin: 50,
    yMax: 80,
    formatTick: (val) => `${Math.floor(val / 60)}m${val % 60 ? (val % 60) + 's' : '00s'}`,
    formatTooltip: (val) => `${Math.floor(val / 60)}m ${(val % 60).toFixed(1)}s`
  },
  '800M': {
    key: '800M',
    label: '800m Middle Distance',
    short: '800m',
    icon: '⏱️',
    distanceMeters: 800,
    benchmarkSeconds: 135.0,
    benchmarkFormatted: '02m 15s',
    maxSeconds: 165.0,
    yMin: 110,
    yMax: 180,
    formatTick: (val) => `${Math.floor(val / 60)}m${val % 60 ? (val % 60) + 's' : ''}`,
    formatTooltip: (val) => `${Math.floor(val / 60)}m ${String(Math.floor(val % 60)).padStart(2, '0')}s`
  },
  '1600M': {
    key: '1600M',
    label: '1600m BPET Standard',
    short: '1600m',
    icon: '🎖️',
    distanceMeters: 1600,
    benchmarkSeconds: 330.0,
    benchmarkFormatted: '05m 30s',
    maxSeconds: 345.0,
    yMin: 300,
    yMax: 460,
    formatTick: (val) => `${Math.floor(val / 60)}m${val % 60 ? (val % 60) + 's' : ''}`,
    formatTooltip: (val) => `${Math.floor(val / 60)}m ${String(Math.floor(val % 60)).padStart(2, '0')}s`
  },
  '5KM': {
    key: '5KM',
    label: '5.0 km Road Run',
    short: '5km',
    icon: '🛣️',
    distanceMeters: 5000,
    benchmarkSeconds: 1440.0,
    benchmarkFormatted: '24m 00s',
    maxSeconds: 1680.0,
    yMin: 1200,
    yMax: 1800,
    formatTick: (val) => `${Math.floor(val / 60)}m`,
    formatTooltip: (val) => `${Math.floor(val / 60)}m ${String(Math.floor(val % 60)).padStart(2, '0')}s`
  },
  '10KM': {
    key: '10KM',
    label: '10.0 km Cross-Country Marathon',
    short: '10km',
    icon: '🏔️',
    distanceMeters: 10000,
    benchmarkSeconds: 3000.0,
    benchmarkFormatted: '50m 00s',
    maxSeconds: 3600.0,
    yMin: 2700,
    yMax: 3900,
    formatTick: (val) => `${Math.floor(val / 60)}m`,
    formatTooltip: (val) => `${Math.floor(val / 60)}m ${String(Math.floor(val % 60)).padStart(2, '0')}s`
  }
};

export const CATEGORY_TRIAL_HISTORY: Record<RunCategoryKey, TrialDataPoint[]> = {
  '100M': [
    { id: '100m-1', trialDate: '03 Aug (W1)', timeSeconds: 14.8, displayTime: '14.80s', pullups: 4, marks: 40, note: 'Intake Acceleration Baseline' },
    { id: '100m-2', trialDate: '17 Aug (W3)', timeSeconds: 13.9, displayTime: '13.90s', pullups: 6, marks: 55, note: 'Block Start & Drive Phase Drill' },
    { id: '100m-3', trialDate: '31 Aug (W5)', timeSeconds: 13.2, displayTime: '13.20s', pullups: 8, marks: 70, note: 'Stride Frequency & Top End Speed' },
    { id: '100m-4', trialDate: '14 Sep (W7)', timeSeconds: 12.6, displayTime: '12.60s', pullups: 9, marks: 82, note: 'Sub-13s Sprint Milestone' },
    { id: '100m-5', trialDate: '28 Sep (W9)', timeSeconds: 12.1, displayTime: '12.10s', pullups: 10, marks: 92, note: 'Fast Stride Cadence Lock' },
    { id: '100m-6', trialDate: '04 Oct (W10)', timeSeconds: 11.6, displayTime: '11.60s', pullups: 11, marks: 100, note: 'Elite Sprint PB - 11.60s' }
  ],
  '400M': [
    { id: '400m-1', trialDate: '03 Aug (W1)', timeSeconds: 72.0, displayTime: '01m 12s', pullups: 4, marks: 38, note: 'Anaerobic Threshold Baseline' },
    { id: '400m-2', trialDate: '17 Aug (W3)', timeSeconds: 68.4, displayTime: '01m 08s', pullups: 6, marks: 50, note: '200m Split Pacing Strategy' },
    { id: '400m-3', trialDate: '31 Aug (W5)', timeSeconds: 64.2, displayTime: '01m 04s', pullups: 8, marks: 68, note: 'Lactate Tolerance Push' },
    { id: '400m-4', trialDate: '14 Sep (W7)', timeSeconds: 61.5, displayTime: '01m 01s', pullups: 9, marks: 80, note: 'Curve Deceleration Control' },
    { id: '400m-5', trialDate: '28 Sep (W9)', timeSeconds: 58.8, displayTime: '00m 58s', pullups: 10, marks: 92, note: 'Sub-60s Gold Standard' },
    { id: '400m-6', trialDate: '04 Oct (W10)', timeSeconds: 56.4, displayTime: '00m 56s', pullups: 11, marks: 100, note: 'Championship PB - 56.4s' }
  ],
  '800M': [
    { id: '800m-1', trialDate: '03 Aug (W1)', timeSeconds: 162, displayTime: '02m 42s', pullups: 4, marks: 35, note: '800m Mid-Distance Baseline' },
    { id: '800m-2', trialDate: '17 Aug (W3)', timeSeconds: 154, displayTime: '02m 34s', pullups: 6, marks: 50, note: 'Aerobic Pace Calibration' },
    { id: '800m-3', trialDate: '31 Aug (W5)', timeSeconds: 146, displayTime: '02m 26s', pullups: 8, marks: 66, note: 'Lap 2 Sustained Kick' },
    { id: '800m-4', trialDate: '14 Sep (W7)', timeSeconds: 139, displayTime: '02m 19s', pullups: 9, marks: 82, note: 'Negative Split Lap Practice' },
    { id: '800m-5', trialDate: '28 Sep (W9)', timeSeconds: 132, displayTime: '02m 12s', pullups: 10, marks: 90, note: 'Sub-2m15s Benchmark Beat' },
    { id: '800m-6', trialDate: '04 Oct (W10)', timeSeconds: 128, displayTime: '02m 08s', pullups: 11, marks: 100, note: 'District Record PB - 02m 08s' }
  ],
  '1600M': [
    { id: 't1', trialDate: '03 Aug (W1)', timeSeconds: 435, displayTime: '07m 15s', pullups: 4, marks: 32, note: 'Intake Baseline Trial', ditchPass: false, zigzagPass: false },
    { id: 't2', trialDate: '17 Aug (W3)', timeSeconds: 408, displayTime: '06m 48s', pullups: 6, marks: 48, note: 'Endurance Building & Pacing', ditchPass: true, zigzagPass: false },
    { id: 't3', trialDate: '31 Aug (W5)', timeSeconds: 382, displayTime: '06m 22s', pullups: 8, marks: 65, note: 'Lap 3 Aerobic Threshold Push', ditchPass: true, zigzagPass: true },
    { id: 't4', trialDate: '14 Sep (W7)', timeSeconds: 358, displayTime: '05m 58s', pullups: 9, marks: 81, note: 'Sub-6m Milestone Cleared', ditchPass: true, zigzagPass: true },
    { id: 't5', trialDate: '28 Sep (W9)', timeSeconds: 342, displayTime: '05m 42s', pullups: 10, marks: 88, note: 'Army Group 2 Cutoff Cleared', ditchPass: true, zigzagPass: true },
    { id: 't6', trialDate: '04 Oct (W10)', timeSeconds: 324, displayTime: '05m 24s', pullups: 11, marks: 100, note: 'Super-Timed Trial - PB & Grp 1', ditchPass: true, zigzagPass: true }
  ],
  '5KM': [
    { id: '5km-1', trialDate: '03 Aug (W1)', timeSeconds: 1720, displayTime: '28m 40s', pullups: 4, marks: 30, note: 'Purulia Road Run Baseline' },
    { id: '5km-2', trialDate: '17 Aug (W3)', timeSeconds: 1610, displayTime: '26m 50s', pullups: 6, marks: 45, note: 'VO2 Max Cadence Adaptation' },
    { id: '5km-3', trialDate: '31 Aug (W5)', timeSeconds: 1520, displayTime: '25m 20s', pullups: 8, marks: 62, note: '5:04/km Sustained Tempo' },
    { id: '5km-4', trialDate: '14 Sep (W7)', timeSeconds: 1440, displayTime: '24m 00s', pullups: 9, marks: 80, note: 'Official 24m Standard Cleared' },
    { id: '5km-5', trialDate: '28 Sep (W9)', timeSeconds: 1370, displayTime: '22m 50s', pullups: 10, marks: 90, note: 'Sub-23m Tactical Pace' },
    { id: '5km-6', trialDate: '04 Oct (W10)', timeSeconds: 1305, displayTime: '21m 45s', pullups: 11, marks: 100, note: 'Elite Road PB - 21m 45s' }
  ],
  '10KM': [
    { id: '10km-1', trialDate: '03 Aug (W1)', timeSeconds: 3780, displayTime: '63m 00s', pullups: 4, marks: 30, note: 'Cross-Country Baseline Run' },
    { id: '10km-2', trialDate: '17 Aug (W3)', timeSeconds: 3540, displayTime: '59m 00s', pullups: 6, marks: 45, note: 'Sub-60m Milestone Crossed' },
    { id: '10km-3', trialDate: '31 Aug (W5)', timeSeconds: 3360, displayTime: '56m 00s', pullups: 8, marks: 60, note: 'Ayodhya Hills Foot Conditioning' },
    { id: '10km-4', trialDate: '14 Sep (W7)', timeSeconds: 3200, displayTime: '53m 20s', pullups: 9, marks: 78, note: 'High Mileage Aerobic Base' },
    { id: '10km-5', trialDate: '28 Sep (W9)', timeSeconds: 3050, displayTime: '50m 50s', pullups: 10, marks: 88, note: '5:05/km Marathon Pace' },
    { id: '10km-6', trialDate: '04 Oct (W10)', timeSeconds: 2890, displayTime: '48m 10s', pullups: 11, marks: 100, note: 'Commando Standard - 48m 10s' }
  ]
};

export interface ForceStandard {
  name: string;
  shortLabel: string;
  runTargetSeconds: number;
  runTargetDisplay: string;
  runMaxSeconds: number;
  pullupsTarget: number;
  qualifyingMarks: number;
  group1Seconds?: number;
  group2Seconds?: number;
}

export const TARGET_STANDARDS: Record<TargetForceKey, ForceStandard> = {
  ARMY_GD: {
    name: 'Indian Army Soldier GD (ARO Rally)',
    shortLabel: 'Army GD',
    runTargetSeconds: 330, // 5m 30s
    runTargetDisplay: '05m 30s (Group 1 - 60 Pts)',
    runMaxSeconds: 345,    // 5m 45s (Group 2 - 48 Pts)
    pullupsTarget: 10,     // 40 Pts
    qualifyingMarks: 60,
    group1Seconds: 330,
    group2Seconds: 345
  },
  WB_POLICE: {
    name: 'West Bengal Police Constable / SI (PRB)',
    shortLabel: 'WB Police',
    runTargetSeconds: 390, // 6m 30s
    runTargetDisplay: '06m 30s (Qualifying)',
    runMaxSeconds: 400,
    pullupsTarget: 8,
    qualifyingMarks: 50
  },
  RPF_CONSTABLE: {
    name: 'Railway Protection Force (RPF Constable)',
    shortLabel: 'RPF Constable',
    runTargetSeconds: 345, // 5m 45s
    runTargetDisplay: '05m 45s (PET Standard)',
    runMaxSeconds: 355,
    pullupsTarget: 10,
    qualifyingMarks: 60
  },
  SSC_GD: {
    name: 'SSC GD Central Armed Police Forces (BSF / CRPF / CISF)',
    shortLabel: 'SSC CAPF',
    runTargetSeconds: 360, // Normalized 1600m standard
    runTargetDisplay: '06m 00s (PST/PET Index)',
    runMaxSeconds: 380,
    pullupsTarget: 8,
    qualifyingMarks: 50
  }
};

export const DEFAULT_TRIAL_HISTORY: TrialDataPoint[] = [
  { id: 't1', trialDate: '03 Aug (W1)', timeSeconds: 435, displayTime: '07m 15s', pullups: 4, marks: 32, note: 'Intake Baseline Trial', ditchPass: false, zigzagPass: false },
  { id: 't2', trialDate: '17 Aug (W3)', timeSeconds: 408, displayTime: '06m 48s', pullups: 6, marks: 48, note: 'Endurance Building & Pacing', ditchPass: true, zigzagPass: false },
  { id: 't3', trialDate: '31 Aug (W5)', timeSeconds: 382, displayTime: '06m 22s', pullups: 8, marks: 65, note: 'Lap 3 Aerobic Threshold Push', ditchPass: true, zigzagPass: true },
  { id: 't4', trialDate: '14 Sep (W7)', timeSeconds: 358, displayTime: '05m 58s', pullups: 9, marks: 81, note: 'Sub-6m Milestone Cleared', ditchPass: true, zigzagPass: true },
  { id: 't5', trialDate: '28 Sep (W9)', timeSeconds: 342, displayTime: '05m 42s', pullups: 10, marks: 88, note: 'Army Group 2 Cutoff Cleared', ditchPass: true, zigzagPass: true },
  { id: 't6', trialDate: '04 Oct (W10)', timeSeconds: 324, displayTime: '05m 24s', pullups: 11, marks: 100, note: 'Super-Timed Trial - PB & Grp 1', ditchPass: true, zigzagPass: true }
];

export interface StudentProgressVisualizerProps {
  data?: TrialDataPoint[];
  cadetId?: string;
  studentName?: string;
  initialForce?: TargetForceKey;
  defaultCategory?: RunCategoryKey;
  onExportReport?: () => void;
  className?: string;
}

export function StudentProgressVisualizer({
  data,
  cadetId,
  studentName = 'Enlisted Cadet',
  initialForce = 'ARMY_GD',
  defaultCategory = '1600M',
  onExportReport,
  className = ''
}: StudentProgressVisualizerProps) {
  const [selectedForce, setSelectedForce] = useState<TargetForceKey>(initialForce);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('1600M_RUN');
  const [selectedCategory, setSelectedCategory] = useState<RunCategoryKey>(defaultCategory);
  const [liveTrials, setLiveTrials] = useState<TrialDataPoint[]>([]);

  const standard = TARGET_STANDARDS[selectedForce];
  const activeCategorySpec = RUN_CATEGORY_SPECS[selectedCategory];

  // Fetch authentic logged trials for this cadet in this category
  React.useEffect(() => {
    let active = true;
    if (!cadetId) {
      setLiveTrials([]);
      return;
    }
    fetchRunTrials(cadetId, selectedCategory).then(res => {
      if (active && Array.isArray(res) && res.length > 0) {
        const mapped: TrialDataPoint[] = res.map(t => ({
          id: t.id,
          trialDate: new Date(t.date || t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          timeSeconds: t.timeSeconds,
          displayTime: t.timeFormatted,
          pullups: t.pullupsCount || 10,
          marks: t.marksPullups ? (t.marks1600m || 60) + t.marksPullups : 80,
          note: t.trainerRemarks || `${t.source === 'TRAINER_DRILL' ? 'Parade Ground Drill' : 'Cadet Self-Training'}`,
          ditchPass: true,
          zigzagPass: true,
          source: t.source
        }));
        setLiveTrials(mapped);
      } else if (active) {
        setLiveTrials([]);
      }
    }).catch(() => {
      if (active) setLiveTrials([]);
    });
    return () => { active = false; };
  }, [cadetId, selectedCategory]);

  // Use authentic records (passed via data or fetched from live database)
  const categoryBaseData = data || [];
  const activeData: TrialDataPoint[] = useMemo(() => {
    if (liveTrials.length > 0) {
      const existingIds = new Set(categoryBaseData.map(d => d.id));
      const freshTrials = liveTrials.filter(t => !existingIds.has(t.id));
      return [...categoryBaseData, ...freshTrials];
    }
    return categoryBaseData;
  }, [categoryBaseData, liveTrials]);

  // Baseline and Current PB calculations
  const baseline = activeData[0];
  const currentBest = useMemo(() => {
    if (!activeData.length) return null;
    return [...activeData].sort((a, b) => a.timeSeconds - b.timeSeconds)[0];
  }, [activeData]);

  const latestTrial = activeData[activeData.length - 1];

  const timeSaved = baseline && latestTrial ? Math.max(0, Number((baseline.timeSeconds - latestTrial.timeSeconds).toFixed(2))) : 0;
  const percentageImprovement = baseline && baseline.timeSeconds > 0
    ? ((timeSaved / baseline.timeSeconds) * 100).toFixed(1)
    : '0';

  const pullupsGained = baseline && latestTrial ? latestTrial.pullups - baseline.pullups : 0;

  const isQualifiedRun = latestTrial ? latestTrial.timeSeconds <= activeCategorySpec.benchmarkSeconds : false;
  const isQualifiedGroup2 = latestTrial && latestTrial.timeSeconds <= activeCategorySpec.maxSeconds;

  const readinessScore = useMemo(() => {
    if (!latestTrial) return 0;
    let score = 0;
    if (latestTrial.timeSeconds <= activeCategorySpec.benchmarkSeconds) {
      score += 60;
    } else if (latestTrial.timeSeconds <= activeCategorySpec.maxSeconds) {
      score += 48;
    } else {
      const gap = latestTrial.timeSeconds - activeCategorySpec.benchmarkSeconds;
      score += Math.max(10, Math.round(48 - gap));
    }
    const pullRatio = Math.min(1, latestTrial.pullups / standard.pullupsTarget);
    score += Math.round(pullRatio * 40);
    return Math.min(100, Math.max(0, score));
  }, [latestTrial, activeCategorySpec, standard]);

  const formatSeconds = (val: number): string => {
    if (val < 60) return `${val.toFixed(1)}s`;
    const mins = Math.floor(val / 60);
    const secs = Math.floor(val % 60);
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`space-y-4 sm:space-y-6 max-w-full overflow-hidden ${className}`}>
      {/* Top Controls & Standard Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#121811] border border-[#273623]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider leading-snug">
              Telemetry Tele-Visualizer & Progression Engine
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Tracking performance kinetics of <strong className="text-gray-200">{studentName}</strong> across separate run categories calibrated against recruitment benchmarks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Target Force Selector */}
          <div className="flex items-center gap-2 bg-[#0B0F0A] px-3 py-2 rounded-xl border border-[#273623] w-full sm:w-auto">
            <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-mono text-gray-400 uppercase flex-shrink-0">Target:</span>
            <select
              value={selectedForce}
              onChange={(e) => setSelectedForce(e.target.value as TargetForceKey)}
              className="bg-transparent text-amber-400 font-display font-bold text-xs uppercase focus:outline-none cursor-pointer w-full truncate"
            >
              <option value="ARMY_GD" className="bg-[#121811] text-amber-400">Indian Army Soldier GD</option>
              <option value="WB_POLICE" className="bg-[#121811] text-amber-400">WB Police Constable / SI</option>
              <option value="RPF_CONSTABLE" className="bg-[#121811] text-amber-400">RPF Constable PET</option>
              <option value="SSC_GD" className="bg-[#121811] text-amber-400">SSC GD CAPF</option>
            </select>
          </div>

          {onExportReport && (
            <button
              onClick={onExportReport}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer w-full sm:w-auto flex-shrink-0"
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Generate PDF Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-[#273623] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedMetric('1600M_RUN')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-display uppercase tracking-wider font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedMetric === '1600M_RUN'
                ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border border-[#273623] hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Timed Runs Telemetry ({activeCategorySpec.short})</span>
          </button>

          <button
            onClick={() => setSelectedMetric('PULLUPS')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-display uppercase tracking-wider font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedMetric === 'PULLUPS'
                ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border border-[#273623] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Beam Pull-ups (Reps)</span>
          </button>

          <button
            onClick={() => setSelectedMetric('TOTAL_MARKS')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-display uppercase tracking-wider font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedMetric === 'TOTAL_MARKS'
                ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border border-[#273623] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Physical Score (100 Pts)</span>
          </button>
        </div>

        {/* Dynamic Legend / Standard Indicator */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block flex-shrink-0" />
            <span>Cadet Timing</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-0.5 bg-rose-500 inline-block flex-shrink-0" />
            <span>Benchmark ({activeCategorySpec.benchmarkFormatted})</span>
          </div>
        </div>
      </div>

      {/* 6 Run Categories Switcher Bar */}
      {selectedMetric === '1600M_RUN' && (
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0E140C] border border-[#273623] flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x">
          <span className="text-[10px] font-mono uppercase text-gray-500 pl-2 pr-1 flex-shrink-0">
            Run Category:
          </span>
          {(['100M', '400M', '800M', '1600M', '5KM', '10KM'] as RunCategoryKey[]).map(catKey => {
            const spec = RUN_CATEGORY_SPECS[catKey];
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-[#121811] text-gray-400 border border-[#1A2415] hover:text-white hover:border-[#273623]'
                }`}
              >
                <span>{spec.icon}</span>
                <span>{spec.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({spec.benchmarkFormatted})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* KPI Performance Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Baseline Card */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#121811] border border-[#273623]">
          <div className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-500 truncate">
            {activeCategorySpec.short} Baseline (W1)
          </div>
          <div className="text-lg sm:text-xl font-display font-black text-gray-300 mt-1">
            {baseline ? baseline.displayTime : '--'}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono mt-0.5 truncate">
            Pull-ups: {baseline?.pullups} reps
          </div>
        </div>

        {/* Current PB Card */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#121811] border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="text-[9px] sm:text-[10px] font-mono uppercase text-amber-400 font-bold truncate">
            {activeCategorySpec.short} Personal Best (PB)
          </div>
          <div className="text-lg sm:text-xl font-display font-black text-amber-400 mt-1">
            {currentBest ? currentBest.displayTime : '--'}
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono font-bold mt-0.5 flex items-center gap-1 truncate">
            <TrendingDown className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">-{timeSaved}s ({percentageImprovement}%)</span>
          </div>
        </div>

        {/* Pull-ups Strength Card */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#121811] border border-[#273623]">
          <div className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-500 truncate">Beam Pull-ups Max</div>
          <div className="text-lg sm:text-xl font-display font-black text-white mt-1">
            {latestTrial ? `${latestTrial.pullups} Reps` : '--'}
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono font-bold mt-0.5 flex items-center gap-1 truncate">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">+{pullupsGained} reps gain</span>
          </div>
        </div>

        {/* Target Qualification Index */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#121811] border border-[#273623]">
          <div className="text-[9px] sm:text-[10px] font-mono uppercase text-gray-500 truncate">
            {activeCategorySpec.short} Benchmark Cutoff
          </div>
          <div className="text-lg sm:text-xl font-display font-black mt-1">
            {isQualifiedRun ? (
              <span className="text-emerald-400">QUALIFIED</span>
            ) : isQualifiedGroup2 ? (
              <span className="text-amber-400">GRP 2 PASS</span>
            ) : (
              <span className="text-rose-400">MARGINAL</span>
            )}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono mt-0.5 truncate">
            Readiness: <strong className="text-amber-400">{readinessScore}/100</strong>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider leading-snug">
              {selectedMetric === '1600M_RUN' && `${activeCategorySpec.label} Timing Progression (Seconds vs Benchmark)`}
              {selectedMetric === 'PULLUPS' && 'Strict Undergrip Beam Pull-ups Progression (Reps)'}
              {selectedMetric === 'TOTAL_MARKS' && 'Physical Efficiency Total Score (Points out of 100)'}
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-sans mt-0.5 leading-relaxed">
              {selectedMetric === '1600M_RUN' && `Benchmark target for ${activeCategorySpec.label}: ${activeCategorySpec.benchmarkFormatted}. Lower curve represents faster time.`}
              {selectedMetric === 'PULLUPS' && `Target for 40/40 full marks: ${standard.pullupsTarget} strict chin-over-bar repetitions.`}
              {selectedMetric === 'TOTAL_MARKS' && `Official combined marks (Run + Pull-ups + Ditch + Beam). Minimum passing: ${standard.qualifyingMarks} Pts.`}
            </p>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
          {activeData.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#273623] rounded-2xl bg-[#0B0F0A]">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/30">
                <Timer className="w-6 h-6" />
              </div>
              <h5 className="font-display font-bold text-white text-base">No Recorded Field Trials Yet</h5>
              <p className="text-xs font-mono text-gray-400 max-w-md mt-1">
                No official trials logged for {activeCategorySpec.label} yet. Timings logged during morning parade drills or stopwatch runs will plot here automatically.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === '1600M_RUN' ? (
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="papiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2415" />
                <XAxis
                  dataKey="trialDate"
                  stroke="#64748B"
                  fontSize={11}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  fontFamily="monospace"
                  domain={[activeCategorySpec.yMin, activeCategorySpec.yMax]}
                  tickFormatter={activeCategorySpec.formatTick}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as TrialDataPoint;
                      const deltaSecs = baseline ? Number((baseline.timeSeconds - d.timeSeconds).toFixed(2)) : 0;
                      const deltaPct = baseline && baseline.timeSeconds > 0
                        ? ((deltaSecs / baseline.timeSeconds) * 100).toFixed(1)
                        : '0';

                      return (
                        <div className="bg-[#0B0F0A] p-3.5 rounded-xl border border-amber-500/60 shadow-2xl text-xs font-mono space-y-1.5 min-w-[210px]">
                          <div className="text-amber-400 font-bold flex items-center justify-between">
                            <span>{d.trialDate}</span>
                            <span className="text-[10px] text-gray-400">{d.note}</span>
                          </div>
                          <div className="text-white text-base font-display font-black">
                            Time: {d.displayTime} ({activeCategorySpec.formatTooltip(d.timeSeconds)})
                          </div>
                          <div className="border-t border-[#273623] pt-1.5 space-y-1 text-[11px]">
                            <div className="text-emerald-400 flex items-center justify-between">
                              <span>From Baseline:</span>
                              <span className="font-bold">-{deltaSecs}s ({deltaPct}%)</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-300">
                              <span>Cutoff Status:</span>
                              <span className={`font-bold ${d.timeSeconds <= activeCategorySpec.benchmarkSeconds ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {d.timeSeconds <= activeCategorySpec.benchmarkSeconds ? 'Benchmark Cleared' : 'Marginal'}
                              </span>
                            </div>
                            {d.source && (
                              <div className="flex items-center justify-between text-gray-400 pt-0.5">
                                <span>Source:</span>
                                <span className="font-mono text-amber-300">{d.source}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={activeCategorySpec.benchmarkSeconds}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Cutoff: ${activeCategorySpec.benchmarkFormatted}`,
                    fill: '#EF4444',
                    fontSize: 11,
                    position: 'top',
                    fontFamily: 'monospace'
                  }}
                />
                {activeCategorySpec.maxSeconds && activeCategorySpec.maxSeconds !== activeCategorySpec.benchmarkSeconds && (
                  <ReferenceLine
                    y={activeCategorySpec.maxSeconds}
                    stroke="#F59E0B"
                    strokeDasharray="3 3"
                    label={{
                      value: `Grp 2 Cutoff (${formatSeconds(activeCategorySpec.maxSeconds)})`,
                      fill: '#F59E0B',
                      fontSize: 10,
                      position: 'insideBottomRight'
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="timeSeconds"
                  name={`${activeCategorySpec.label} Time`}
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#papiGradient)"
                />
              </AreaChart>
            ) : selectedMetric === 'PULLUPS' ? (
              <BarChart data={activeData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2415" />
                <XAxis dataKey="trialDate" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 14]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as TrialDataPoint;
                      return (
                        <div className="bg-[#0B0F0A] p-3 rounded-xl border border-emerald-500/60 shadow-xl text-xs font-mono">
                          <div className="text-emerald-400 font-bold">{d.trialDate}</div>
                          <div className="text-white text-base font-display font-black">
                            Pull-ups: {d.pullups} Reps
                          </div>
                          <div className="text-gray-400 text-[11px] mt-1">
                            Benchmark Target: {standard.pullupsTarget} reps ({d.pullups >= standard.pullupsTarget ? 'Maximum 40 Marks' : `${d.pullups * 4} Marks`})
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={standard.pullupsTarget}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Full Marks Target (${standard.pullupsTarget} reps)`,
                    fill: '#10B981',
                    fontSize: 11,
                    position: 'top',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar dataKey="pullups" name="Beam Pull-ups" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={activeData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2415" />
                <XAxis dataKey="trialDate" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as TrialDataPoint;
                      return (
                        <div className="bg-[#0B0F0A] p-3 rounded-xl border border-amber-500/60 shadow-xl text-xs font-mono">
                          <div className="text-amber-400 font-bold">{d.trialDate}</div>
                          <div className="text-white text-base font-display font-black">
                            Aggregate: {d.marks} / 100 Points
                          </div>
                          <div className="text-gray-300 text-[11px] mt-1">
                            Grade: {d.marks >= 80 ? 'EXCELLENT' : d.marks >= 60 ? 'GOOD' : 'NEEDS PRACTICE'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={standard.qualifyingMarks}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: `Passing Qualifying (${standard.qualifyingMarks} Pts)`,
                    fill: '#F59E0B',
                    fontSize: 11,
                    position: 'top',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar dataKey="marks" name="Physical Marks" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>

      {/* Trial Assessment Table Breakdown */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
              {activeCategorySpec.label} • Timed Trial Log & Evolution History
            </h4>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              Benchmark Target: {activeCategorySpec.benchmarkFormatted} | Distance: {activeCategorySpec.distanceMeters}m
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-[#0B0F0A] px-3 py-1.5 rounded-xl border border-[#273623]">
            {activeData.length} Trials Recorded
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-1 sm:mx-0 px-1 sm:px-0">
          <table className="w-full text-left text-xs font-mono min-w-[560px]">
            <thead>
              <tr className="border-b border-[#273623] text-gray-400">
                <th className="py-3 px-4">Trial Sequence</th>
                <th className="py-3 px-4">Stopwatch Time</th>
                <th className="py-3 px-4">Benchmark Cutoff</th>
                <th className="py-3 px-4">Source / Type</th>
                <th className="py-3 px-4">Score / Status</th>
                <th className="py-3 px-4">Tactical Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A2415]">
              {activeData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500 font-mono text-xs">
                    0 trials recorded for {activeCategorySpec.label}. Timing logs will list chronologically once completed.
                  </td>
                </tr>
              ) : (
                activeData.map((trial, idx) => {
                  const isCleared = trial.timeSeconds <= activeCategorySpec.benchmarkSeconds;
                  return (
                    <tr key={trial.id} className="hover:bg-[#161F15]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1A2415] text-amber-400 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{trial.trialDate}</span>
                      </td>
                    <td className="py-3 px-4 text-amber-400 font-bold">
                      {trial.displayTime}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {activeCategorySpec.benchmarkFormatted}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        trial.source === 'CADET_SELF_TRAINING'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {trial.source === 'CADET_SELF_TRAINING' ? 'Self Training' : 'Official Drill'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCleared
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isCleared ? 'Passed Cutoff' : 'Marginal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {trial.note}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
