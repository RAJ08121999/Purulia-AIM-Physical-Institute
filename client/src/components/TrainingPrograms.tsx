import React from 'react';
import { Shield, Compass, Target, Users, Flame, Award, ArrowRight } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

interface Program {
  title: string;
  forceCategory: string;
  iconColor: string;
  description: string;
  focusAreas: string[];
  schedule: string;
}

const programs: Program[] = [
  {
    title: 'Indian Army Agniveer GD, Tech & Tradesman',
    forceCategory: 'Indian Army Strike Wing',
    iconColor: 'from-amber-500 to-amber-700',
    description: 'High-intensity battlefield preparation for Agniveer rally rounds. Focused on securing Group 1 (≤ 5m 30s) 60/60 marks in 1600m run and flawless 10 dead-hang beam pull-ups for full 100/100 physical score.',
    focusAreas: ['1600m Sub-5:30 Group 1 Pacing (60/60 Marks)', '10 Strict Dead-Hang Beam Pull-ups (40/40 Marks)', '9-Foot Ditch Crossing Clearance', 'Military Zig-Zag Balance Beam Drill'],
    schedule: 'Stand-To 05:00 hrs – 08:00 hrs. (Mon–Sat)'
  },
  {
    title: 'West Bengal Police & Kolkata Police SI / Constable',
    forceCategory: 'State Police Services',
    iconColor: 'from-blue-600 to-indigo-800',
    description: 'Specialized track conditioning for WBP and KP Physical Efficiency Tests (PET). Precision split-lap management tailored for both male and female aspirants.',
    focusAreas: ['1600m Male Pacing (6m 30s Benchmark)', '800m Female & SI Sprint (3m 00s Standard)', 'PST Height & Chest Expansion (82-87cm)', 'Explosive Stride & Core Conditioning'],
    schedule: 'Stand-To 05:30 hrs – 08:30 hrs. (Mon–Sat)'
  },
  {
    title: 'Railway Protection Force (RPF & RPSF) Wing',
    forceCategory: 'Ministry of Railways',
    iconColor: 'from-emerald-600 to-teal-800',
    description: 'Comprehensive physical conditioning for RPF Sub-Inspector and Constable recruitment trials including technical long jump runway dynamics and high jump clearing.',
    focusAreas: ['14-Foot Long Jump Runway Dynamics', '4-Foot High Jump Scissor & Fosbury Drills', '1600m / 800m Calibrated Pacing', 'Sprint Acceleration Cadence'],
    schedule: 'Stand-To 06:00 hrs – 08:30 hrs. (Tue, Thu, Sat)'
  },
  {
    title: 'Paramilitary Strike Wing (SSC GD & CAPF)',
    forceCategory: 'BSF • CRPF • CISF • ITBP • SSB • AR',
    iconColor: 'from-orange-600 to-amber-700',
    description: 'Mission-focused endurance regimen for central armed police forces requiring 5.0 km continuous road endurance running under 24 minutes.',
    focusAreas: ['5.0 km Continuous Road Endurance Run', 'Aerobic Rhythm & Hydration Protocol', 'Incline Road March & Pack Endurance', 'Joint & Knee Resilience Protocols'],
    schedule: 'Stand-To 05:00 hrs – 07:45 hrs. (Mon, Wed, Fri)'
  },
  {
    title: 'Indian Navy & Indian Air Force (Agniveer SSR/MR & Vayu)',
    forceCategory: 'Naval & Air Wings',
    iconColor: 'from-sky-500 to-blue-700',
    description: 'Specialized physical fitness regimen for Agniveer Vayu & Agniveer SSR/MR physical efficiency tests including cadence-controlled push-ups and squats.',
    focusAreas: ['1.6 km Aerobic PFT Cadence (Sub-6:30)', '20 Strict Military Squats (Uthak Baithak)', '10 Controlled Military Push-ups', 'PST Chest Expansion & Posture'],
    schedule: 'Stand-To 05:00 hrs – 07:30 hrs. (Daily)'
  },
  {
    title: 'Sunday Super-Timed BPET Simulation (All Cadets)',
    forceCategory: 'Regimental Assessment',
    iconColor: 'from-red-600 to-amber-600',
    description: 'Weekly full-scale simulation trial where all cadets run the 1600m track under calibrated stopwatch timing with telemetry breakdown by Ex-Army Hav. Anup Sir.',
    focusAreas: ['Calibrated Stopwatch Lap Telemetry (400m Track)', 'Rally Crowd & Starter Pressure Conditioning', 'Immediate Gap Analysis & Form Review', 'Roll of Honour Merit Recognition'],
    schedule: 'Stand-To 05:30 hrs. (Every Sunday)'
  }
];

export const TrainingPrograms: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((prog, idx) => (
        <div
          key={idx}
          className="p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                {prog.forceCategory}
              </span>
              <Badge variant="army" size="sm">
                100% Free
              </Badge>
            </div>

            <h4 className="text-xl font-display font-black text-white uppercase tracking-wide group-hover:text-amber-300 transition-colors">
              {prog.title}
            </h4>

            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              {prog.description}
            </p>

            {/* Focus points */}
            <div className="space-y-1.5 pt-2 border-t border-[#1A2415]">
              <div className="text-[11px] font-mono text-gray-500 uppercase font-bold">Key Drills:</div>
              <ul className="space-y-1 text-xs text-gray-300">
                {prog.focusAreas.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-amber-500">▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1A2415] flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="text-lime-400">{prog.schedule}</span>
            <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
              Join Drill →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
