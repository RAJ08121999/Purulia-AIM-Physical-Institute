'use client';

import React, { useState } from 'react';
import { Award, Shield, CheckCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Cadet {
  name: string;
  force: string;
  year: string;
  regimentOrDistrict: string;
  time1600m: string;
  village: string;
  quote: string;
}

const cadets: Cadet[] = [
  {
    name: 'Subrata Roy',
    force: 'Indian Army',
    year: '2024',
    regimentOrDistrict: '17th Kumaon Regiment (Agniveer GD)',
    time1600m: '05m 12s (Grp 1 • 60 Pts)',
    village: 'Manbazar, Purulia',
    quote: 'From zero running endurance to 05m 12s under Havaldar Anup Sir. Cleared Group 1 with full 100/100 physical marks.'
  },
  {
    name: 'Rakesh Mahato',
    force: 'West Bengal Police',
    year: '2024',
    regimentOrDistrict: 'Special Task Force (STF) Cadre',
    time1600m: '05m 55s (PET Pass)',
    village: 'Balarampur, Purulia',
    quote: 'AIM parade ground instilled true military discipline into me. Cleared 1600m run and physical standard test on my first attempt.'
  },
  {
    name: 'Priyanka Das',
    force: 'Kolkata Police',
    year: '2023',
    regimentOrDistrict: '1st Special Armed Police (SAP) Battalion',
    time1600m: '03m 42s (800m Sprint)',
    village: 'Jhalda, Purulia',
    quote: 'Anup Sir motivated rural girls from Purulia to assemble at 05:00am hrs stand-to and master sprint stride cadence.'
  },
  {
    name: 'Bikram Hembram',
    force: 'Railway Protection Force',
    year: '2023',
    regimentOrDistrict: 'RPF Quick Reaction Team (Adra Div)',
    time1600m: '05m 28s (Full Marks)',
    village: 'Kashipur, Purulia',
    quote: 'Flawless coaching for 14-foot long jump takeoff dynamics and the high jump bar that eliminated most aspirants.'
  },
  {
    name: 'Tanmoy Banerjee',
    force: 'Indian Air Force',
    year: '2024',
    regimentOrDistrict: 'Agniveer Vayu (Airframe Tech)',
    time1600m: '05m 20s (PFT Group 1)',
    village: 'Purulia Town',
    quote: 'The weekly Sunday timed BPET trials made the actual military rally at Panagarh feel like standard morning drill.'
  },
  {
    name: 'Sunil Soren',
    force: 'SSC GD (BSF)',
    year: '2023',
    regimentOrDistrict: '143rd BSF Battalion (Border Patrol)',
    time1600m: '21m 40s (5.0 km March)',
    village: 'Bandwan, Purulia',
    quote: '5.0 km road march in 40°C heat was grueling, but Anup Sir’s pack conditioning drills carried me through effortlessly.'
  }
];

export const WallOfFame: React.FC = () => {
  const [selectedForce, setSelectedForce] = useState('ALL');

  const filtered = cadets.filter(c => {
    if (selectedForce === 'ALL') return true;
    return c.force.includes(selectedForce);
  });

  return (
    <div className="space-y-6">
      {/* Force Filter */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-2">
        {[
          { id: 'ALL', label: 'All Recruits' },
          { id: 'Army', label: 'Indian Army' },
          { id: 'Police', label: 'Police Forces' },
          { id: 'Railway', label: 'RPF / RPSF' },
          { id: 'Air Force', label: 'Air Force' },
          { id: 'SSC', label: 'Paramilitary' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedForce(f.id)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg font-display uppercase tracking-wider text-xs font-bold transition-all whitespace-nowrap border ${selectedForce === f.id
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of Cadets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((cadet, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden min-w-0"
          >
            <div className="space-y-3 min-w-0 w-full">
              <div className="flex items-start justify-between gap-2.5 min-w-0 w-full">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-wide group-hover:text-amber-300 transition-colors truncate">
                    {cadet.name}
                  </h4>
                  <div
                    className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1.5 mt-0.5 min-w-0 w-full"
                    title={`${cadet.force} • ${cadet.regimentOrDistrict}`}
                  >
                    <Shield className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    <span className="truncate block min-w-0">{cadet.force} • {cadet.regimentOrDistrict}</span>
                  </div>
                </div>
                <Badge variant="saffron" size="sm" className="flex-shrink-0 ml-1">
                  {cadet.year}
                </Badge>
              </div>

              <p className="text-xs text-gray-300 italic font-sans leading-relaxed pt-2 border-t border-[#1A2415]">
                "{cadet.quote}"
              </p>
            </div>

            <div className="mt-4 sm:mt-5 pt-3 border-t border-[#1A2415] flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-2 min-w-0">
              <span className="truncate">{cadet.village}</span>
              <span className="text-emerald-400 font-bold bg-[#1A2415] px-2 py-0.5 rounded border border-[#273623] flex-shrink-0">
                Trial: {cadet.time1600m}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
