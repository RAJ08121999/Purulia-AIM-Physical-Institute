'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Flame,
  Award,
  Users,
  Timer,
  Activity,
  ArrowRight,
  Compass,
  FileCheck2,
  CheckCircle2,
  MapPin,
  Calendar,
  PhoneCall,
  Clock,
  Sparkles,
  ChevronRight,
  Radio,
  FileText,
  UserCheck
} from 'lucide-react';
import {
  Button,
  Badge,
  SectionHeading,
  StatMetricCard,
  SpotlightCard,
  ShimmerBadge,
  KineticButton
} from '@/components/ui';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';

export default function Home() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onApplyClick={() => setAdmissionModalOpen(true)} />

      <main className="flex-1">
        {/* ===================================================================
            HERO SECTION
            =================================================================== */}
        <section className="relative min-h-[calc(100vh-72px)] flex flex-col justify-center pt-2 sm:pt-4 pb-6 sm:pb-8 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#4B6135]/20 blur-[130px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              {/* Military Directorate Badge */}
              <div className="flex justify-center">
                <ShimmerBadge icon={<Flame className="w-4 h-4 text-amber-400" />}>
                  DEFENCE RECRUITMENT PHYSICAL PREPARATION • REGIMENTAL TRAINING DIRECTORATE
                </ShimmerBadge>
              </div>

              {/* Main Heading - Bold Military Authority */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[96px] font-black font-display uppercase tracking-tight text-white leading-[1.02]">
                TRAIN HARD. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
                  STAY DISCIPLINED.
                </span>{' '}
                <br />
                SERVE THE NATION.
              </h1>

              {/* Subtitle with Military Specificity */}
              <p className="text-sm sm:text-base md:text-lg text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed">
                Mission-grade physical conditioning for the youth of Bengal. Commanded by <strong className="text-white">ex-Army Havaldar Anup Kumar Mahato</strong> to prepare dedicated aspirants with battlefield precision for the Indian Army (Agniveer GD/Tech), Paramilitary Forces (CAPF/SSC GD), Police Services (WBP/KP SI), Navy, and Air Force.
              </p>

              {/* Multipage Action CTAs - Perfectly Fitted on Screen */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3">
                <div onClick={() => setAdmissionModalOpen(true)} className="w-full sm:w-auto">
                  <KineticButton size="lg" className="w-full sm:w-auto justify-center px-6 py-3 text-sm font-black shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                    Enlist in Cadet Squad (₹0)
                  </KineticButton>
                </div>
                <Link href="/programs" className="w-full sm:w-auto">
                  <Button
                    variant="army"
                    size="lg"
                    className="w-full sm:w-auto justify-center px-5 py-3 text-sm font-bold"
                    leftIcon={<Compass className="w-5 h-5 text-lime-400" />}
                  >
                    Training Wings & Drills
                  </Button>
                </Link>
                <Link href="/calculator" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto justify-center px-5 py-3 text-sm font-bold"
                    leftIcon={<Timer className="w-5 h-5 text-amber-400" />}
                  >
                    BPET Score Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            VERIFIED STATS METRICS
            =================================================================== */}
        <section className="py-8 bg-[#0E140C] border-y border-[#273623]">
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
                value="500+"
                unit="Soldiers & Officers"
                icon={<Award className="w-5 h-5" />}
                percentageChange="100% Verified"
                isImprovement={true}
                subtitle="Selected in Army, WBP, KP , RPF , SI , & CAPF"
              />
              <StatMetricCard
                label="Active Military Service"
                value="6+"
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

        {/* ===================================================================
            DIRECTORY: DEDICATED SECTIONS & PAGES OVERVIEW
            =================================================================== */}
        <section className="py-16 sm:py-24 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              badge="Explore Directorate"
              title="Official Training Wings & Resources"
              highlightWord="Resources"
              subtitle="Navigate to dedicated pages for recruitment branches, live telemetry calculators, gazettes, and parade ground rosters."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: About & Founder */}
              <Link href="/about" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      Regimental HQ & Founder
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Learn about ex-Army Havaldar Anup Kumar Mahato's military background, the origin of AIM, and our uncompromising 4-pillar Regimental Drill Code.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Read Story & Mission</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>

              {/* Card 2: Training Wings */}
              <Link href="/programs" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/40 text-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      Training Wings & Drills
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Dedicated regimens for Indian Army Agniveer GD/Technical, West Bengal Police SI, CAPF SSC GD, RPF Constable, Navy, and Air Force.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-lime-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Wings & Schedules</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>

              {/* Card 3: BPET Calculator */}
              <Link href="/calculator" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Timer className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      BPET Standards Calculator
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Interactive calculator for 1600m track pacing, beam pull-ups, ditch clearance, and empirical student progression dossiers.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Calculate Rally Cutoff</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>

              {/* Card 4: Recruitment Bulletin */}
              <Link href="/bulletin" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      Recruitment Orders (SRO)
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Official rally circulars, application deadlines, syllabus dossiers, notification gazettes, and upcoming defence recruitment notifications.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Open Recruitment Gazettes</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>

              {/* Card 5: Wall of Fame */}
              <Link href="/wall-of-fame" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      Roll of Honour (Veer Gatha)
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Honouring 100+ verified cadets from rural Bengal who trained free at AIM and proudly earned selection in the Armed Forces and Police.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-yellow-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Selected Recruits</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>

              {/* Card 6: Parade Ground & Muster */}
              <Link href="/contact" className="group">
                <SpotlightCard className="h-full p-6 sm:p-7 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-amber-400 transition-colors">
                      Parade Ground & Stand-To
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      J.K. College Ground Purulia directions, Daily Routine Orders timetable, and duty room contact details.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1E2B1A] flex items-center justify-between text-xs font-mono text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Parade Hours & Directions</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </SpotlightCard>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            COMMAND PORTALS DIRECTORY BANNER
            =================================================================== */}
        <section className="py-14 sm:py-20 border-b border-[#273623] bg-[#0E140C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <SectionHeading
              badge="Digital Command Operations"
              title="Real-Time Telemetry & Portals"
              highlightWord="Portals"
              subtitle="Live synchronized stopwatch drills, student performance dossiers, and trainer attendance tracking."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/portal/student" className="p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <UserCheck className="w-6 h-6 text-amber-400" />
                  <Badge variant="army" size="sm">Cadet View</Badge>
                </div>
                <h4 className="font-display font-bold text-lg text-white uppercase group-hover:text-amber-400 transition-colors">
                  Cadet Service Dossier
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Live synchronized drill stopwatch (read-only when trainer is on-air), self-training timer, and multi-category progression curves.
                </p>
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1 pt-2">
                  <span>Open Cadet Portal →</span>
                </div>
              </Link>

              <Link href="/portal/trainer" className="p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <Shield className="w-6 h-6 text-lime-400" />
                  <Badge variant="saffron" size="sm">Trainer Control</Badge>
                </div>
                <h4 className="font-display font-bold text-lg text-white uppercase group-hover:text-amber-400 transition-colors">
                  Drill Ustad Command Roster
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Start live parade stopwatch broadcasts, log cadet split heat finishes, mark roll attendance, and monitor 3-day absence defaulters.
                </p>
                <div className="text-xs font-mono text-lime-400 font-bold flex items-center gap-1 pt-2">
                  <span>Open Trainer Roster →</span>
                </div>
              </Link>

              <Link href="/portal/admin" className="p-6 rounded-2xl bg-[#121811] border border-[#273623] hover:border-amber-500/50 transition-all space-y-3 group">
                <div className="flex items-center justify-between">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <Badge variant="danger" size="sm">Headquarters</Badge>
                </div>
                <h4 className="font-display font-bold text-lg text-white uppercase group-hover:text-amber-400 transition-colors">
                  Quartermaster / Admin HQ
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Manage cadet admission registrations, export PDF evaluation dossiers, and review regimental training audit logs.
                </p>
                <div className="text-xs font-mono text-blue-400 font-bold flex items-center gap-1 pt-2">
                  <span>Open Admin HQ →</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            CALL TO ACTION: ENLISTMENT ORDER
            =================================================================== */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-amber-500/40 text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              <Badge variant="saffron" size="md" pulse>
                Cadet Enlistment Open • 100% Free
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white max-w-2xl mx-auto leading-tight">
                Stand-To Tomorrow Morning At 05:00am HRS IST
              </h2>
              <p className="text-sm sm:text-base text-gray-300 font-sans max-w-xl mx-auto leading-relaxed">
                No coaching charges, no admission fees. Turn up in PT kit at J.K. College Ground, Purulia, or submit your online enlistment form right now.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="saffron"
                  size="xl"
                  onClick={() => setAdmissionModalOpen(true)}
                  className="w-full sm:w-auto text-black font-extrabold uppercase font-display"
                >
                  Submit Cadet Enlistment Form (₹0)
                </Button>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto justify-center">
                    Ground Directions & Hours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Admission Intake Modal */}
      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
      />
    </div>
  );
}
