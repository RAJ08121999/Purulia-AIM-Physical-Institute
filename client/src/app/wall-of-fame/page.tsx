'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Shield,
  Flame,
  CheckCircle2,
  Users,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { WallOfFame } from '@/components/WallOfFame';
import { SectionHeading, Badge, Button } from '@/components/ui';

export default function WallOfFamePage() {
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
                100+ Recruits Selected in Indian Defence & Police
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                Roll of Honour • Veer Gatha
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Honouring our verified cadets from Purulia, Bankura, Jhargram, and rural Bengal who drilled free of cost at AIM Physical Institute and earned the revered uniform of the Indian Armed Forces and State Police services.
              </p>
            </div>
          </div>
        </section>

        {/* Wall Of Fame Component */}
        <section className="py-14 sm:py-20 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              badge="Enlisted Recruits"
              title="From Purulia Parade Ground to Border Deployments"
              highlightWord="Deployments"
              subtitle="Browse through our hall of soldiers, paramilitary commandos, and police officers who proved that hard work and regimental coaching overcomes all odds."
            />

            <div>
              <WallOfFame />
            </div>

            {/* Cadet Oath Quote */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121811] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Will Your Name Be On The Next Roll of Honour?
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  Stand-To commences at 05:00am hrs tomorrow at J.K. College Ground, Purulia.
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
                <Link href="/gallery">
                  <Button variant="outline" size="lg">
                    View Regimental Gallery
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
