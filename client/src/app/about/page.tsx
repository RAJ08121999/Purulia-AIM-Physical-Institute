'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Award,
  Users,
  Flame,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Compass,
  FileCheck2,
  Clock,
  Target
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { SectionHeading, Badge, StatMetricCard, KineticButton, Button } from '@/components/ui';

export default function AboutPage() {
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
                Regimental Directorate • Purulia HQ
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                About AIM Physical Institute
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Founded and commanded by <strong className="text-white">ex-Army Havaldar Anup Kumar Mahato</strong>, AIM Physical Institute provides mission-grade physical conditioning for the youth of Bengal, dedicated to Indian Armed Forces and Police recruitment with 100% free regimental welfare.
              </p>
            </div>
          </div>
        </section>

        {/* Verified Stats Row */}
        <section className="py-8 bg-[#0E140C] border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatMetricCard
                label="Cadets Enlisted & Drilled"
                value="1000+"
                unit="Aspirants"
                icon={<Users className="w-5 h-5" />}
                percentageChange="+42% this year"
                isImprovement={true}
                subtitle="Zero admission or tuition dues"
              />
              <StatMetricCard
                label="Roll of Honour Recruits"
                value="100+"
                unit="Soldiers & Officers"
                icon={<Award className="w-5 h-5" />}
                percentageChange="100% Verified"
                isImprovement={true}
                subtitle="Selected in Army, WBP, KP & RPF"
              />
              <StatMetricCard
                label="Active Military Service"
                value="10+"
                unit="Years"
                icon={<Shield className="w-5 h-5" />}
                subtitle="Commanded by Ex-Army Havaldar"
              />
              <StatMetricCard
                label="Regimental Welfare Cost"
                value="₹0"
                unit="100% Free"
                icon={<Flame className="w-5 h-5 text-amber-400" />}
                subtitle="Dedicated to Rural Bengal Youth"
              />
            </div>
          </div>
        </section>

        {/* Founder's Story Section */}
        <section className="py-16 sm:py-24 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="relative rounded-2xl bg-[#161F15] border border-amber-500/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.15)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-4">
                    <Badge variant="army" size="md">
                      Chief Drill Instructor & Founder
                    </Badge>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                      Havaldar Anup Kumar Mahato
                    </h2>
                    <div className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase">
                      Indian Army Veteran (Retd.) • 10+ Years Active Service • Founder, AIM
                    </div>
                    <blockquote className="text-sm text-gray-300 font-sans leading-relaxed italic border-l-2 border-amber-500 pl-4 py-1">
                      "After serving our nation on border deployments in the Indian Army, I returned to Purulia and saw hundreds of spirited village youth failing recruitment rallies by merely 5 or 10 seconds due to flawed pacing, poor beam grip, and zero technical guidance. I took an oath on my regimental honour that no son or daughter of Bengal will return rejected from a recruitment rally due to poverty or lack of military conditioning. AIM drills every cadet to Group 1 standards free of cost."
                    </blockquote>
                    <div className="pt-4 border-t border-[#273623] flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-2">
                      <span>Parade Ground: Purulia, WB</span>
                      <span className="text-emerald-400 font-bold">Stand-To: 05:00am hrs IST</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <SectionHeading
                  badge="The Regimental Drill Code"
                  title="Battlefield Precision. Calibrated Telemetry."
                  highlightWord="Precision"
                  subtitle="Every morning at 05:00am hrs IST, aspirants assemble for Stand-To at J.K. College Ground Purulia to drill under calibrated stopwatch standards."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-xl bg-[#121811] border border-[#273623] space-y-2">
                    <div className="text-amber-400 font-display font-bold text-base uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      100% Regimental Welfare
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Zero admission fee, zero coaching charges. Dedicated unconditionally to rural Bengal youth preparing for national defence.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121811] border border-[#273623] space-y-2">
                    <div className="text-amber-400 font-display font-bold text-base uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      Sub-5:30 Group 1 Pacing
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Calibrated stopwatch lap telemetry on 400m track to secure full 60/60 marks in the Indian Army 1600m Battle Physical Test.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121811] border border-[#273623] space-y-2">
                    <div className="text-amber-400 font-display font-bold text-base uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      10 Dead-Hang Beam Pull-Ups
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Strict vertical bar cadence drills with zero leg swing to guarantee the maximum 40/40 score on the rally pull-up beam.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#121811] border border-[#273623] space-y-2">
                    <div className="text-amber-400 font-display font-bold text-base uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      9-Ft Ditch & Obstacles
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mandatory battlefield obstacle training replicating official army rally grounds for faultless clearance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regimental Core Values */}
        <section className="py-16 sm:py-20 border-b border-[#273623] bg-[#0E140C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              badge="Our Regimental Ethos"
              title="Discipline • Physical Supremacy • Patriotism"
              highlightWord="Supremacy"
              subtitle="The pillars that forge an ordinary rural aspirant into an elite soldier or police officer."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#121811] border border-[#273623] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="font-display font-bold text-white text-lg uppercase">
                  Zero Commercialization
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Unlike commercial academies that charge thousands from farmer families, AIM operates strictly on a welfare basis. Training is 100% free for all deserving candidates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#121811] border border-[#273623] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="font-display font-bold text-white text-lg uppercase">
                  Scientific Telemetry
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  No guesswork. Every lap, split time, beam repetition, and resting heart rate is logged in the Cadet Service Dossier to track tangible weekly progress curves.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#121811] border border-[#273623] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="font-display font-bold text-white text-lg uppercase">
                  Regimental Discipline
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Punctuality is non-negotiable. Stand-to muster starts at 05:00am hrs sharp. 3 unexcused absences trigger a defaulter warning to maintain uncompromising unit esprit de corps.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Ready to Enlist in the Morning Cadet Squad?
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  First light stand-to commences tomorrow at 05:00am hrs IST at J.K. College Ground.
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
                <Link href="/programs">
                  <Button variant="outline" size="lg">
                    View Training Wings
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
