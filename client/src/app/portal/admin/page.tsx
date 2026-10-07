'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Search,
  Printer,
  FileCheck,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { Button, Badge, Card, StatMetricCard } from '@/components/ui';
import { ProgressReportPDFView } from '@/components';

interface Application {
  id: string;
  name: string;
  phone: string;
  age: number;
  isUnder18: boolean;
  heightCm: number;
  weightKg: number;
  targetForce: string;
  status: 'PENDING' | 'APPROVED' | 'WAITLISTED' | 'REJECTED';
  appliedDate: string;
  medicalConsent: boolean;
  assignedRoll?: string;
  assignedBatch?: string;
}

const mockApplications: Application[] = [
  {
    id: 'app-101',
    name: 'Debojit Singha Mahapatra',
    phone: '+91 97330 11223',
    age: 19,
    isUnder18: false,
    heightCm: 172,
    weightKg: 64,
    targetForce: 'Indian Army GD',
    status: 'PENDING',
    appliedDate: '04-Oct-2026',
    medicalConsent: true
  },
  {
    id: 'app-102',
    name: 'Manoj Murmu',
    phone: '+91 96472 88990',
    age: 17,
    isUnder18: true,
    heightCm: 168,
    weightKg: 59,
    targetForce: 'WBP Constable',
    status: 'PENDING',
    appliedDate: '03-Oct-2026',
    medicalConsent: true
  },
  {
    id: 'app-103',
    name: 'Anjali Hansda',
    phone: '+91 94750 33445',
    age: 21,
    isUnder18: false,
    heightCm: 161,
    weightKg: 52,
    targetForce: 'Kolkata Police Lady Constable',
    status: 'APPROVED',
    appliedDate: '29-Sep-2026',
    medicalConsent: true,
    assignedRoll: 'AIM-2026-039',
    assignedBatch: 'Morning Alfa (Track)'
  },
  {
    id: 'app-104',
    name: 'Soumen Roy',
    phone: '+91 98321 44556',
    age: 20,
    isUnder18: false,
    heightCm: 170,
    weightKg: 63,
    targetForce: 'Railway Protection Force',
    status: 'WAITLISTED',
    appliedDate: '28-Sep-2026',
    medicalConsent: true
  }
];

const mockAuditLogs = [
  {
    id: 'log-1',
    actor: 'Havaldar Anup Kumar Mahato (Admin)',
    action: 'ADMISSION_APPROVED',
    details: 'Approved applicant Anjali Hansda. Allocated to Morning Alfa. Roll: AIM-2026-039',
    timestamp: '04-Oct-2026 10:14 AM',
    ip: '192.168.1.42'
  },
  {
    id: 'log-2',
    actor: 'System Telemetry Engine',
    action: 'ATTENDANCE_BATCH_RECORDED',
    details: 'Recorded 42 presents, 3 absents for Morning Alfa drill session.',
    timestamp: '04-Oct-2026 08:35 AM',
    ip: '127.0.0.1'
  },
  {
    id: 'log-3',
    actor: 'Havaldar Anup Kumar Mahato (Admin)',
    action: 'TRIAL_TELEMETRY_LOGGED',
    details: 'Recorded Sunday 1600m time for Cadet Sourav Mukherjee (05m 24s).',
    timestamp: '03-Oct-2026 06:45 PM',
    ip: '192.168.1.42'
  }
];

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<'ADMISSIONS' | 'EVALUATION' | 'AUDIT'>('ADMISSIONS');
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleApprove = (appId: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === appId
          ? {
            ...app,
            status: 'APPROVED',
            assignedRoll: `AIM-2026-0${Math.floor(Math.random() * 50 + 45)}`,
            assignedBatch: 'Morning Alfa (Track)'
          }
          : app
      )
    );
  };

  const handleReject = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'REJECTED' } : app))
    );
  };

  const filteredApps = applications.filter(a => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="border-b border-[#273623] bg-[#0E140C] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back</span>
            </Link>
            <div className="h-5 w-px bg-[#273623]"></div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-amber-400 text-base sm:text-lg uppercase tracking-wider">AIM</span>
              <span className="text-[11px] sm:text-xs font-mono text-gray-400 uppercase hidden sm:inline">Admin Center</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="saffron" size="sm">
              Admin
            </Badge>
            <div className="text-right text-[11px] sm:text-xs font-mono text-gray-400 hidden xs:block">
              Auth: <strong className="text-emerald-400">TOTP</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatMetricCard
            label="Pending Admissions"
            value={applications.filter(a => a.status === 'PENDING').length.toString()}
            unit="Applicants"
            icon={<Users className="w-5 h-5" />}
            subtitle="Requires Anup Sir review"
          />
          <StatMetricCard
            label="Enrolled Cadets"
            value="48"
            unit="Active"
            icon={<Award className="w-5 h-5" />}
            subtitle="Batches Alfa & Bravo"
          />
          <StatMetricCard
            label="Physical Qualification Rate"
            value="91.4%"
            unit="Group 1/2"
            icon={<CheckCircle2 className="w-5 h-5" />}
            subtitle="1600m trial benchmarks"
          />
          <StatMetricCard
            label="Audit Trail Events"
            value="342"
            unit="Immutable"
            icon={<Shield className="w-5 h-5" />}
            subtitle="Tamper-proof logs active"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#273623] pb-2 font-display uppercase tracking-wider text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x">
          {[
            { id: 'ADMISSIONS', label: 'Admissions Pipeline' },
            { id: 'EVALUATION', label: 'Cadet Evaluation Sheet' },
            { id: 'AUDIT', label: 'Audit Trail Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all whitespace-nowrap border ${activeTab === tab.id
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ADMISSIONS PIPELINE */}
        {activeTab === 'ADMISSIONS' && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#273623]">
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                  Admissions Intake Review Pipeline
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">
                  Approve applicants to auto-generate official AIM Roll numbers and assign morning batches.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'WAITLISTED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${filterStatus === st
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-[#0B0F0A] text-gray-400 border-[#273623] hover:text-white'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto no-scrollbar touch-pan-x">
              <table className="w-full text-left text-xs font-mono min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#273623] text-gray-400">
                    <th className="py-3 px-4">Applicant Name & Contact</th>
                    <th className="py-3 px-4">Physical Measurements</th>
                    <th className="py-3 px-4">Target Force</th>
                    <th className="py-3 px-4">Status & Batch</th>
                    <th className="py-3 px-4 text-center">Admin Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2415]">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-[#161F15]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-display font-bold text-sm text-white uppercase">{app.name}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{app.phone}</div>
                        <div className="text-[10px] text-amber-400">
                          Age: {app.age} {app.isUnder18 ? '(Guardian Verified)' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div>Height: <strong className="text-white">{app.heightCm} cm</strong></div>
                        <div>Weight: <strong className="text-white">{app.weightKg} kg</strong></div>
                        <div className="text-emerald-400 text-[10px]">Medical Consent: Confirmed</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {app.targetForce}
                        <div className="text-[10px] text-gray-500 font-normal">Applied: {app.appliedDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            app.status === 'APPROVED'
                              ? 'success'
                              : app.status === 'PENDING'
                                ? 'saffron'
                                : 'default'
                          }
                          size="sm"
                        >
                          {app.status}
                        </Badge>
                        {app.assignedRoll && (
                          <div className="text-[10px] font-bold text-lime-400 mt-1">
                            Roll: {app.assignedRoll}
                          </div>
                        )}
                        {app.assignedBatch && (
                          <div className="text-[10px] text-gray-400">
                            {app.assignedBatch}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {app.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="army"
                              size="sm"
                              onClick={() => handleApprove(app.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(app.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : app.status === 'APPROVED' ? (
                          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Cadet Enrolled
                          </span>
                        ) : (
                          <span className="text-gray-500">Waitlisted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRINTABLE CADET EVALUATION SHEET (MODULE 6 COMPONENT) */}
        {activeTab === 'EVALUATION' && (
          <div className="space-y-6">
            <ProgressReportPDFView />
          </div>
        )}

        {/* TAB 3: IMMUTABLE AUDIT TRAIL LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                Immutable System Mutation Trail
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Every administrative mutation (application approval, batch assignment, telemetry scoring) is immutably logged with actor identity, timestamp, and IP.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar touch-pan-x pt-2">
              <table className="w-full text-left text-xs font-mono min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#273623] text-gray-400">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Mutation Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2415]">
                  {mockAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#161F15]/50 transition-colors">
                      <td className="py-3.5 px-4 text-gray-400">{log.timestamp}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-amber-400 font-bold bg-[#161F15] px-2 py-0.5 rounded border border-[#273623]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-white font-bold">{log.actor}</td>
                      <td className="py-3.5 px-4 text-gray-300 max-w-xs">{log.details}</td>
                      <td className="py-3.5 px-4 text-gray-500">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
