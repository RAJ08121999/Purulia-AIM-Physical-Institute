'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Users,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { SectionHeading, Badge, Button } from '@/components/ui';

export default function ApplyPage() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      <Navbar onApplyClick={() => setAdmissionModalOpen(true)} />

      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-amber-500/40 text-center space-y-4 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Badge variant="saffron" size="md">
              100% Free Regimental Welfare
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
              Cadet Enlistment Order (₹0)
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed">
              No admission fees, no monthly coaching dues. Commanded by ex-Army Havaldar Anup Kumar Mahato for the youth of Purulia and Bengal preparing for Indian Army, Police, and Paramilitary forces.
            </p>
            <div className="pt-4 flex justify-center">
              <Button
                variant="saffron"
                size="xl"
                onClick={() => setAdmissionModalOpen(true)}
                className="text-black font-extrabold uppercase font-display"
              >
                Open Enlistment Form
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#121811] border border-[#273623] space-y-2">
              <div className="text-amber-400 font-bold font-display uppercase text-sm">
                Requirement 01
              </div>
              <h4 className="text-white font-bold text-base">Stand-To Discipline</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Punctual attendance at 05:00am hrs morning parade at J.K. College Ground.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121811] border border-[#273623] space-y-2">
              <div className="text-amber-400 font-bold font-display uppercase text-sm">
                Requirement 02
              </div>
              <h4 className="text-white font-bold text-base">PT Uniform Ready</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Running shoes, track pants, and standard hydration bottle for training.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121811] border border-[#273623] space-y-2">
              <div className="text-amber-400 font-bold font-display uppercase text-sm">
                Requirement 03
              </div>
              <h4 className="text-white font-bold text-base">Unconditional Oath</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                No substance abuse, absolute respect for fellow cadets, dedication to national service.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AdmissionModal isOpen={admissionModalOpen} onClose={() => setAdmissionModalOpen(false)} />
    </div>
  );
}
