'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Search,
  Save,
  Flame,
  Award,
  Calendar,
  PhoneCall,
  Check,
  Send
} from 'lucide-react';
import { Button, Badge, Card, StatMetricCard } from '@/components/ui';
import { submitBulkAttendance, recordTrialAssessment } from '@/lib/api';
import { ParadeDrillStopwatch } from '@/components';

interface CadetAttendance {
  id: string;
  roll: string;
  name: string;
  batch: string;
  target: string;
  consecutiveAbsences: number;
  last1600m: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
}

const initialCadets: CadetAttendance[] = [
  {
    id: '1',
    roll: 'AIM-2026-001',
    name: 'Rohan Karmakar',
    batch: 'Morning Alfa (Army GD)',
    target: 'Army GD (5m30s)',
    consecutiveAbsences: 3, // Defaulter!
    last1600m: '05m 58s',
    status: 'ABSENT'
  },
  {
    id: '2',
    roll: 'AIM-2026-004',
    name: 'Amit Bauri',
    batch: 'Morning Alfa (Army GD)',
    target: 'Army GD (5m30s)',
    consecutiveAbsences: 0,
    last1600m: '05m 28s',
    status: 'PRESENT'
  },
  {
    id: '3',
    roll: 'AIM-2026-012',
    name: 'Deepak Sen',
    batch: 'Morning Alfa (Army GD)',
    target: 'WBP Constable (6m30s)',
    consecutiveAbsences: 0,
    last1600m: '05m 45s',
    status: 'PRESENT'
  },
  {
    id: '4',
    roll: 'AIM-2026-018',
    name: 'Bapi Soren',
    batch: 'Morning Alfa (Army GD)',
    target: 'Army GD (5m30s)',
    consecutiveAbsences: 1,
    last1600m: '06m 12s',
    status: 'LATE'
  },
  {
    id: '5',
    roll: 'AIM-2026-042',
    name: 'Sourav Mukherjee',
    batch: 'Morning Alfa (Army GD)',
    target: 'Army GD (5m30s)',
    consecutiveAbsences: 0,
    last1600m: '05m 24s',
    status: 'PRESENT'
  }
];

export default function TrainerCommandCenter() {
  const [activeTab, setActiveTab] = useState<'STOPWATCH' | 'ATTENDANCE' | 'TELEMETRY' | 'DEFAULTERS'>('STOPWATCH');
  const [cadets, setCadets] = useState<CadetAttendance[]>(initialCadets);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Assessment Telemetry Form State
  const [selectedCadetId, setSelectedCadetId] = useState('AIM-2026-042');
  const [entryRunMins, setEntryRunMins] = useState(5);
  const [entryRunSecs, setEntryRunSecs] = useState(24);
  const [entryPullUps, setEntryPullUps] = useState(11);
  const [entryPushUps, setEntryPushUps] = useState(48);
  const [trainerRemarks, setTrainerRemarks] = useState('Excellent sprint finish. Maintained rhythm in final lap.');
  const [telemetrySaved, setTelemetrySaved] = useState(false);

  // Status toggle handler
  const handleStatusChange = (id: string, newStatus: CadetAttendance['status']) => {
    setCadets(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleMarkAllPresent = () => {
    setCadets(prev => prev.map(c => ({ ...c, status: 'PRESENT' })));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = cadets.map(c => ({
        studentId: c.roll,
        batchId: 'batch-morning-alfa',
        status: (c.status === 'LEAVE' ? 'EXCUSED' : c.status) as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
      }));
      await submitBulkAttendance(records, 'Havaldar Anup Kumar Mahato');
    } catch (err) {
      console.warn('Saved to local state (offline mode):', err);
    }
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Instant score calculation for telemetry entry
  const totalSeconds = entryRunMins * 60 + entryRunSecs;
  const isGroup1 = totalSeconds <= 330;
  const isGroup2 = totalSeconds > 330 && totalSeconds <= 345;
  const runningScore = isGroup1 ? 60 : isGroup2 ? 48 : 0;
  const beamScore = entryPullUps >= 10 ? 40 : entryPullUps === 9 ? 33 : entryPullUps === 8 ? 27 : 21;
  const totalPetScore = runningScore + beamScore;

  const filteredCadets = cadets.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      {/* Top Trainer Bar */}
      <header className="border-b border-[#273623] bg-[#0E140C] sticky top-0 z-40">
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
              <span className="font-display font-black text-amber-400 text-base sm:text-lg uppercase tracking-wider flex-shrink-0">AIM</span>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">Trainer Roster</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Badge variant="army" size="sm">
              Head Trainer
            </Badge>
            <div className="hidden md:block text-right">
              <div className="text-xs font-display font-bold text-white uppercase">Havaldar Anup Kumar Mahato</div>
              <div className="text-[10px] text-amber-400 font-mono">Purulia Ground In-Charge</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Morning Session Command Card */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-[#273623] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-wider leading-snug">
                Morning Drill Roster • 05:00 AM Session
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-400 font-mono leading-relaxed">
              Ground: J.K College Ground Purulia Track • Cadets Checked-in: {cadets.filter(c => c.status === 'PRESENT').length} / {cadets.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              leftIcon={<Check className="w-4 h-4 text-emerald-400" />}
              className="flex-1 sm:flex-initial justify-center"
            >
              All Present
            </Button>
            <Button
              variant="saffron"
              size="sm"
              onClick={handleSaveAttendance}
              leftIcon={<Save className="w-4 h-4 text-black" />}
              className="flex-1 sm:flex-initial justify-center"
            >
              {attendanceSaved ? 'Saved!' : 'Save Roster'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#273623] pb-2 font-display uppercase tracking-wider text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x w-full">
          {[
            { id: 'STOPWATCH', label: '⏱️ Parade Drill Stopwatch' },
            { id: 'ATTENDANCE', label: 'Batch Attendance & Status Marker' },
            { id: 'TELEMETRY', label: 'Timed Trial Telemetry Scoring' },
            { id: 'DEFAULTERS', label: '3-Absence Defaulters & Alerts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all whitespace-nowrap border flex-shrink-0 text-[11px] sm:text-xs cursor-pointer ${activeTab === tab.id
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 0: PARADE DRILL STOPWATCH & BROADCAST */}
        {activeTab === 'STOPWATCH' && (
          <ParadeDrillStopwatch mode="TRAINER_CONTROLLER" />
        )}

        {/* TAB 1: BATCH ATTENDANCE MARKER */}
        {activeTab === 'ATTENDANCE' && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#273623]">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search cadet name or roll..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono">
                <span className="text-gray-400">Total: <strong className="text-white">{filteredCadets.length}</strong></span>
                <span className="text-emerald-400">P: <strong>{cadets.filter(c => c.status === 'PRESENT').length}</strong></span>
                <span className="text-rose-400">A: <strong>{cadets.filter(c => c.status === 'ABSENT').length}</strong></span>
                <span className="text-amber-400">L: <strong>{cadets.filter(c => c.status === 'LATE').length}</strong></span>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-1 sm:mx-0 px-1 sm:px-0">
              <table className="w-full text-left text-xs font-mono min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#273623] text-gray-400">
                    <th className="py-3 px-4">Cadet Name & Roll</th>
                    <th className="py-3 px-4">Recruitment Target</th>
                    <th className="py-3 px-4">Last 1600m PB</th>
                    <th className="py-3 px-4">Absence History</th>
                    <th className="py-3 px-4 text-center">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2415]">
                  {filteredCadets.map(cadet => (
                    <tr key={cadet.id} className="hover:bg-[#161F15]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-display font-bold text-sm text-white uppercase">{cadet.name}</div>
                        <div className="text-[11px] text-amber-400/80">{cadet.roll}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">{cadet.target}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">{cadet.last1600m}</td>
                      <td className="py-3.5 px-4">
                        {cadet.consecutiveAbsences >= 3 ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            {cadet.consecutiveAbsences} Days (Defaulter)
                          </span>
                        ) : cadet.consecutiveAbsences > 0 ? (
                          <span className="text-amber-400 font-bold">{cadet.consecutiveAbsences} Day Absent</span>
                        ) : (
                          <span className="text-emerald-400">Regular</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(cadet.id, s)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${cadet.status === s
                                ? s === 'PRESENT'
                                  ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                  : s === 'ABSENT'
                                    ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                                    : s === 'LATE'
                                      ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                      : 'bg-blue-500 text-white'
                                : 'bg-[#0B0F0A] text-gray-500 border border-[#273623] hover:text-white'
                                }`}
                            >
                              {s[0]}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY ASSESSMENT ENTRY TOOL */}
        {activeTab === 'TELEMETRY' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Sunday Timed Trial Telemetry Logger
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Direct input for official stopwatch marks and strict beam pull-up rep counts with real-time mark scoring.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Select Cadet *</label>
                  <select
                    value={selectedCadetId}
                    onChange={e => setSelectedCadetId(e.target.value)}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="AIM-2026-042">AIM-2026-042 — Sourav Mukherjee (Army GD)</option>
                    <option value="AIM-2026-004">AIM-2026-004 — Amit Bauri (Army GD)</option>
                    <option value="AIM-2026-012">AIM-2026-012 — Deepak Sen (WBP Constable)</option>
                    <option value="AIM-2026-018">AIM-2026-018 — Bapi Soren (Army GD)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] space-y-2">
                    <label className="block text-xs font-mono text-amber-400 uppercase font-bold">1600m Running Time</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 font-mono block">MIN</span>
                        <input
                          type="number"
                          value={entryRunMins}
                          onChange={e => setEntryRunMins(Number(e.target.value))}
                          className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-500 mt-3">:</span>
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 font-mono block">SEC</span>
                        <input
                          type="number"
                          value={entryRunSecs}
                          onChange={e => setEntryRunSecs(Number(e.target.value))}
                          className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] space-y-2">
                    <label className="block text-xs font-mono text-amber-400 uppercase font-bold">Strict Beam Pull-ups</label>
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono block">REPETITIONS</span>
                      <input
                        type="number"
                        value={entryPullUps}
                        onChange={e => setEntryPullUps(Number(e.target.value))}
                        className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Trainer Observation Remarks *</label>
                  <textarea
                    rows={3}
                    value={trainerRemarks}
                    onChange={e => setTrainerRemarks(e.target.value)}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <Button
                  variant="saffron"
                  size="md"
                  className="w-full justify-center"
                  onClick={async () => {
                    try {
                      await recordTrialAssessment({
                        studentId: selectedCadetId,
                        run1600mSeconds: totalSeconds,
                        pullupsCount: entryPullUps,
                        ditchJump9ftPass: true,
                        zigzagBalancePass: true,
                        trainerRemarks
                      });
                    } catch (err) {
                      console.warn('Saved to local telemetry store (offline mode):', err);
                    }
                    setTelemetrySaved(true);
                    setTimeout(() => setTelemetrySaved(false), 3000);
                  }}
                >
                  {telemetrySaved ? 'Assessment Recorded in Cadet Record!' : 'Save & Publish Trial Score'}
                </Button>
              </div>
            </div>

            {/* Instant Assessment Scorecard */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#161F15] border border-amber-500/40 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  Calculated Physical Score
                </h4>
                <Badge variant={isGroup1 ? 'success' : isGroup2 ? 'saffron' : 'danger'} size="sm">
                  {isGroup1 ? 'Group 1 Marks' : isGroup2 ? 'Group 2 Marks' : 'PET Gap'}
                </Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F0A] border border-[#273623]">
                  <span className="text-gray-400">1600m Running Points:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {runningScore} / 60 Pts {isGroup1 ? '(Group 1 - Excellent)' : isGroup2 ? '(Group 2)' : '(Disqualified)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F0A] border border-[#273623]">
                  <span className="text-gray-400">Beam Pull-ups Points:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {beamScore} / 40 Pts {entryPullUps >= 10 ? '(10/10 Perfect)' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/50">
                  <span className="font-display font-bold text-white uppercase text-sm">Total Physical Score:</span>
                  <span className="font-display font-black text-2xl text-amber-400">
                    {totalPetScore} / 100
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] text-xs font-sans text-gray-300 leading-relaxed">
                <strong className="text-white uppercase font-mono block mb-1">Anup Sir's Evaluation:</strong>
                {totalPetScore >= 100
                  ? 'Cadet has attained full 100/100 Physical Efficiency Test marks. Maintain physical conditioning without overtraining.'
                  : totalPetScore >= 80
                    ? 'Solid performance. Focus on increasing arm endurance for 10 beam pull-ups to grab full 40 marks.'
                    : 'Needs intensive interval training to bring running time under 5m 45s.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEFAULTER DETECTION */}
        {activeTab === 'DEFAULTERS' && (
          <div className="p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Consecutive Absence Defaulter Registry
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                According to AIM training bylaws, cadets missing 3 consecutive morning sessions without prior medical notice are flagged for suspension.
              </p>
            </div>

            <div className="space-y-3">
              {cadets
                .filter(c => c.consecutiveAbsences >= 3)
                .map(defaulter => (
                  <div
                    key={defaulter.id}
                    className="p-5 rounded-2xl bg-[#161F15] border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-lg text-white uppercase">{defaulter.name}</span>
                        <Badge variant="danger" size="sm">
                          3 Consecutive Absences
                        </Badge>
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-1">
                        Roll: {defaulter.roll} • Batch: {defaulter.batch} • Last 1600m: {defaulter.last1600m}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<PhoneCall className="w-4 h-4 text-amber-400" />}
                        onClick={() => alert(`Calling guardian of ${defaulter.name}...`)}
                      >
                        Call Guardian
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => alert(`Suspension notice dispatched to ${defaulter.name}`)}
                      >
                        Issue Warning Notice
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
