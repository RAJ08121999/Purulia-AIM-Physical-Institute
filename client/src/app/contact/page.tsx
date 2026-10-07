'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Shield,
  Compass,
  Calendar,
  CheckCircle2,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { SectionHeading, Badge, Button, KineticButton } from '@/components/ui';

export default function ContactPage() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      <Navbar onApplyClick={() => setAdmissionModalOpen(true)} />

      <main className="flex-1">
        {/* Page Header */}
        <section className="relative py-14 sm:py-20 border-b border-[#273623] bg-gradient-to-b from-[#141C10] via-[#0E140C] to-[#0B0F0A] overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge variant="army" size="md">
                Parade Grounds & Duty Room
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                Parade Ground & Contact HQ
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                No appointment needed. Turn up in PT uniform (running shoes and track pants) at 05:00am hrs IST sharp at J.K. College Ground, Purulia. Walk-ins are unconditionally welcomed.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Ground & Muster Details */}
        <section className="py-14 sm:py-20 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-start">
              <div className="space-y-6">
                <SectionHeading
                  badge="Parade Grounds & Muster"
                  title="Parade Ground & Daily Routine Orders (DRO)"
                  highlightWord="Orders"
                  subtitle="Assemble at 05:00am hrs IST at the ground. Veteran instructors lead every session with stopwatch precision."
                />

                <div className="space-y-4 pt-2">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display font-bold text-white text-lg uppercase">
                        J.K. College Ground Purulia
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        J.K. College Road Purulia, Purulia, West Bengal - 723101. Standard 400m cinder track with regulation pull-up beam bar facility, 9-ft ditch pit, and zig-zag balance logs.
                      </p>
                      <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Landmark: 1.2 km from Purulia Railway Junction</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] flex items-start gap-4">
                    <Clock className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display font-bold text-white text-lg uppercase">
                        Daily Routine Orders (DRO) Schedule
                      </h3>
                      <div className="text-xs text-gray-400 mt-1 font-mono space-y-1.5">
                        <div>First Light Stand-To: 05:00am hrs – 08:30am hrs IST (Endurance & 1600m Pacing)</div>
                        <div>Evening Muster Drill: 04:30pm hrs – 06:30pm hrs IST (Beam Pull-ups & Core Strength)</div>
                        <div className="text-lime-400 font-bold">Sunday Super-Timed BPET Trial: 05:30 hrs IST Sharp</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-[#121811] border border-[#273623] flex items-start gap-4">
                    <PhoneCall className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display font-bold text-white text-lg uppercase">
                        Regimental Duty Room & Helpline
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Direct assistance for candidates coming from Bankura, Purulia, Jhargram, and Midnapore districts:
                      </p>
                      <div className="text-amber-400 font-mono font-bold text-sm mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>Helpline: +91 98000 00000</span>
                        <span className="hidden sm:inline text-gray-600">•</span>
                        <span>dutyroom@puruliaaim.in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Admission CTA Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161F15] to-[#0E140C] border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <Badge variant="saffron" size="md" pulse>
                    Cadet Intake Open
                  </Badge>
                  <h3 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                    Enlist in the Cadet Roster
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    Whether you are targeting Indian Army Agniveer GD Group 1, West Bengal Police SI, or SSC GD Paramilitary, our veteran ex-military drill will cut down your 1600m time and build unbreakable battlefield endurance.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-gray-300 pt-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      100% Regimental Welfare (₹0 Tuition / Admission)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Stopwatch Telemetry & Beam Bar Technique Correction
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Separate Squad Drills for Male & Female Cadets
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#273623] space-y-3">
                  <Button
                    variant="saffron"
                    size="xl"
                    className="w-full justify-center text-black font-extrabold uppercase font-display tracking-wider text-base"
                    onClick={() => setAdmissionModalOpen(true)}
                  >
                    Submit Cadet Enlistment Order (₹0)
                  </Button>
                  <p className="text-center text-[11px] text-gray-500 font-mono">
                    Online form takes 2 minutes. Walk-in enlistment also accepted at the parade ground.
                  </p>
                </div>
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
