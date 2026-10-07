'use client';

import React, { useState } from 'react';
import { Timer, Activity, Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

export const BenchmarkCalculator: React.FC = () => {
  const [targetForce, setTargetForce] = useState<'ARMY_GD' | 'WBP_CONSTABLE' | 'RPF_CONSTABLE' | 'SSC_GD'>('ARMY_GD');
  const [runMinutes, setRunMinutes] = useState(5);
  const [runSeconds, setRunSeconds] = useState(25);
  const [pullUps, setPullUps] = useState(10);
  const [pushUps, setPushUps] = useState(40);
  const [longJumpFeet, setLongJumpFeet] = useState(14);

  // Targets & BPET Standards
  const standards = {
    ARMY_GD: {
      name: 'Indian Army Agniveer GD (BPET Standards)',
      runTargetSec: 330, // 5 min 30 sec (Group 1)
      runGroup2Sec: 345, // 5 min 45 sec (Group 2)
      pullUpsTarget: 10,
      pushUpsTarget: 40,
      longJumpTarget: 14
    },
    WBP_CONSTABLE: {
      name: 'West Bengal Police Constable (PET Standards)',
      runTargetSec: 390, // 6 min 30 sec
      runGroup2Sec: 390,
      pullUpsTarget: 6,
      pushUpsTarget: 30,
      longJumpTarget: 13
    },
    RPF_CONSTABLE: {
      name: 'Railway Protection Force (RPF/RPSF)',
      runTargetSec: 345, // 5 min 45 sec
      runGroup2Sec: 345,
      pullUpsTarget: 8,
      pushUpsTarget: 35,
      longJumpTarget: 14
    },
    SSC_GD: {
      name: 'SSC GD Paramilitary (CAPF 5.0 km)',
      runTargetSec: 1440, // 24 min for 5km
      runGroup2Sec: 1440,
      pullUpsTarget: 8,
      pushUpsTarget: 35,
      longJumpTarget: 13
    }
  };

  const currentStandard = standards[targetForce];
  const userTotalSec = runMinutes * 60 + runSeconds;
  const runDiff = userTotalSec - currentStandard.runTargetSec;
  const isRunQualified = runDiff <= 0;

  // Army Marks Calculation
  const calculateArmyMarks = () => {
    let runMarks = 0;
    if (userTotalSec <= 330) runMarks = 60; // Group 1
    else if (userTotalSec <= 345) runMarks = 48; // Group 2
    else runMarks = 0;

    let beamMarks = 0;
    if (pullUps >= 10) beamMarks = 40;
    else if (pullUps === 9) beamMarks = 33;
    else if (pullUps === 8) beamMarks = 27;
    else if (pullUps === 7) beamMarks = 21;
    else if (pullUps === 6) beamMarks = 16;
    else beamMarks = 0;

    return { runMarks, beamMarks, totalMarks: runMarks + beamMarks };
  };

  const armyScore = calculateArmyMarks();

  return (
    <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] shadow-[0_0_50px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-[#273623]">
        <div>
          <Badge variant="saffron" size="sm">
            BPET Field Telemetry Calculator
          </Badge>
          <h3 className="font-display font-black text-xl sm:text-3xl text-white uppercase tracking-wider mt-2">
            Calculate Your Physical Efficiency (PET) Score
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 font-sans mt-1">
            Evaluate your 1600m stopwatch timing and beam pull-ups against official Indian Armed Forces Group 1 & Group 2 scoring criteria.
          </p>
        </div>

        {/* Force Selector */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
          {(
            [
              { id: 'ARMY_GD', label: 'Indian Army GD' },
              { id: 'WBP_CONSTABLE', label: 'WB Police' },
              { id: 'RPF_CONSTABLE', label: 'RPF' },
              { id: 'SSC_GD', label: 'SSC GD' }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setTargetForce(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider text-xs font-bold transition-all border ${targetForce === tab.id
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'bg-[#0B0F0A] text-gray-400 border-[#273623] hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs & Instant Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {/* Metric 1: 1600m Run */}
        <div className="bg-[#0B0F0A] p-5 rounded-2xl border border-[#273623] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold">1600m Run Time</span>
            <Timer className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 font-mono block">MINUTES</label>
              <input
                type="number"
                min="4"
                max="12"
                value={runMinutes}
                onChange={e => setRunMinutes(Number(e.target.value))}
                className="w-full bg-[#161F15] border border-[#273623] rounded-lg px-3 py-1.5 text-white font-display text-xl font-bold"
              />
            </div>
            <span className="text-xl font-bold text-gray-500 mt-4">:</span>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 font-mono block">SECONDS</label>
              <input
                type="number"
                min="0"
                max="59"
                value={runSeconds}
                onChange={e => setRunSeconds(Number(e.target.value))}
                className="w-full bg-[#161F15] border border-[#273623] rounded-lg px-3 py-1.5 text-white font-display text-xl font-bold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1A2415] text-xs font-mono flex items-center justify-between">
            <span className="text-gray-400">Target: {Math.floor(currentStandard.runTargetSec / 60)}m {currentStandard.runTargetSec % 60}s</span>
            {isRunQualified ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Gap: +{runDiff}s
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Beam Pull-ups */}
        <div className="bg-[#0B0F0A] p-5 rounded-2xl border border-[#273623] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold">Beam Pull-ups</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-mono block">REPETITIONS</label>
            <input
              type="number"
              min="0"
              max="30"
              value={pullUps}
              onChange={e => setPullUps(Number(e.target.value))}
              className="w-full bg-[#161F15] border border-[#273623] rounded-lg px-3 py-1.5 text-white font-display text-xl font-bold"
            />
          </div>

          <div className="pt-2 border-t border-[#1A2415] text-xs font-mono flex items-center justify-between">
            <span className="text-gray-400">Target: {currentStandard.pullUpsTarget} reps</span>
            {pullUps >= currentStandard.pullUpsTarget ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                Need {currentStandard.pullUpsTarget - pullUps} more
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Standard Push-ups */}
        <div className="bg-[#0B0F0A] p-5 rounded-2xl border border-[#273623] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold">Standard Push-ups</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-mono block">REPETITIONS</label>
            <input
              type="number"
              min="0"
              max="100"
              value={pushUps}
              onChange={e => setPushUps(Number(e.target.value))}
              className="w-full bg-[#161F15] border border-[#273623] rounded-lg px-3 py-1.5 text-white font-display text-xl font-bold"
            />
          </div>

          <div className="pt-2 border-t border-[#1A2415] text-xs font-mono flex items-center justify-between">
            <span className="text-gray-400">Target: {currentStandard.pushUpsTarget} reps</span>
            {pushUps >= currentStandard.pushUpsTarget ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                Need {currentStandard.pushUpsTarget - pushUps} more
              </span>
            )}
          </div>
        </div>

        {/* Metric 4: Long Jump */}
        <div className="bg-[#0B0F0A] p-5 rounded-2xl border border-[#273623] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400 font-bold">Long Jump</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-mono block">DISTANCE (FEET)</label>
            <input
              type="number"
              min="5"
              max="25"
              value={longJumpFeet}
              onChange={e => setLongJumpFeet(Number(e.target.value))}
              className="w-full bg-[#161F15] border border-[#273623] rounded-lg px-3 py-1.5 text-white font-display text-xl font-bold"
            />
          </div>

          <div className="pt-2 border-t border-[#1A2415] text-xs font-mono flex items-center justify-between">
            <span className="text-gray-400">Target: {currentStandard.longJumpTarget} ft</span>
            {longJumpFeet >= currentStandard.longJumpTarget ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                Need {(currentStandard.longJumpTarget - longJumpFeet).toFixed(1)} ft
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Official BPET Score Display for Army */}
      {targetForce === 'ARMY_GD' && (
        <div className="mt-6 p-4 rounded-xl bg-[#0B0F0A] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Badge variant="army" size="md">
              Official BPET Score
            </Badge>
            <span className="text-gray-300">
              1600m Run: <strong className="text-amber-400">{armyScore.runMarks}/60 Pts</strong> ({userTotalSec <= 330 ? 'Group 1' : userTotalSec <= 345 ? 'Group 2' : 'Failed Cutoff'}) • Beam: <strong className="text-amber-400">{armyScore.beamMarks}/40 Pts</strong> ({pullUps} reps)
            </span>
          </div>
          <div className="text-sm font-display font-black text-amber-400 uppercase tracking-wider">
            Total Score: {armyScore.totalMarks} / 100 Marks
          </div>
        </div>
      )}

      {/* Summary Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-[#161F15] border border-[#273623] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs sm:text-sm font-sans text-gray-300">
          <span className="text-amber-400 font-bold uppercase font-mono block sm:inline">Drill Instructor Advice:</span>{' '}
          {isRunQualified && pullUps >= currentStandard.pullUpsTarget
            ? 'Cadet is physically on-target for Group 1! Join 05:00am0am hrs morning stand-to to lock in obstacle clearing and maintain pace.'
            : 'Cadet has split-lap or upper-body beam deficits. Our morning 05:00am hrs drill and beam resistance coaching will bridge this gap in 4-6 weeks.'}
        </div>
        <a
          href="#contact"
          className="text-center whitespace-nowrap px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-display uppercase tracking-wider text-xs font-black transition-colors w-full sm:w-auto"
        >
          Report to Ground (₹0)
        </a>
      </div>
    </div>
  );
};
