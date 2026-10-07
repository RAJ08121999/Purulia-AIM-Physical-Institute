'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Camera,
  Compass,
  Calendar,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  X,
  Maximize2,
  Download,
  Users,
  Award,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge, Button, ShimmerBadge } from '@/components/ui';

interface GalleryItem {
  id: string;
  title: string;
  category: 'TRACK' | 'BEAM' | 'OBSTACLES' | 'FELICITATION' | 'LADY_CADETS' | 'SUNDAY_TRIAL';
  categoryLabel: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  telemetry: string;
  description: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 'sunday-trial-panoramic',
    title: 'Sunday Open Super-Timed Trial Start Line',
    category: 'SUNDAY_TRIAL',
    categoryLabel: 'Sunday Open Trials',
    imageUrl: '/assets/images/cadets_sunday_trial.jpg',
    date: '24-Dec-2025',
    time: '05:30 hrs. IST Stand-To',
    location: 'J.K. College Ground, Purulia',
    instructor: 'Havaldar Anup Kumar Mahato (Ex-Army)',
    telemetry: '100+ Cadets Assembled • Electronic Chip & Stopwatch Timing',
    description: 'Weekly full-scale simulation trial where rural Bengal aspirants experience the high pressure and start-gun cadence of official Indian Army rally rounds.'
  },
  {
    id: '1600m-track-sprint',
    title: '1600m Battle Physical Efficiency (BPET) Sprint',
    category: 'TRACK',
    categoryLabel: '1600m Track Telemetry',
    imageUrl: '/assets/images/cadets_1600m_track.jpg',
    date: '02-Oct-2026',
    time: '05:15 hrs. IST First Light',
    location: 'J.K. College 400m Cinder Track, Purulia',
    instructor: 'Havaldar Anup Kumar Mahato (Ex-Army)',
    telemetry: 'Group 1 Pace (Sub-5:30 Target • 60/60 Marks)',
    description: 'Aspirants executing calibrated lap-by-lap split pacing during the morning first-light drill to secure the coveted Army Group 1 qualification cutoff.'
  },
  {
    id: 'strict-beam-pullups',
    title: 'Strict Dead-Hang Beam Pull-Ups Drill',
    category: 'BEAM',
    categoryLabel: 'Beam & Calisthenics',
    imageUrl: '/assets/images/cadets_beam_pullups.jpg',
    date: '28-Sep-2026',
    time: '06:00 hrs. IST Dawn Drill',
    location: 'AIM Outdoor Beam Rig, Purulia Ground',
    instructor: 'Havaldar Anup Kumar Mahato & Senior Ustads',
    telemetry: '10 Strict Repetitions Target (40/40 Marks)',
    description: 'Military pull-up training with zero body swing and complete chin clearance above the horizontal bar, building maximum upper-body rally strength.'
  },
  {
    id: '9ft-ditch-clearing',
    title: '9-Foot Ditch Crossing Obstacle Jump',
    category: 'OBSTACLES',
    categoryLabel: 'Battlefield Obstacles',
    imageUrl: '/assets/images/cadets_obstacle_jump.jpg',
    date: '15-Sep-2026',
    time: '06:45 hrs. IST Obstacle Session',
    location: 'Standard Sand Pit, Purulia District Stadium',
    instructor: 'Havaldar Anup Kumar Mahato (Ex-Army)',
    telemetry: 'Compulsory Army Obstacle • 100% Clearance Rate',
    description: 'Cadets practicing run-up momentum and takeoff angle over the regulation 9-foot sand ditch to overcome fear and guarantee zero-foul qualification.'
  },
  {
    id: 'felicitation-recruits',
    title: 'Roll of Honour Felicitation Ceremony',
    category: 'FELICITATION',
    categoryLabel: 'Roll of Honour Ceremonies',
    imageUrl: '/assets/images/cadets_felicitation.jpg',
    date: '15-Aug-2026',
    time: '09:00 hrs. IST National Ceremony',
    location: 'J.K. College Pavilion Grounds, Purulia',
    instructor: 'Havaldar Anup Kumar Mahato (Ex-Army)',
    telemetry: '14 Recruits Commissioned • Army & Police Uniforms',
    description: 'Ex-Army Havaldar Anup Kumar Mahato honoring newly inducted recruits of Indian Army and West Bengal Police with the national tricolor and sweets before departure to regimental training centers.'
  },
  {
    id: 'lady-cadet-squad',
    title: 'Lady Cadet Contingent Speed Acceleration',
    category: 'LADY_CADETS',
    categoryLabel: 'Lady Cadets Contingent',
    imageUrl: '/assets/images/cadets_lady_squad.jpg',
    date: '20-Sep-2026',
    time: '05:45 hrs. IST Morning Stand-To',
    location: 'Purulia District Stadium Track',
    instructor: 'Havaldar Anup Kumar Mahato & Physical Instructor S. Roy',
    telemetry: '800m Sprint Under 03:00 min (KP / WBP PET Target)',
    description: 'Dedicated female defence aspirants from rural Purulia, Bankura, and Jhargram drilling sprint stride frequency and aerobic endurance for Police and Paramilitary recruitments.'
  }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryData.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#070A06] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-amber-400">Regimental Visual Archive</span>
        </div>

        {/* Page Hero Header */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141C10] via-[#0E140C] to-[#070A06] border border-[#273623] p-5 sm:p-12 mb-8 sm:mb-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <ShimmerBadge icon={<Camera className="w-4 h-4 text-amber-400" />}>
                OFFICIAL REGIMENTAL ARCHIVE • PURULIA AIM
              </ShimmerBadge>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
              GALLERY OF DISCIPLINE & VICTORY.
            </h1>

            <p className="text-xs sm:text-base text-gray-300 font-sans leading-relaxed">
              Photographic documentation of daily morning stand-to drills, calibrated stopwatch telemetry, obstacle clearances, and Roll of Honour felicitation ceremonies at J.K. College Ground Purulia under <strong className="text-white">ex-Army Havaldar Anup Kumar Mahato</strong>.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#273623] text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[10px]">TOTAL SESSIONS</span>
                <span className="text-amber-400 font-bold text-sm sm:text-base">3,000+ Drills</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">GROUNDS</span>
                <span className="text-white font-bold text-sm sm:text-base">J.K. College & Stadium</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">RECRUITS</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">100+ Recruits</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">COST</span>
                <span className="text-amber-300 font-bold text-sm sm:text-base">100% Free Lifetime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto no-scrollbar touch-pan-x pb-2">
          {[
            { id: 'ALL', label: 'All Dispatches' },
            { id: 'SUNDAY_TRIAL', label: 'Sunday Trials' },
            { id: 'TRACK', label: '1600m Track' },
            { id: 'BEAM', label: 'Pull-Up Beam' },
            { id: 'OBSTACLES', label: '9-Ft Ditch' },
            { id: 'FELICITATION', label: 'Felicitations' },
            { id: 'LADY_CADETS', label: 'Lady Cadets' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === tab.id
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white hover:border-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group cursor-pointer rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image Container with overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>

                {/* Badges Over Image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-[#273623] text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {item.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-gray-300 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {item.time}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Text Card Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-wide group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A2415] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-lime-400 text-[11px] font-bold">
                    <Shield className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    <span className="truncate">{item.telemetry}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto bg-[#0E140C] border border-[#273623] rounded-2xl sm:rounded-3xl shadow-2xl space-y-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-6 border-b border-[#273623] bg-[#141C10]">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    {lightboxItem.categoryLabel}
                  </span>
                  <h3 className="font-display font-black text-base sm:text-xl text-white uppercase tracking-wide">
                    {lightboxItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A2415] transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Full Image */}
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Telemetry Dossier Panel */}
              <div className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#070A06] border border-[#273623]">
                  <div>
                    <span className="text-gray-500 text-[10px] block">PARADE GROUND:</span>
                    <span className="text-white font-bold">{lightboxItem.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">MUSTER TIMING:</span>
                    <span className="text-amber-400 font-bold">{lightboxItem.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">SUPERVISOR:</span>
                    <span className="text-white font-bold">{lightboxItem.instructor}</span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#141C10] border border-amber-500/30 text-gray-300 space-y-2 font-sans text-xs sm:text-sm">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Drill Specification & Tactical Observation:
                  </div>
                  <p className="leading-relaxed">{lightboxItem.description}</p>
                  <div className="pt-2 text-xs font-mono text-lime-400 font-bold">
                    Official Telemetry: {lightboxItem.telemetry}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
