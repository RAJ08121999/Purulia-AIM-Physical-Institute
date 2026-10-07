'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Timer,
  Activity,
  Award,
  Shield,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Target,
  FileCheck2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdmissionModal } from '@/components/AdmissionModal';
import { BenchmarkCalculator } from '@/components/BenchmarkCalculator';
import { SectionHeading, Badge, DataTable, Button } from '@/components/ui';

export default function CalculatorPage() {
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);

  const sampleTableData = [
    {
      metric: '1600m Battle Physical Efficiency (BPET Run)',
      baseline: '07m 42s',
      current: '05m 28s',
      target: '05m 30s (Army Grp 1 • 60 Pts)',
      variance: '-29.1%',
      status: 'Qualified (Grp 1)'
    },
    {
      metric: '10 Dead-Hang Beam Pull-ups (Vertical Bar)',
      baseline: '04 reps',
      current: '11 reps',
      target: '10 reps (Army Max • 40 Pts)',
      variance: '+175.0%',
      status: 'Qualified (40 Pts)'
    },
    {
      metric: '9-Foot Ditch Clearance Jump',
      baseline: 'Foul / 7.6 ft',
      current: 'Cleared (9.6 ft)',
      target: '9.0 ft Ditch (Army Compulsory)',
      variance: '+26.3%',
      status: 'Qualified'
    },
    {
      metric: 'Zig-Zag Military Balance Beam',
      baseline: 'Faulted on Turns',
      current: 'Zero Faults (Cleared)',
      target: 'Qualifying Balance Standard',
      variance: '100% Stability',
      status: 'Qualified'
    },
    {
      metric: '800m Speed Sprint (WBP / KP SI Cadets)',
      baseline: '03m 52s',
      current: '02m 44s',
      target: '03m 00s (WB Police Cutoff)',
      variance: '-29.3%',
      status: 'Exceeding Standard'
    }
  ];

  const columns = [
    { key: 'metric', header: 'Physical Standard / BPET Metric', sortable: true },
    { key: 'baseline', header: 'Cadet Intake Baseline' },
    {
      key: 'current',
      header: 'Current Stopwatch Telemetry',
      render: (row: any) => (
        <span className="font-extrabold text-amber-400 font-display text-base">
          {row.current}
        </span>
      )
    },
    { key: 'target', header: 'Official Recruitment Standard' },
    {
      key: 'variance',
      header: 'Performance Delta',
      render: (row: any) => (
        <span className="text-emerald-400 font-bold font-mono">{row.variance}</span>
      )
    },
    {
      key: 'status',
      header: 'Rally Qualification',
      render: (row: any) => (
        <Badge
          variant={
            row.status.includes('Qualified') || row.status.includes('Exceeding')
              ? 'success'
              : 'saffron'
          }
          size="sm"
        >
          {row.status}
        </Badge>
      )
    }
  ];

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
                Battlefield Physical Efficiency (BPET)
              </Badge>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-tight">
                BPET Standards & Gap Calculator
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Test your current running pace, pull-up cadence, and obstacle scores against official Indian Army Agniveer GD Group 1, WB Police, and CAPF recruitment criteria.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Benchmark Calculator */}
        <section className="py-14 sm:py-20 border-b border-[#273623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BenchmarkCalculator />
          </div>
        </section>

        {/* Sample Student Telemetry Progress Table */}
        <section className="py-14 sm:py-20 border-b border-[#273623] bg-[#0E140C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <SectionHeading
              badge="Field Telemetry Dossier"
              title="Cadet Physical Service Dossier & Progress Log"
              highlightWord="Dossier"
              subtitle="Empirical stopwatch marks showing intake baseline vs current timed trials against official Army Group 1 criteria."
            />

            <div>
              <DataTable
                data={sampleTableData}
                columns={columns}
                searchKey="metric"
                searchPlaceholder="Search physical standard metric..."
                pageSize={5}
              />
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Access Your Personal Cadet Service Dossier
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  Registered cadets can view live stopwatch telemetry curves, weekly Sunday trials, and muster records.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/portal/student">
                  <Button variant="saffron" size="lg" className="text-black font-extrabold uppercase font-display">
                    Open Cadet Portal →
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => setAdmissionModalOpen(true)}>
                  Enlist Cadet (₹0)
                </Button>
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
