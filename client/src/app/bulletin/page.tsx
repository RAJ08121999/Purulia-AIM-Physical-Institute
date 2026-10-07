'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Bell,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck2,
  Download,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { RecruitmentBulletin } from '@/components/RecruitmentBulletin';
import { SectionHeading, Badge, Button } from '@/components/ui';

export default function BulletinPage() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      <Navbar onApplyClick={() => setAdmissionModalOpen(true)} />

      <main className="flex-1">
        {/* Page Header */}
        <section className="relative py-14 sm:py-20 border-b border-[#273623] bg-gradient-to-b from-[#141C10] via-[#0E140C] to-[#0B0F0A] overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <Badge variant="army" size="md">
                Official Directorate Gazettes
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                Recruitment Orders & Circulars
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Stay updated with verified rally dates, official notification gazettes, eligibility cutoffs, syllabus dossiers, and recruitment notifications for Indian Army, Paramilitary (CAPF), and State Police services.
              </p>
            </div>
          </div>
        </section>

        {/* Live Recruitment Bulletin Module */}
        <section className="py-14 sm:py-20 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              badge="Special Routine Orders (SRO)"
              title="Official Defence Recruitment Orders"
              highlightWord="Orders"
              subtitle="Official rally circulars, notification numbers, cutoff criteria, and direct syllabus dossiers."
            />

            <div>
              <RecruitmentBulletin />
            </div>

            {/* Rally Readiness Alert Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121811] border border-amber-500/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">
                    Need Rally Physical Preparation Before Trial?
                  </h4>
                  <p className="text-xs text-gray-400 font-sans">
                    Join our daily 05:00am hrs morning drill at J.K. College Ground to clear the 1600m in under 5 minutes 30 seconds.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  variant="saffron"
                  size="md"
                  onClick={() => setAdmissionModalOpen(true)}
                  className="text-black font-bold uppercase font-display"
                >
                  Enlist in Cadet Squad (₹0)
                </Button>
                <Link href="/contact">
                  <Button variant="outline" size="md">
                    Parade Ground Muster Details
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
