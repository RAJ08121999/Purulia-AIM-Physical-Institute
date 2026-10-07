'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Flame,
  Award,
  Target,
  FileCheck2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { TrainingPrograms } from '@/components/TrainingPrograms';
import { SectionHeading, Badge, Button, KineticButton } from '@/components/ui';

export default function ProgramsPage() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      <Navbar onApplyClick={() => setAdmissionModalOpen(true)} />

      <main className="flex-1">
        {/* Page Header */}
        <section className="relative py-14 sm:py-20 border-b border-[#273623] bg-gradient-to-b from-[#141C10] via-[#0E140C] to-[#0B0F0A] overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#4B6135]/20 blur-[140px] pointer-events-none rounded-full" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge variant="army" size="md">
                Recruitment Conditioning Wings
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                Regimental Training Wings
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Specialized physical training curriculums calibrated against official Physical Efficiency Tests (PET) and Physical Standard Tests (PST) of the Indian Army, Paramilitary forces, and State Police services.
              </p>
            </div>
          </div>
        </section>

        {/* Training Programs Component Section */}
        <section className="py-14 sm:py-20 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Tactical Disciplines"
              title="Tailored Drills For Every Armed Force"
              highlightWord="Armed Force"
              subtitle="Select your recruitment target to view the exact physical qualifications, qualifying times, and daily drill routines."
            />
            <div className="mt-10">
              <TrainingPrograms />
            </div>
          </div>
        </section>

        {/* Weekly Regimental Timetable Section */}
        <section className="py-14 sm:py-20 border-b border-[#273623] bg-[#0E140C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <SectionHeading
              badge="Daily Routine Orders (DRO)"
              title="Weekly Regimental Training Matrix"
              highlightWord="Matrix"
              subtitle="A 6-day phased conditioning schedule balancing aerobic endurance, anaerobic threshold, core torque, and tactical obstacle clearance."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  day: 'Monday • 05:00am hrs',
                  title: 'Aerobic Base & 5km Road Tempo',
                  desc: 'Long steady distance run through Purulia road track to build capillary density and low-impact cardiovascular endurance.',
                  target: '5.0 km Continuous • Pace: 4m45s/km'
                },
                {
                  day: 'Tuesday • 05:00am hrs',
                  title: '400m Track Interval Laps',
                  desc: '8x 400m repeat intervals on the J.K. College track with 90s recovery to train lactate threshold clearance.',
                  target: 'Lap Pace: 68s - 72s / lap'
                },
                {
                  day: 'Wednesday • 05:00am hrs',
                  title: 'Pull-up Beam & Upper Torso Cadence',
                  desc: 'Strict dead-hang vertical chin-up sets, negative holds, dips, rope climbs, and core abdominal conditioning.',
                  target: '10 Strict Pull-ups & 50 Push-ups'
                },
                {
                  day: 'Thursday • 05:00am hrs',
                  title: 'Battlefield Obstacles & Ditch Jumps',
                  desc: '9-foot ditch clearance techniques, zig-zag balance log runs, monkey crawl, and high vault drills.',
                  target: '100% Faultless Clearance'
                },
                {
                  day: 'Friday • 05:00am hrs',
                  title: '800m Pacing & Anaerobic Sprint Finish',
                  desc: 'Speed acceleration mechanics, explosive start drill from stand, and 100m sprint intervals for police & army GD.',
                  target: '100m in 12.0s • 800m in 02m30s'
                },
                {
                  day: 'Saturday • 05:30 hrs',
                  title: 'Official Sunday Super-Timed BPET Trial',
                  desc: 'Full simulated army recruitment rally trial under official stopwatch conditions with digital telemetry recording.',
                  target: '1600m Sub-5m30s Group 1 Cutoff'
                }
              ].map((schedule, idx) => (
                <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] space-y-3 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                      {schedule.day}
                    </span>
                    <Badge variant="army" size="sm">
                      Phase {idx + 1}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-white uppercase">
                    {schedule.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    {schedule.desc}
                  </p>
                  <div className="pt-2 border-t border-[#1E2B1A] text-[11px] font-mono text-emerald-400 font-semibold">
                    Target: {schedule.target}
                  </div>
                </div>
              ))}
            </div>

            {/* Enlist CTA Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Select Your Target Force and Enlist Today
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  All training wings are 100% free with veteran Indian Army physical coaching.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="saffron"
                  size="lg"
                  onClick={() => setAdmissionModalOpen(true)}
                  className="text-black font-extrabold uppercase font-display"
                >
                  Enlist Cadet (₹0)
                </Button>
                <Link href="/calculator">
                  <Button variant="outline" size="lg">
                    Check BPET Benchmarks
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AdmissionModal isOpen={admissionModalOpen} onClose={() => setAdmissionModalOpen(false)} />
    </div>
  );
}
