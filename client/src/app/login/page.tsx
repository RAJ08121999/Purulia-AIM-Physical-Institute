'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { AdmissionModal } from '@/components/AdmissionModal';
import { Shield, User, Lock, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function LoginPage() {
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#070B06] text-white flex flex-col font-sans">
      <Navbar onApplyClick={() => setAdmissionOpen(true)} />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0E140C] border border-[#273623] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black font-display uppercase tracking-wider text-white">
              Tactical Command Login
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Purulia Aim Physical Institute (AIM) Verification
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="saffron"
              size="lg"
              onClick={() => setAuthModalOpen(true)}
              className="w-full text-black font-bold uppercase font-display"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Authentication Window
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setAdmissionOpen(true)}
              className="w-full text-gray-300 font-mono text-xs uppercase"
            >
              New Cadet? Enlist in Squad (₹0 Free)
            </Button>
          </div>

          <div className="pt-4 border-t border-[#1A2415] text-xs text-gray-500 font-mono">
            Command Headquarters • J.K. College Ground Purulia
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenAdmission={() => setAdmissionOpen(true)}
      />

      <AdmissionModal
        isOpen={admissionOpen}
        onClose={() => setAdmissionOpen(false)}
      />

      <Footer />
    </div>
  );
}
