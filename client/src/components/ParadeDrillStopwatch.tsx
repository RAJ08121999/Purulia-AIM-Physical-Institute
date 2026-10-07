'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Shield,
  Lock,
  Unlock,
  User,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Flame,
  Radio,
  Sliders,
  Save,
  Clock,
  Sparkles,
  PowerOff,
  X
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import {
  RunCategoryKey,
  RunCategoryItem,
  LiveDrillSession,
  fetchRunCategories,
  fetchLiveDrillSession,
  controlLiveDrillSession,
  saveRunTrial
} from '@/lib/api';

export interface ParadeDrillStopwatchProps {
  mode: 'TRAINER_CONTROLLER' | 'CADET_VIEWER';
  cadetId?: string;
  cadetRoll?: string;
  cadetName?: string;
  onTrialRecorded?: () => void;
  onClose?: () => void;
  className?: string;
}

export function ParadeDrillStopwatch({
  mode,
  cadetId,
  cadetRoll,
  cadetName = 'Cadet Sourav Mukherjee',
  onTrialRecorded,
  onClose,
  className = ''
}: ParadeDrillStopwatchProps) {
  const activeCadetId = cadetId || cadetRoll || 'AIM-2026-042';
  // Categories & Configuration
  const [categories, setCategories] = useState<RunCategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RunCategoryKey>('1600M');
  const [customDistanceMeters, setCustomDistanceMeters] = useState<number>(1600);
  const [customTargetMins, setCustomTargetMins] = useState<number>(5);
  const [customTargetSecs, setCustomTargetSecs] = useState<number>(30);
  const [customTargetLabel, setCustomTargetLabel] = useState<string>('Group 1 (≤ 05m 30s)');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Live Drill Session (Synchronized from Trainer/Server)
  const [drillSession, setDrillSession] = useState<LiveDrillSession | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Cadet Local Screen Override: allows cadet to dismiss live broadcast on their screen and train solo
  const [cadetDismissedBroadcast, setCadetDismissedBroadcast] = useState(false);
  // User feedback notification
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Local Stopwatch for Cadet Self-Training (when Trainer is IDLE or cadet dismissed)
  const [selfRunning, setSelfRunning] = useState(false);
  const [selfElapsedMs, setSelfElapsedMs] = useState(0);
  const [selfLaps, setSelfLaps] = useState<Array<{ lap: number; ms: number; formatted: string }>>([]);
  const [selfSaved, setSelfSaved] = useState(false);

  // Active display elapsed milliseconds (computed smoothly)
  const [displayElapsedMs, setDisplayElapsedMs] = useState(0);

  // Batch Cadets for Quick Heat Logging (Trainer Mode)
  const sampleRoster = [
    { id: 'AIM-2026-042', name: 'Sourav Mukherjee', roll: 'AIM-ALPHA-01', batch: 'Alfa (Army GD)' },
    { id: 'AIM-2026-004', name: 'Amit Bauri', roll: 'AIM-ALPHA-02', batch: 'Alfa (Army GD)' },
    { id: 'AIM-2026-012', name: 'Deepak Sen', roll: 'AIM-ALPHA-03', batch: 'Alfa (WBP)' },
    { id: 'AIM-2026-018', name: 'Bapi Soren', roll: 'AIM-ALPHA-04', batch: 'Alfa (Army GD)' },
    { id: 'AIM-2026-001', name: 'Rohan Karmakar', roll: 'AIM-ALPHA-05', batch: 'Alfa (Army GD)' }
  ];
  const [loggedCadetIds, setLoggedCadetIds] = useState<Record<string, boolean>>({});

  // 1. Load Standard Categories on mount
  useEffect(() => {
    fetchRunCategories()
      .then(cats => {
        setCategories(cats);
        const defaultCat = cats.find(c => c.key === '1600M');
        if (defaultCat) {
          setCustomDistanceMeters(defaultCat.distanceMeters);
          setCustomTargetMins(Math.floor(defaultCat.targetSeconds / 60));
          setCustomTargetSecs(defaultCat.targetSeconds % 60);
          setCustomTargetLabel(defaultCat.targetLabel);
        }
      })
      .catch(console.error);
  }, []);

  // 2. Poll Live Drill Session every 1.5 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const session = await fetchLiveDrillSession();
        if (isMounted) {
          setDrillSession(session);
        }
      } catch (err) {
        // Silently continue polling
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Reset local dismiss when drill returns to IDLE
  useEffect(() => {
    if (drillSession?.status === 'IDLE') {
      setCadetDismissedBroadcast(false);
    }
  }, [drillSession?.status]);

  // 3. Smooth high-precision stopwatch animation loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (mode === 'TRAINER_CONTROLLER') {
        if (drillSession?.status === 'RUNNING' && drillSession.startedAt) {
          const now = Date.now();
          const elapsed = drillSession.elapsedMs + (now - drillSession.startedAt);
          setDisplayElapsedMs(elapsed);
        } else if (drillSession?.status === 'PAUSED' || drillSession?.status === 'STOPPED') {
          setDisplayElapsedMs(drillSession.elapsedMs);
        } else {
          setDisplayElapsedMs(0);
        }
      } else {
        // CADET_VIEWER MODE
        const isTrainerActiveOnScreen =
          drillSession &&
          (drillSession.status === 'RUNNING' || drillSession.status === 'PAUSED' || drillSession.status === 'STOPPED') &&
          !cadetDismissedBroadcast;

        if (isTrainerActiveOnScreen) {
          if (drillSession.status === 'RUNNING' && drillSession.startedAt) {
            const now = Date.now();
            const elapsed = drillSession.elapsedMs + (now - drillSession.startedAt);
            setDisplayElapsedMs(elapsed);
          } else {
            setDisplayElapsedMs(drillSession.elapsedMs);
          }
        } else {
          // Autonomous self-training timer
          setDisplayElapsedMs(selfElapsedMs);
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [mode, drillSession, selfElapsedMs, cadetDismissedBroadcast]);

  // 4. Autonomous Cadet Self-Training Timer Interval
  useEffect(() => {
    if (mode === 'CADET_VIEWER' && selfRunning) {
      const startLocal = Date.now() - selfElapsedMs;
      const timer = setInterval(() => {
        setSelfElapsedMs(Date.now() - startLocal);
      }, 30);
      return () => clearInterval(timer);
    }
  }, [mode, selfRunning]);

  // Format Elapsed Time: MM:SS.ms
  const formatTime = (totalMs: number) => {
    const totalSecs = Math.floor(totalMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hundredths = Math.floor((totalMs % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  // Switch Category
  const handleSelectCategory = (catKey: RunCategoryKey) => {
    setSelectedCategory(catKey);
    const std = categories.find(c => c.key === catKey);
    if (std) {
      setCustomDistanceMeters(std.distanceMeters);
      setCustomTargetMins(Math.floor(std.targetSeconds / 60));
      setCustomTargetSecs(std.targetSeconds % 60);
      setCustomTargetLabel(std.targetLabel);
    }
    setSelfElapsedMs(0);
    setSelfRunning(false);
    setSelfLaps([]);
  };

  // Trainer Control Handlers
  const handleTrainerAction = async (action: 'START' | 'PAUSE' | 'RESUME' | 'STOP' | 'RESET' | 'LAP' | 'CLOSE') => {
    setIsSyncing(true);
    try {
      const targetSec = customTargetMins * 60 + customTargetSecs;
      const std = categories.find(c => c.key === selectedCategory);
      const catLabel = std?.label || `${customDistanceMeters}m Custom Run`;

      const updated = await controlLiveDrillSession({
        action,
        category: selectedCategory,
        categoryLabel: catLabel,
        distanceMeters: customDistanceMeters,
        targetSeconds: targetSec,
        targetLabel: customTargetLabel,
        trainerName: 'Havaldar Anup Kumar Mahato (Ex-Army)',
        operatorRole: 'TRAINER',
        operatorName: 'Havaldar Anup Kumar Mahato'
      });
      setDrillSession(updated);
      if (action === 'CLOSE') {
        setDisplayElapsedMs(0);
        setActionFeedback({
          message: 'Parade drill stopwatch turned OFF by Chief Drill Instructor.',
          type: 'success'
        });
        if (onClose) onClose();
      } else if (action === 'RESET') {
        setDisplayElapsedMs(0);
      }
    } catch (err) {
      console.error('Failed to dispatch drill action:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Cadet: Stop & Close the Live Drill Session (Broadcast ended for whole academy)
  const handleCadetCloseLiveDrill = async () => {
    setIsSyncing(true);
    try {
      const updated = await controlLiveDrillSession({
        action: 'CLOSE',
        operatorRole: 'CADET',
        operatorName: `${cadetName} (${activeCadetId})`
      });
      setDrillSession(updated);
      setDisplayElapsedMs(0);
      setCadetDismissedBroadcast(false);
      setActionFeedback({
        message: `Live drill stopwatch closed by Cadet ${cadetName}. Parade broadcast terminated.`,
        type: 'success'
      });
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to close drill as cadet:', err);
      // Fallback: dismiss locally so cadet isn't blocked
      setCadetDismissedBroadcast(true);
      setActionFeedback({
        message: 'Could not connect to drill server. Stopwatch dismissed locally.',
        type: 'warning'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Cadet: Close on this device only (returns immediately to personal solo stopwatch)
  const handleCadetDismissLiveView = () => {
    setCadetDismissedBroadcast(true);
    setDisplayElapsedMs(selfElapsedMs);
    setActionFeedback({
      message: 'Stopwatch closed on your device. Switched to Cadet Solo Training mode.',
      type: 'info'
    });
  };

  // Cadet: Rejoin Live Broadcast
  const handleCadetRejoinLiveView = () => {
    setCadetDismissedBroadcast(false);
    setActionFeedback({
      message: 'Reconnected to live parade ground stopwatch broadcast.',
      type: 'success'
    });
  };

  // Cadet Self-Training Handlers
  const handleCadetSelfStart = () => {
    setSelfRunning(true);
    setSelfSaved(false);
  };

  const handleCadetSelfPause = () => {
    setSelfRunning(false);
  };

  const handleCadetSelfReset = () => {
    setSelfRunning(false);
    setSelfElapsedMs(0);
    setSelfLaps([]);
    setSelfSaved(false);
  };

  const handleCadetSelfLap = () => {
    const lapNumber = selfLaps.length + 1;
    const formatted = formatTime(selfElapsedMs);
    setSelfLaps(prev => [...prev, { lap: lapNumber, ms: selfElapsedMs, formatted }]);
  };

  const handleSaveCadetSelfTrial = async () => {
    const totalSecs = Number((selfElapsedMs / 1000).toFixed(2));
    if (totalSecs <= 0) return;

    try {
      const targetSec = customTargetMins * 60 + customTargetSecs;
      await saveRunTrial({
        studentId: activeCadetId,
        studentName: cadetName,
        category: selectedCategory,
        distanceMeters: customDistanceMeters,
        timeSeconds: totalSecs,
        targetSeconds: targetSec,
        source: 'CADET_SELF_TRAINING',
        trainerRemarks: 'Cadet autonomous training stopwatch session'
      });
      setSelfSaved(true);
      if (onTrialRecorded) onTrialRecorded();
    } catch (err) {
      console.error('Failed to save self-trial:', err);
    }
  };

  // Trainer: Quick log heat time for a cadet
  const handleLogCadetFinish = async (cadetItem: { id: string; name: string }) => {
    const totalSecs = Number((displayElapsedMs / 1000).toFixed(2));
    if (totalSecs <= 0) return;

    try {
      const targetSec = customTargetMins * 60 + customTargetSecs;
      await saveRunTrial({
        studentId: cadetItem.id,
        studentName: cadetItem.name,
        category: selectedCategory,
        distanceMeters: customDistanceMeters,
        timeSeconds: totalSecs,
        targetSeconds: targetSec,
        source: 'TRAINER_DRILL',
        trainerRemarks: `Parade drill heat recorded by Hav. Anup Sir (${selectedCategory})`
      });
      setLoggedCadetIds(prev => ({ ...prev, [cadetItem.id]: true }));
      if (onTrialRecorded) onTrialRecorded();
    } catch (err) {
      console.error('Failed to log cadet finish:', err);
    }
  };

  const isServerDrillRunning =
    Boolean(drillSession && (drillSession.status === 'RUNNING' || drillSession.status === 'PAUSED' || drillSession.status === 'STOPPED'));

  const isTrainerDrillActive =
    Boolean(isServerDrillRunning && (!cadetDismissedBroadcast || mode === 'TRAINER_CONTROLLER'));

  const currentCategoryObj = categories.find(c => c.key === selectedCategory);
  const targetTotalSecs = customTargetMins * 60 + customTargetSecs;

  return (
    <div className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#0E140C] border border-[#273623] shadow-2xl space-y-6 ${className}`}>
      {/* -----------------------------------------------------------------
          TOP HEADER & STATUS INDICATOR
          ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#273623]">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex-shrink-0">
            <Timer className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                {mode === 'TRAINER_CONTROLLER' ? 'Parade Ground Drill Stopwatch & Broadcast' : 'Regimental Drill & Training Stopwatch'}
              </h3>
              {mode === 'TRAINER_CONTROLLER' ? (
                <Badge variant="saffron" size="sm">
                  Drill Master
                </Badge>
              ) : isTrainerDrillActive ? (
                <Badge variant="danger" size="sm" pulse>
                  Live Parade Sync
                </Badge>
              ) : (
                <Badge variant="army" size="sm">
                  Self-Training
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              {mode === 'TRAINER_CONTROLLER'
                ? 'Chief Drill Instructor control terminal. Starting timer broadcasts live telemetry. Can be closed by Instructor or Cadets.'
                : isTrainerDrillActive
                ? '🔴 Synchronized live broadcast from Chief Drill Instructor Havaldar Anup Kumar Mahato. Authorized for closure by both Cadets and Trainers.'
                : 'Cadet self-training mode: practice solo sprints, laps, and endurance runs when drill master is off-air.'}
            </p>
          </div>
        </div>

        {/* Status Beacon & Dual Closure Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs flex-wrap">
          {mode === 'TRAINER_CONTROLLER' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121811] border border-[#273623]">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  drillSession?.status === 'RUNNING'
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                    : drillSession?.status === 'PAUSED'
                    ? 'bg-amber-400'
                    : drillSession?.status === 'STOPPED'
                    ? 'bg-rose-400'
                    : 'bg-gray-500'
                }`}
              />
              <span className="text-gray-300 uppercase font-bold">
                {drillSession?.status || 'IDLE'}
              </span>
            </div>
          ) : isTrainerDrillActive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-500/50 text-rose-300">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span className="font-bold">PARADE BROADCAST ON-AIR</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121811] border border-[#273623] text-gray-400">
              <User className="w-3.5 h-3.5 text-lime-400" />
              <span>Solo Self-Training</span>
            </div>
          )}

          {/* TRAINER: Close Stopwatch Button */}
          {mode === 'TRAINER_CONTROLLER' && drillSession && drillSession.status !== 'IDLE' && (
            <button
              onClick={() => handleTrainerAction('CLOSE')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              title="Close and turn OFF parade drill stopwatch"
            >
              <PowerOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Close Stopwatch</span>
            </button>
          )}

          {/* CADET: Dual Close Controls */}
          {mode === 'CADET_VIEWER' && isTrainerDrillActive && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCadetCloseLiveDrill}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                title="Stop & Close Live Stopwatch for All Cadets"
              >
                <PowerOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Close Stopwatch</span>
              </button>
              <button
                onClick={handleCadetDismissLiveView}
                className="p-1 rounded-full bg-[#162014] hover:bg-[#202E1D] text-gray-400 hover:text-white border border-[#273623] text-xs transition-colors cursor-pointer"
                title="Close on my screen only"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* CADET: Solo Mode Quick Reset */}
          {mode === 'CADET_VIEWER' && !isTrainerDrillActive && (selfRunning || selfElapsedMs > 0) && (
            <button
              onClick={handleCadetSelfReset}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182316] hover:bg-[#22331F] text-gray-300 border border-[#2B3B26] text-xs font-bold transition-all cursor-pointer"
              title="Reset Personal Stopwatch"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* -----------------------------------------------------------------
          ACTION FEEDBACK & LOCAL DISMISSAL BANNERS
          ----------------------------------------------------------------- */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-xl flex items-center justify-between gap-3 text-xs font-mono border animate-in fade-in duration-200 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : actionFeedback.type === 'warning'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-[#151D14] border-[#273623] text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-gray-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* CADET LOCAL OVERRIDE BANNER */}
      {mode === 'CADET_VIEWER' && cadetDismissedBroadcast && isServerDrillRunning && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
            <span>
              <strong>Drill Master Broadcast is ON-AIR:</strong> Personal view closed. You are in Solo Self-Training mode.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCadetRejoinLiveView}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-[11px] hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            >
              <Radio className="w-3 h-3" />
              <span>Re-sync Live Drill</span>
            </button>
            <button
              onClick={handleCadetCloseLiveDrill}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <PowerOff className="w-3 h-3" />
              <span>Close Drill for All</span>
            </button>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          CATEGORY SELECTOR TABS (100m, 400m, 800m, 1600m, 5km, 10km)
          ----------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400 font-bold uppercase tracking-wider">
            Select Training Run Category ({categories.length} Regimental Disciplines):
          </span>
          {mode === 'TRAINER_CONTROLLER' && (
            <button
              onClick={() => setShowConfigModal(!showConfigModal)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showConfigModal ? 'Close Customizer' : 'Customize Distance & Cutoffs'}</span>
            </button>
          )}
        </div>

        {/* Scrollable Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-2 w-full">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                disabled={mode === 'CADET_VIEWER' && isTrainerDrillActive}
                onClick={() => handleSelectCategory(cat.key)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all whitespace-nowrap border flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span>{cat.label}</span>
                <span className="block text-[10px] font-mono opacity-80 font-normal">
                  {cat.targetFormatted}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -----------------------------------------------------------------
          TRAINER DISTANCE & TARGET TIMING CUSTOMIZER ACCORDION
          ----------------------------------------------------------------- */}
      {mode === 'TRAINER_CONTROLLER' && showConfigModal && (
        <div className="p-4 rounded-2xl bg-[#121811] border border-amber-500/40 space-y-4 font-mono text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#273623] pb-2">
            <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Trainer Calibration: Distance & Target Cutoffs</span>
            </span>
            <span className="text-[11px] text-gray-400">Reflects across all cadet profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 uppercase text-[10px] mb-1">
                Custom Distance (Meters)
              </label>
              <input
                type="number"
                min="50"
                max="42195"
                step="50"
                value={customDistanceMeters}
                onChange={e => setCustomDistanceMeters(Number(e.target.value))}
                className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 uppercase text-[10px] mb-1">
                Target Benchmark Timing (Mins : Secs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={customTargetMins}
                  onChange={e => setCustomTargetMins(Number(e.target.value))}
                  className="w-16 bg-[#0B0F0A] border border-[#273623] rounded-lg px-2.5 py-2 text-white font-bold text-sm text-center focus:border-amber-500 outline-none"
                />
                <span className="text-gray-400 font-bold">:</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customTargetSecs}
                  onChange={e => setCustomTargetSecs(Number(e.target.value))}
                  className="w-16 bg-[#0B0F0A] border border-[#273623] rounded-lg px-2.5 py-2 text-white font-bold text-sm text-center focus:border-amber-500 outline-none"
                />
                <span className="text-gray-400 text-[11px]">
                  ({customTargetMins * 60 + customTargetSecs}s)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 uppercase text-[10px] mb-1">
                Qualifying Label / Grade Title
              </label>
              <input
                type="text"
                value={customTargetLabel}
                onChange={e => setCustomTargetLabel(e.target.value)}
                placeholder="e.g. Group 1 Cutoff (≤ 05m 30s)"
                className="w-full bg-[#0B0F0A] border border-[#273623] rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          BIG MILITARY DIGITAL STOPWATCH DISPLAY
          ----------------------------------------------------------------- */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#070A06] via-[#0B0F0A] to-[#0E140C] border-2 border-amber-500/40 p-5 sm:p-8 text-center space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Ambient Top Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-16 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header telemetry badge inside display */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A2415] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              {currentCategoryObj?.label || `${customDistanceMeters}m Run`}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Distance: <strong className="text-white">{customDistanceMeters}m</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Target Standard:</span>
            <span className="text-lime-400 font-bold bg-[#141C10] px-2.5 py-0.5 rounded border border-lime-500/30">
              {customTargetLabel}
            </span>
          </div>
        </div>

        {/* LED Counter Display */}
        <div className="py-2 sm:py-4">
          <div className="font-mono font-black text-5xl sm:text-7xl md:text-8xl tracking-wider text-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.45)] select-none">
            {formatTime(displayElapsedMs)}
          </div>
          <div className="text-[11px] sm:text-xs font-mono text-gray-500 tracking-widest uppercase mt-2">
            Minutes : Seconds . Milliseconds
          </div>
        </div>

        {/* Live Synchronized Broadcast Status (Authorized for Dual Closure by Both Cadets and Trainers) */}
        {mode === 'CADET_VIEWER' && isTrainerDrillActive && (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-left">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
              <span>
                <strong>Parade Ground Live Drill Synchronized:</strong> Live telemetry streaming from Chief Drill Instructor Hav. Anup Sir. <em>Both Cadets and Trainers can stop or close this stopwatch.</em>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] text-gray-400 font-sans">Cadet Clearance:</span>
              <Badge variant="army" size="sm">
                Dual Closure Enabled
              </Badge>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            STOPWATCH CONTROLS
            ----------------------------------------------------------------- */}
        <div className="pt-2">
          {mode === 'TRAINER_CONTROLLER' ? (
            /* TRAINER CONTROLS (Full Write Authority + Close Control) */
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              {drillSession?.status === 'RUNNING' ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleTrainerAction('PAUSE')}
                    leftIcon={<Pause className="w-5 h-5 text-amber-400" />}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Pause Drill
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleTrainerAction('LAP')}
                    leftIcon={<Flag className="w-5 h-5 text-lime-400" />}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Split Lap ({drillSession.laps.length + 1})
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleTrainerAction('STOP')}
                    className="flex-1 sm:flex-initial justify-center font-bold"
                  >
                    Stop Drill Heat
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleTrainerAction('CLOSE')}
                    leftIcon={<PowerOff className="w-4 h-4 text-rose-400" />}
                    className="flex-1 sm:flex-initial justify-center border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                    title="Close and turn OFF parade stopwatch"
                  >
                    Close Stopwatch
                  </Button>
                </>
              ) : drillSession?.status === 'PAUSED' ? (
                <>
                  <Button
                    variant="saffron"
                    size="lg"
                    onClick={() => handleTrainerAction('RESUME')}
                    leftIcon={<Play className="w-5 h-5 text-black" />}
                    className="flex-1 sm:flex-initial justify-center font-bold"
                  >
                    Resume Drill
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleTrainerAction('STOP')}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Stop Heat
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleTrainerAction('RESET')}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => handleTrainerAction('CLOSE')}
                    leftIcon={<PowerOff className="w-4 h-4" />}
                    className="flex-1 sm:flex-initial justify-center font-bold"
                  >
                    Close Stopwatch
                  </Button>
                </>
              ) : (
                /* IDLE or STOPPED */
                <>
                  <Button
                    variant="saffron"
                    size="lg"
                    onClick={() => handleTrainerAction('START')}
                    leftIcon={<Play className="w-5 h-5 text-black" />}
                    className="flex-1 sm:flex-initial justify-center text-black font-extrabold px-8 py-3.5 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                  >
                    Turn ON & Start Parade Drill
                  </Button>
                  {displayElapsedMs > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleTrainerAction('RESET')}
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                        className="flex-1 sm:flex-initial justify-center"
                      >
                        Clear & Reset
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleTrainerAction('CLOSE')}
                        leftIcon={<PowerOff className="w-4 h-4 text-rose-400" />}
                        className="flex-1 sm:flex-initial justify-center border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                      >
                        Close Stopwatch
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : !isTrainerDrillActive ? (
            /* CADET SELF-TRAINING CONTROLS (Cadet Autonomous Session) */
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              {selfRunning ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCadetSelfPause}
                    leftIcon={<Pause className="w-5 h-5 text-amber-400" />}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCadetSelfLap}
                    leftIcon={<Flag className="w-5 h-5 text-lime-400" />}
                    className="flex-1 sm:flex-initial justify-center"
                  >
                    Split Lap ({selfLaps.length + 1})
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="saffron"
                    size="lg"
                    onClick={handleCadetSelfStart}
                    leftIcon={<Play className="w-5 h-5 text-black" />}
                    className="flex-1 sm:flex-initial justify-center text-black font-bold"
                  >
                    {selfElapsedMs > 0 ? 'Resume Run' : 'Start Solo Run'}
                  </Button>
                  {selfElapsedMs > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleCadetSelfReset}
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                        className="flex-1 sm:flex-initial justify-center"
                      >
                        Reset
                      </Button>
                      <Button
                        variant="army"
                        size="lg"
                        onClick={handleSaveCadetSelfTrial}
                        leftIcon={<Save className="w-4 h-4 text-lime-400" />}
                        className="flex-1 sm:flex-initial justify-center font-bold"
                      >
                        {selfSaved ? 'Logged to Profile!' : 'Log Self-Training Trial'}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            /* CADET CONTROLS WHEN LIVE PARADE DRILL IS ACTIVE (Dual Closure Clearance) */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleCadetCloseLiveDrill}
                  leftIcon={<PowerOff className="w-4 h-4" />}
                  className="flex-1 sm:flex-initial justify-center font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer"
                >
                  Stop & Close Live Stopwatch (All)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCadetDismissLiveView}
                  leftIcon={<X className="w-4 h-4 text-gray-400" />}
                  className="flex-1 sm:flex-initial justify-center cursor-pointer border-[#384F32] hover:bg-[#1C2619] text-gray-200"
                >
                  Close on My Screen (Switch to Solo)
                </Button>
              </div>
              <p className="text-[11px] font-mono text-gray-400 text-center">
                Cadet authorization active: You can stop & close the parade drill stopwatch for all cadets, or close it on this screen only to run personal training drills.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* -----------------------------------------------------------------
          SPLIT LAPS RECORD TABLE
          ----------------------------------------------------------------- */}
      {((mode === 'TRAINER_CONTROLLER' && drillSession?.laps && drillSession.laps.length > 0) ||
        (mode === 'CADET_VIEWER' && !isTrainerDrillActive && selfLaps.length > 0) ||
        (mode === 'CADET_VIEWER' && isTrainerDrillActive && drillSession?.laps && drillSession.laps.length > 0)) && (
        <div className="p-4 rounded-2xl bg-[#121811] border border-[#273623] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#273623] pb-2 text-gray-400">
            <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" />
              <span>Registered Split Laps</span>
            </span>
            <span>Interval Telemetry</span>
          </div>

          <div className="overflow-x-auto no-scrollbar touch-pan-x">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1A2415] text-gray-500">
                  <th className="py-2 px-3">Lap</th>
                  <th className="py-2 px-3">Split Time</th>
                  <th className="py-2 px-3">Lap Pace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2415]">
                {(isTrainerDrillActive || mode === 'TRAINER_CONTROLLER'
                  ? drillSession?.laps || []
                  : selfLaps.map(l => ({
                      lapNumber: l.lap,
                      splitFormatted: l.formatted,
                      label: `Lap ${l.lap}`,
                      splitTimeMs: l.ms
                    }))
                ).map((lap, idx) => (
                  <tr key={idx} className="hover:bg-[#161F15]/50">
                    <td className="py-2 px-3 text-amber-400 font-bold">{lap.label}</td>
                    <td className="py-2 px-3 text-white font-bold">{lap.splitFormatted}</td>
                    <td className="py-2 px-3 text-gray-400">
                      {idx === 0
                        ? lap.splitFormatted
                        : 'Recorded Split'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          TRAINER QUICK HEAT CADET ROSTER ASSIGNMENT
          ----------------------------------------------------------------- */}
      {mode === 'TRAINER_CONTROLLER' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121811] border border-[#273623] space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#273623] pb-2">
            <div>
              <h4 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider">
                Log Heat Telemetry to Cadets Dossiers ({selectedCategory})
              </h4>
              <p className="text-[11px] text-gray-400 font-sans">
                Assign current stopwatch timing ({formatTime(displayElapsedMs)}) to cadets in Morning Alfa batch with 1 tap.
              </p>
            </div>
            <Badge variant="army" size="sm">
              Morning Alfa Batch
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {sampleRoster.map(cadet => {
              const isLogged = loggedCadetIds[cadet.id];
              return (
                <div
                  key={cadet.id}
                  className="p-3 rounded-xl bg-[#0B0F0A] border border-[#273623] flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">{cadet.name}</div>
                    <div className="text-[10px] text-gray-500">{cadet.roll}</div>
                  </div>

                  <button
                    disabled={isLogged || displayElapsedMs === 0}
                    onClick={() => handleLogCadetFinish(cadet)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isLogged
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold'
                    }`}
                  >
                    {isLogged ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Logged</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        <span>Record Time</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
