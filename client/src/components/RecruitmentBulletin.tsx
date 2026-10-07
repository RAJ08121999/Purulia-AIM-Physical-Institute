'use client';

import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

interface Recruitment {
  id: string;
  force: string;
  title: string;
  posts: string;
  status: 'ACTIVE' | 'UPCOMING' | 'CLOSED';
  lastDate: string;
  physicalStandards: string[];
  officialPdfUrl: string;
}

const mockRecruitments: Recruitment[] = [
  {
    id: 'army-agniveer-2026',
    force: 'Indian Army Regimental HQ',
    title: 'Indian Army Agniveer GD & Tech Rally Order 2026',
    posts: '25,000+ Vacancies • Pan India Rally',
    status: 'ACTIVE',
    lastDate: '30-Oct-2026',
    physicalStandards: [
      '1600m Run: Group 1 ≤ 05m 30s (60/60 Marks), Group 2 05m 31s–05m 45s (48 Marks)',
      '10 Dead-Hang Beam Pull-ups: 10 Reps (40/40 Marks)',
      '9-Foot Ditch Crossing Jump & Zig-Zag Balancing Beam (Compulsory Pass)',
      'PST: Height 169 cm (GD), Chest 77 cm (+5 cm expansion)'
    ],
    officialPdfUrl: '#'
  },
  {
    id: 'wbp-constable-2026',
    force: 'West Bengal Police Directorate',
    title: 'WBP Constable & Lady Constable Direct Recruitment Order',
    posts: '11,749 Posts • State Force Roster',
    status: 'ACTIVE',
    lastDate: '15-Nov-2026',
    physicalStandards: [
      'Male PET: 1600m Run in 06 min 30 sec (Qualifying)',
      'Female PET: 800m Run in 04 min 00 sec',
      'PST: Height 167 cm (Male), 160 cm (Female), Chest 78 cm (+5 cm expansion)'
    ],
    officialPdfUrl: '#'
  },
  {
    id: 'rpf-si-constable-2026',
    force: 'Railway Protection Force',
    title: 'RPF / RPSF Sub-Inspector & Constable Directive 2026',
    posts: '4,660 Posts • Ministry of Railways',
    status: 'UPCOMING',
    lastDate: 'Gazette Release Nov 2026',
    physicalStandards: [
      'Constable PET: 1600m in 05m 45s, 14-ft Long Jump, 4-ft High Jump',
      'Sub-Inspector PET: 1600m in 06m 30s, 12-ft Long Jump, 3-ft 9-in High Jump',
      'Strict Electronic Chip Stopwatch & Laser Runway Measurement'
    ],
    officialPdfUrl: '#'
  },
  {
    id: 'ssc-gd-capf-2026',
    force: 'Central Armed Police Forces (CAPF)',
    title: 'SSC GD Constable (BSF, CISF, CRPF, SSB, ITBP, Assam Rifles)',
    posts: '39,481 Posts • Central Paramilitary',
    status: 'ACTIVE',
    lastDate: '31-Dec-2026',
    physicalStandards: [
      'Male PET: 5.0 km Continuous Endurance Run in 24 minutes',
      'Female PET: 1.6 km Run in 08 minutes 30 seconds',
      'PST: Height 170 cm (Male), 157 cm (Female), Chest 80 cm (+5 cm expansion)'
    ],
    officialPdfUrl: '#'
  },
  {
    id: 'kp-si-2026',
    force: 'Kolkata Police Command',
    title: 'Kolkata Police Sub-Inspector / Sergeant Cadre',
    posts: '500+ Posts • Metro Command',
    status: 'CLOSED',
    lastDate: 'Rally Concluded',
    physicalStandards: [
      'Male PET: 800m Run in 03 minutes flat',
      'PST: Height 167 cm, Chest 79 cm (+5 cm expansion)',
      'High Jump & Long Jump Technical Qualification'
    ],
    officialPdfUrl: '#'
  }
];

export const RecruitmentBulletin: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'UPCOMING'>('ALL');

  const filtered = mockRecruitments.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-2">
        {(['ALL', 'ACTIVE', 'UPCOMING'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 sm:px-4 py-2 rounded-lg font-display uppercase tracking-wider text-xs font-bold transition-all whitespace-nowrap border ${filter === tab
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white hover:border-gray-600'
              }`}
          >
            {tab === 'ALL' ? 'All Routine Orders (SRO)' : `${tab} Orders`}
          </button>
        ))}
      </div>

      {/* Grid of Recruitment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-4 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all space-y-4 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  {item.force}
                </span>
                <h4 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-wide group-hover:text-amber-300 transition-colors mt-0.5">
                  {item.title}
                </h4>
              </div>
              <Badge
                variant={
                  item.status === 'ACTIVE'
                    ? 'success'
                    : item.status === 'UPCOMING'
                      ? 'saffron'
                      : 'default'
                }
                size="sm"
                pulse={item.status === 'ACTIVE'}
              >
                {item.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 py-1 border-y border-[#1A2415]">
              <div className="flex items-center gap-1.5 text-lime-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>{item.posts}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Deadline: {item.lastDate}</span>
              </div>
            </div>

            {/* Mandatory Physical Benchmarks */}
            <div className="space-y-1.5 bg-[#0B0F0A] p-3.5 rounded-xl border border-[#273623]">
              <div className="text-[11px] font-mono uppercase text-gray-400 font-bold tracking-wider">
                Official Physical Efficiency Test (PET):
              </div>
              <ul className="space-y-1 text-xs text-gray-300">
                {item.physicalStandards.map((std, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">▸</span>
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-gray-400">
                Free AIM Ground Training Available
              </span>
              <a
                href={item.officialPdfUrl}
                onClick={e => {
                  e.preventDefault();
                  alert(`Official notification syllabus & standard for ${item.title} is pinned at AIM notice board.`);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Official PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
