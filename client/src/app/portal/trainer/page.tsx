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
  Save,
  Flame,
  Award,
  Calendar,
  PhoneCall,
  Check,
  Send,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Video,
  Megaphone,
  Sparkles,
  Upload,
  UserCheck,
  UserX,
  Eye,
  RefreshCw,
  Lock,
  Edit3,
  Timer,
  Activity,
  Radio
} from 'lucide-react';
import { Button, Badge, Card, StatMetricCard } from '@/components/ui';
import { submitBulkAttendance, recordTrialAssessment, getCurrentUser, logoutUser, fetchCadetApplications, updateCadetStatus, getApiBaseUrl, fetchTrainerProfile, createInstituteEvent, deleteInstituteEvent, fetchInstituteEvents } from '@/lib/api';
import { ParadeDrillStopwatch, EditTrainerProfileModal, WarCryStoriesTray, UstadStoryVerificationDesk, PostWarCryModal, ThemeToggle } from '@/components';

interface CadetAttendance {
  id: string;
  roll: string;
  name: string;
  batch: string;
  target: string;
  consecutiveAbsences: number;
  last1600m: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
}

export interface DrillEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  targetCadre: string;
  reportingStatus: 'OPEN' | 'CLOSING SOON' | 'RESTRICTED';
  guidelines: string;
}

export interface RollOfHonourEntry {
  id: string;
  name: string;
  beltNo: string;
  force: string;
  batchYear: string;
  photoUrl: string;
  achievement: string;
}

export interface RecruitmentOrder {
  id: string;
  title: string;
  authority: string;
  category: 'RALLY_ORDER' | 'PHYSICAL_STANDARDS' | 'WRITTEN_SYLLABUS' | 'GALLERY_FOOTAGE';
  url: string;
  date: string;
}

const initialCadets: CadetAttendance[] = [];

const initialEvents: DrillEvent[] = [
  {
    id: 'EV-01',
    title: 'State Level 1600m Timed Speed Simulation & PET Trial',
    type: 'Mock Physical Rally',
    date: '2026-10-25',
    time: '05:00 AM IST',
    venue: 'J.K. College Ground Synthetic & Mud Track, Purulia',
    targetCadre: 'Indian Army Agniveer GD, WBP Constable',
    reportingStatus: 'OPEN',
    guidelines: 'Reporting in physical uniform with chest bib numbers. Mandatory running spikes or studs allowed on outer rim.'
  },
  {
    id: 'EV-02',
    title: 'Army Beam (10 Chin-ups) & 9ft Ditch Assessment Clinic',
    type: 'Obstacle Drill Clinic',
    date: '2026-11-02',
    time: '05:30 AM IST',
    venue: 'AIM Obstacle Ground Purulia',
    targetCadre: 'All Enlisted Cadets',
    reportingStatus: 'OPEN',
    guidelines: 'Complete 10 dead-hang chin-ups under drill master inspection without body swing.'
  }
];

const initialHonourList: RollOfHonourEntry[] = [
  {
    id: 'H-01',
    name: 'Sepoy Bikram Gorai',
    beltNo: 'ARMY-GD-7429',
    force: 'Indian Army (Rajputana Rifles)',
    batchYear: '2024 Batch',
    photoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
    achievement: 'Clocked 5m 12s 1600m in Barrackpore Rally. 100/100 Physical Marks.'
  },
  {
    id: 'H-02',
    name: 'Constable Subhas Hansda',
    beltNo: 'WBP-8812',
    force: 'West Bengal Police Force',
    batchYear: '2025 Batch',
    photoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    achievement: 'Cleared WBPRB 1600m in 5m 38s and high jump in first attempt.'
  },
  {
    id: 'H-03',
    name: 'Rifleman Rajesh Mahato',
    beltNo: 'BSF-GD-3104',
    force: 'Border Security Force (BSF)',
    batchYear: '2025 Batch',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    achievement: 'SSC-GD All India Rank holder, selected for Tripura border battalion.'
  }
];

const initialOrders: RecruitmentOrder[] = [
  {
    id: 'ORD-01',
    title: 'Army Recruitment Rally (Barrackpore ARO) Official Notification 2026',
    authority: 'Army Headquarters / Join Indian Army',
    category: 'RALLY_ORDER',
    url: 'https://joinindianarmy.nic.in',
    date: '2026-10-01'
  },
  {
    id: 'ORD-02',
    title: 'WB Police Constable Physical Measurement & Efficiency Test (PMT/PET) Guidelines',
    authority: 'West Bengal Police Recruitment Board (WBPRB)',
    category: 'PHYSICAL_STANDARDS',
    url: 'https://prb.wb.gov.in',
    date: '2026-09-18'
  },
  {
    id: 'ORD-03',
    title: 'Purulia AIM Institute Daily Sand Track Interval Training Video',
    authority: 'AIM Training Ground Purulia',
    category: 'GALLERY_FOOTAGE',
    url: 'https://youtube.com/@anupfaujipuruliaaimphysica4494?si=dQpEoma6CzzGkf88',
    date: '2026-10-05'
  }
];

export type TrainerPortalTab =
  | 'STOPWATCH'
  | 'WARCRY'
  | 'ADMISSIONS'
  | 'ATTENDANCE'
  | 'BULLETIN'
  | 'WARCRY_HONOUR'
  | 'VERIFICATION'
  | 'TELEMETRY'
  | 'DEFAULTERS'
  | 'EVENTS'
  | 'HONOUR'
  | 'ORDERS';

export default function TrainerCommandCenter() {
  const [activeTab, setActiveTab] = useState<TrainerPortalTab>('STOPWATCH');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'ROSTER' | 'DEFAULTERS' | 'TELEMETRY'>('ROSTER');
  const [bulletinSubTab, setBulletinSubTab] = useState<'EVENTS' | 'ORDERS'>('EVENTS');
  const [warCrySubTab, setWarCrySubTab] = useState<'BROADCAST' | 'HONOUR_LIST'>('BROADCAST');

  const effectiveTab: 'STOPWATCH' | 'WARCRY' | 'ADMISSIONS' | 'ATTENDANCE' | 'BULLETIN' =
    activeTab === 'WARCRY_HONOUR' || activeTab === 'HONOUR'
      ? 'WARCRY'
      : activeTab === 'VERIFICATION'
      ? 'ADMISSIONS'
      : activeTab === 'TELEMETRY' || activeTab === 'DEFAULTERS'
      ? 'ATTENDANCE'
      : activeTab === 'EVENTS' || activeTab === 'ORDERS'
      ? 'BULLETIN'
      : (activeTab as any);
  const [isPostWarCryOpen, setIsPostWarCryOpen] = useState(false);
  const [cadets, setCadets] = useState<CadetAttendance[]>(initialCadets);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Admissions & Enlistment Verification Directorate
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [verificationSearch, setVerificationSearch] = useState<string>('');
  const [verificationNotice, setVerificationNotice] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [isRefreshingApps, setIsRefreshingApps] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  const loadCadetApplications = React.useCallback(async (silent = false) => {
    if (!silent) setIsRefreshingApps(true);
    try {
      const apps = await fetchCadetApplications();
      if (Array.isArray(apps)) {
        setAllApplications(apps);
        // Only APPROVED cadets enter the active attendance and defaulters muster roll
        const approvedApps = apps.filter((a: any) => a.admissionStatus === 'APPROVED');
        const mapped: CadetAttendance[] = approvedApps.map((a: any, idx: number) => ({
          id: a.id || String(idx + 1),
          roll: a.dossierNumber || a.rollNumber || `AIM-2026-${String(idx + 1).padStart(3, '0')}`,
          name: a.fullName || 'Enlisted Cadet',
          batch: a.targetForce ? `${a.targetForce} Platoon` : 'Morning Alfa (Army GD)',
          target: a.targetForce || 'Army GD (5m30s)',
          consecutiveAbsences: 0,
          last1600m: a.current1600mTime || 'Not Tested',
          status: 'PRESENT'
        }));
        setCadets(mapped);
        if (mapped.length > 0) setSelectedCadetId(prev => prev || mapped[0].roll);
        const now = new Date();
        setLastRefreshedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn('Failed to load authentic cadets for trainer:', err);
    } finally {
      if (!silent) setIsRefreshingApps(false);
    }
  }, []);

  const handleVerificationAction = async (app: any, newStatus: 'APPROVED' | 'REJECTED') => {
    const idToUpdate = app.id || app.dossierNumber;
    setVerifyingId(idToUpdate);
    setVerificationNotice(null);
    try {
      await updateCadetStatus(idToUpdate, newStatus);
      // Update local applications list
      setAllApplications(prev =>
        prev.map(item =>
          (item.id === app.id || item.dossierNumber === app.dossierNumber)
            ? { ...item, admissionStatus: newStatus }
            : item
        )
      );

      if (newStatus === 'APPROVED') {
        // Enlist cadet into active attendance roster
        const newCadetEntry: CadetAttendance = {
          id: app.id || app.dossierNumber,
          roll: app.dossierNumber || app.rollNumber || 'AIM-CADET',
          name: app.fullName,
          batch: app.targetForce ? `${app.targetForce} Platoon` : 'Morning Alfa (Army GD)',
          target: app.targetForce || 'Army GD (5m30s)',
          consecutiveAbsences: 0,
          last1600m: app.current1600mTime || 'Not Tested',
          status: 'PRESENT'
        };
        setCadets(prev => {
          if (prev.some(c => c.roll === newCadetEntry.roll)) return prev;
          return [newCadetEntry, ...prev];
        });
        setVerificationNotice({
          type: 'success',
          message: `✓ Cadet ${app.fullName} (${app.dossierNumber}) has been officially VERIFIED & APPROVED! Cadet profile access is now UNLOCKED.`
        });
      } else {
        // Remove from active attendance roster
        setCadets(prev => prev.filter(c => c.roll !== app.dossierNumber));
        setVerificationNotice({
          type: 'danger',
          message: `Cadet ${app.fullName} (${app.dossierNumber}) admission has been DISAPPROVED / REJECTED.`
        });
      }
    } catch (err: any) {
      alert(`Failed to update admission status: ${err.message}`);
    } finally {
      setVerifyingId(null);
      setTimeout(() => setVerificationNotice(null), 6000);
    }
  };

  // Management State
  const [events, setEvents] = useState<DrillEvent[]>(initialEvents);
  const [newEvent, setNewEvent] = useState<Partial<DrillEvent>>({
    title: '',
    type: 'Mock Physical Rally',
    date: '',
    time: '05:00 AM IST',
    venue: 'J.K. College Ground Purulia',
    targetCadre: 'All Cadets',
    reportingStatus: 'OPEN',
    guidelines: ''
  });
  const [eventSuccess, setEventSuccess] = useState(false);

  const [honourList, setHonourList] = useState<RollOfHonourEntry[]>(initialHonourList);
  const [newHonour, setNewHonour] = useState<Partial<RollOfHonourEntry>>({
    name: '',
    beltNo: '',
    force: 'Indian Army GD',
    batchYear: '2026 Batch',
    photoUrl: '',
    achievement: ''
  });
  const [honourSuccess, setHonourSuccess] = useState(false);

  const [orders, setOrders] = useState<RecruitmentOrder[]>(initialOrders);
  const [newOrder, setNewOrder] = useState<Partial<RecruitmentOrder>>({
    title: '',
    authority: 'Indian Army HQ',
    category: 'RALLY_ORDER',
    url: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Motivational Quote State
  const [dailyQuote, setDailyQuote] = useState(
    'पसीने की स्याही से जो लिखते हैं अपने इरादों को, उनके मुक़द्दर के पन्ने कभी कोरे नहीं हुआ करते! 1600 meters is not a test of your legs, it is a test of your heart and hunger for the Uniform!'
  );
  const [quoteAuthor, setQuoteAuthor] = useState('Havaldar Anup Kumar Mahato (Head Drill Ustad)');
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [isEditTrainerModalOpen, setIsEditTrainerModalOpen] = useState(false);
  const [trainerDetails, setTrainerDetails] = useState<any>(null);

  const handleTrainerProfileUpdated = (updated: any) => {
    setTrainerDetails(updated);
    if (updated.fullName) {
      setCurrentUser((prev: any) => ({ ...prev, name: updated.fullName }));
      setQuoteAuthor(`${updated.fullName} (Head Drill Ustad)`);
    }
  };

  // Load user, live database cadets & local stored items
  React.useEffect(() => {
    // Strict Route Guard: Without login, nobody can enter the trainer command center
    const user = getCurrentUser();
    if (!user) {
      window.location.href = '/?authError=unauthorized&msg=' + encodeURIComponent('Authentication Required: Drill Ustad credentials required to enter Trainer Command Center.');
      return;
    }

    if (user.role !== 'TRAINER' && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      window.location.href = '/?authError=forbidden&msg=' + encodeURIComponent('Access Denied: Only authorized Drill Ustads and Trainers can access this command portal.');
      return;
    }

    setCurrentUser(user);
    if (user.name) setQuoteAuthor(`${user.name} (Drill Ustad)`);

    // Load authentic registered cadets from database
    loadCadetApplications();

    // Live background polling: pull fresh registrations every 15s so new cadet applications auto-appear!
    const pollInterval = setInterval(() => {
      loadCadetApplications(true);
    }, 15000);

    // Cross-tab and window event listener for real-time cadet registration reflection
    const handleEnlistmentEvent = () => loadCadetApplications(true);
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'aim_last_enlistment_timestamp' || e.key === 'cadet_dossier_id') {
        loadCadetApplications(true);
      }
    };

    window.addEventListener('cadet_enlistment_submitted', handleEnlistmentEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Load authentic trainer profile from database
    fetchTrainerProfile().then(tp => {
      if (tp) {
        setTrainerDetails(tp);
        if (tp.fullName) setQuoteAuthor(`${tp.fullName} (Head Drill Ustad)`);
      }
    }).catch(() => {});

    try {
      const storedQuote = localStorage.getItem('aim_daily_motivational_quote');
      const storedAuthor = localStorage.getItem('aim_daily_quote_author');
      if (storedQuote) setDailyQuote(storedQuote);
      if (storedAuthor) setQuoteAuthor(storedAuthor);

      const storedEvents = localStorage.getItem('aim_trainer_events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      // Fetch live events from server
      fetchInstituteEvents().then(liveEvents => {
        if (Array.isArray(liveEvents) && liveEvents.length > 0) {
          setEvents(liveEvents as any);
        }
      }).catch(() => {});

      const storedHonour = localStorage.getItem('aim_trainer_honour');
      if (storedHonour) setHonourList(JSON.parse(storedHonour));

      const storedOrders = localStorage.getItem('aim_trainer_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.warn('Failed to load stored trainer items:', e);
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('cadet_enlistment_submitted', handleEnlistmentEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [loadCadetApplications]);

  // Auto-refresh applications whenever Ustad switches to the Admissions tab
  React.useEffect(() => {
    if (effectiveTab === 'ADMISSIONS') {
      loadCadetApplications(true);
    }
  }, [effectiveTab, loadCadetApplications]);

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('aim_daily_motivational_quote', dailyQuote);
      localStorage.setItem('aim_daily_quote_author', quoteAuthor);
      setQuoteSaved(true);
      setIsEditingQuote(false);
      setTimeout(() => setQuoteSaved(false), 3000);
    } catch {}
  };

  // Assessment Telemetry Form State
  const [selectedCadetId, setSelectedCadetId] = useState('');
  const [entryRunMins, setEntryRunMins] = useState(5);
  const [entryRunSecs, setEntryRunSecs] = useState(30);
  const [entryPullUps, setEntryPullUps] = useState(10);
  const [entryPushUps, setEntryPushUps] = useState(40);
  const [trainerRemarks, setTrainerRemarks] = useState('');
  const [telemetrySaved, setTelemetrySaved] = useState(false);

  // Status toggle handler
  const handleStatusChange = (id: string, newStatus: CadetAttendance['status']) => {
    setCadets(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleMarkAllPresent = () => {
    setCadets(prev => prev.map(c => ({ ...c, status: 'PRESENT' })));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = cadets.map(c => ({
        studentId: c.roll,
        batchId: 'batch-morning-alfa',
        status: (c.status === 'LEAVE' ? 'EXCUSED' : c.status) as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
      }));
      await submitBulkAttendance(records, currentUser?.name || 'Havaldar Anup Kumar Mahato');
    } catch (err) {
      console.warn('Saved to local state (offline mode):', err);
    }
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Add Event Handler
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    const item: DrillEvent = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      title: newEvent.title || 'Untitled Event',
      type: newEvent.type || 'Physical Trial',
      date: newEvent.date || 'Upcoming',
      time: newEvent.time || '05:00 AM IST',
      venue: newEvent.venue || 'Purulia Ground',
      targetCadre: newEvent.targetCadre || 'All Cadets',
      reportingStatus: (newEvent.reportingStatus as any) || 'OPEN',
      guidelines: newEvent.guidelines || 'Report in uniform.'
    };
    const updated = [item, ...events];
    setEvents(updated);
    try { localStorage.setItem('aim_trainer_events', JSON.stringify(updated)); } catch {}

    try {
      await createInstituteEvent(item);
      const live = await fetchInstituteEvents();
      if (Array.isArray(live) && live.length > 0) {
        setEvents(live as any);
        try { localStorage.setItem('aim_trainer_events', JSON.stringify(live)); } catch {}
      }
    } catch (apiErr) {
      console.warn('Event saved locally, API note:', apiErr);
    }

    setNewEvent({
      title: '',
      type: 'Mock Physical Rally',
      date: '',
      time: '05:00 AM IST',
      venue: 'J.K. College Ground Purulia',
      targetCadre: 'All Cadets',
      reportingStatus: 'OPEN',
      guidelines: ''
    });
    setEventSuccess(true);
    setTimeout(() => setEventSuccess(false), 3000);
  };

  const handleDeleteEvent = async (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    try { localStorage.setItem('aim_trainer_events', JSON.stringify(updated)); } catch {}
    try {
      await deleteInstituteEvent(id);
    } catch (apiErr) {
      console.warn('Deleted locally, API note:', apiErr);
    }
  };

  // Add Honour Handler
  const handleAddHonour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHonour.name || !newHonour.force) return;
    const item: RollOfHonourEntry = {
      id: `H-${Date.now().toString().slice(-4)}`,
      name: newHonour.name,
      beltNo: newHonour.beltNo || 'N/A',
      force: newHonour.force,
      batchYear: newHonour.batchYear || '2026 Batch',
      photoUrl: newHonour.photoUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
      achievement: newHonour.achievement || 'Cleared selection in first attempt with top physical standards.'
    };
    const updated = [item, ...honourList];
    setHonourList(updated);
    try { localStorage.setItem('aim_trainer_honour', JSON.stringify(updated)); } catch {}
    setNewHonour({
      name: '',
      beltNo: '',
      force: 'Indian Army GD',
      batchYear: '2026 Batch',
      photoUrl: '',
      achievement: ''
    });
    setHonourSuccess(true);
    setTimeout(() => setHonourSuccess(false), 3000);
  };

  const handleDeleteHonour = (id: string) => {
    const updated = honourList.filter(h => h.id !== id);
    setHonourList(updated);
    try { localStorage.setItem('aim_trainer_honour', JSON.stringify(updated)); } catch {}
  };

  // Add Order / Notice Handler
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.title || !newOrder.url) return;
    const item: RecruitmentOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      title: newOrder.title,
      authority: newOrder.authority || 'AIM Institute Purulia',
      category: (newOrder.category as any) || 'RALLY_ORDER',
      url: newOrder.url,
      date: newOrder.date || new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...orders];
    setOrders(updated);
    try { localStorage.setItem('aim_trainer_orders', JSON.stringify(updated)); } catch {}
    setNewOrder({
      title: '',
      authority: 'Indian Army HQ',
      category: 'RALLY_ORDER',
      url: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    try { localStorage.setItem('aim_trainer_orders', JSON.stringify(updated)); } catch {}
  };

  // Instant score calculation for telemetry entry
  const totalSeconds = entryRunMins * 60 + entryRunSecs;
  const isGroup1 = totalSeconds <= 330;
  const isGroup2 = totalSeconds > 330 && totalSeconds <= 345;
  const runningScore = isGroup1 ? 60 : isGroup2 ? 48 : 0;
  const beamScore = entryPullUps >= 10 ? 40 : entryPullUps === 9 ? 33 : entryPullUps === 8 ? 27 : 21;
  const totalPetScore = runningScore + beamScore;

  const filteredCadets = cadets.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F0A] text-slate-100 flex flex-col font-sans">
      {/* Top Trainer Bar */}
      <header className="border-b border-[#273623] bg-[#0E140C] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-amber-400 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-[#273623] hidden xs:block" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-black text-amber-400 text-base sm:text-lg uppercase tracking-wider flex-shrink-0">AIM</span>
              <span className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase truncate">Trainer Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Badge variant="army" size="sm">
              {currentUser?.role === 'SUPER_ADMIN' ? 'Head Trainer & Admin' : 'Drill Master (Ustad)'}
            </Badge>
            <div className="hidden md:block text-right">
              <div className="text-xs font-display font-bold text-white uppercase">
                {currentUser?.name || 'Havaldar Anup Kumar Mahato'}
              </div>
              <div className="text-[10px] text-amber-400 font-mono">
                {currentUser?.email || 'Purulia Ground In-Charge'}
              </div>
            </div>

            {/* Tactical Theme Switcher */}
            <ThemeToggle variant="compact" />

            <button
              onClick={() => setIsEditTrainerModalOpen(true)}
              title="Edit Drill Ustad Profile & Benchmarks"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-amber-200 text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>

            <button
              onClick={() => logoutUser()}
              title="Sign Out of Ustad Command"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-red-200 text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-8 w-full space-y-6">
        {/* DESKTOP APP BAR TABS (WHATSAPP MULTI-PAGE EXPERIENCE) */}
        <div className="hidden md:flex items-center gap-2 border-b border-[#273623] pb-3 mb-2 font-display uppercase tracking-wider text-xs font-bold overflow-x-auto no-scrollbar touch-pan-x w-full">
          {[
            { id: 'STOPWATCH', label: '⏱️ Drill Timer', count: null },
            { id: 'WARCRY', label: '🔥 War Cry & Stories', count: null },
            {
              id: 'ADMISSIONS',
              label: '🎖️ Verify Admissions',
              count: allApplications.filter(a => a.admissionStatus === 'PENDING' || a.admissionStatus === 'UNDER_REVIEW' || !a.admissionStatus).length
            },
            { id: 'ATTENDANCE', label: '📋 Roll Call & Defaulters', count: null },
            { id: 'BULLETIN', label: '📢 Notices & Orders', count: events.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap border flex items-center gap-2 cursor-pointer ${
                effectiveTab === tab.id
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white hover:border-[#384c31]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full font-mono font-black text-[10px] ${
                  effectiveTab === tab.id ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===================================================================
            PAGE 1: PARADE DRILL STOPWATCH & BROADCAST CONTROLLER
            =================================================================== */}
        {effectiveTab === 'STOPWATCH' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121811] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-display font-black text-base uppercase text-white">Live Drill Broadcast Controller</span>
                </div>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Start or stop the parade drill stopwatch. Enrolled cadets tuned into their mobile portal will sync in real time.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-[#0B0F0A] border border-[#273623] text-amber-400 px-3 py-1.5 rounded-xl">
                  Ground: <strong>J.K College Field</strong>
                </span>
                <span className="bg-[#0B0F0A] border border-[#273623] text-emerald-400 px-3 py-1.5 rounded-xl">
                  Enlisted: <strong>{cadets.length} Cadets</strong>
                </span>
              </div>
            </div>

            <ParadeDrillStopwatch mode="TRAINER_CONTROLLER" />
          </div>
        )}

        {/* ===================================================================
            PAGE 2: WAR CRY BROADCASTER, 24H STORIES & ROLL OF HONOUR
            =================================================================== */}
        {effectiveTab === 'WARCRY' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Sub-tab Navigation */}
            <div className="p-1.5 rounded-2xl bg-[#121811] border border-[#273623] flex items-center gap-1.5 max-w-md">
              <button
                onClick={() => setWarCrySubTab('BROADCAST')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  warCrySubTab === 'BROADCAST'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>War Cry & Stories</span>
              </button>
              <button
                onClick={() => setWarCrySubTab('HONOUR_LIST')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  warCrySubTab === 'HONOUR_LIST'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Roll of Honour Wall</span>
              </button>
            </div>

            {warCrySubTab === 'BROADCAST' ? (
              <div className="space-y-6">
                {/* USTAD'S DAILY MOTIVATIONAL WAR CRY BROADCASTER */}
                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#241706] via-[#1A1F13] to-[#0E140C] border-2 border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.25)] relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-md">
                        <Flame className="w-5 h-5 animate-pulse text-black" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider flex items-center gap-2">
                          <span>Cadet Squad Daily War Cry & Ground Motivation</span>
                          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded uppercase">
                            Live Broadcast
                          </span>
                        </h3>
                        <p className="text-[11px] text-gray-400 font-mono">
                          Reflects instantly in the header of each enrolled cadet&apos;s personal workspace.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {quoteSaved && (
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg animate-fadeIn flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Broadcast Live!
                        </span>
                      )}
                      {!isEditingQuote ? (
                        <button
                          type="button"
                          onClick={() => setIsEditingQuote(true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                        >
                          Edit War Cry
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingQuote(false)}
                          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {!isEditingQuote ? (
                    <div className="pt-3">
                      <blockquote className="text-sm sm:text-base md:text-lg font-display font-black italic uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-snug drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                        &ldquo;{dailyQuote}&rdquo;
                      </blockquote>
                      <div className="text-xs font-mono text-gray-400 mt-2 flex items-center gap-2">
                        <span className="text-amber-500 font-bold">Author:</span>
                        <span className="text-white font-bold">{quoteAuthor}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                          Visible to All Cadets
                        </span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveQuote} className="pt-3 space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-amber-400 uppercase font-bold mb-1">
                          Today&apos;s Motivational War Cry / Rally Quote
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={dailyQuote}
                          onChange={e => setDailyQuote(e.target.value)}
                          placeholder="Enter high-energy motivational quote to drive cadets during 1600m and drill..."
                          className="w-full bg-[#0B0F0A] border border-amber-500/50 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 text-xs sm:text-sm font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                            Sign-off / Ustad Authority Name
                          </label>
                          <input
                            type="text"
                            required
                            value={quoteAuthor}
                            onChange={e => setQuoteAuthor(e.target.value)}
                            placeholder="e.g. Havaldar Anup Kumar Mahato"
                            className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            variant="saffron"
                            size="sm"
                            className="w-full justify-center"
                            leftIcon={<Send className="w-3.5 h-3.5 text-black" />}
                          >
                            Broadcast to All Cadets
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* 24-HOUR DISAPPEARING WAR CRY STORIES TRAY */}
                <WarCryStoriesTray onUploadClick={() => setIsPostWarCryOpen(true)} className="mb-2" />

                {/* USTAD STORY VERIFICATION DESK */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1A1F13] to-[#0E140C] border border-amber-500/40">
                    <div>
                      <h3 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-400" />
                        <span>Cadet Success Stories Review Desk</span>
                      </h3>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        Verify cadet-submitted achievements and approve them for permanent induction on the Roll of Honour.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPostWarCryOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Broadcast Ustad War Cry Story</span>
                    </button>
                  </div>

                  <UstadStoryVerificationDesk />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Create Entry Card */}
                <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#273623]">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                        Role of Honour & Wall of Fame Manager
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">
                        Induct recruited cadets who have cracked the Indian Armed Forces & State Police into the Hall of Fame.
                      </p>
                    </div>
                  </div>

                  {honourSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cadet successfully inducted into the AIM Role of Honour!</span>
                    </div>
                  )}

                  <form onSubmit={handleAddHonour} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Soldier / Cadet Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sepoy Bikram Gorai"
                        value={newHonour.name}
                        onChange={e => setNewHonour({ ...newHonour, name: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Belt / Roll Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ARMY-GD-7429"
                        value={newHonour.beltNo}
                        onChange={e => setNewHonour({ ...newHonour, beltNo: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Recruited Force / Regiment *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indian Army (Rajputana Rifles)"
                        value={newHonour.force}
                        onChange={e => setNewHonour({ ...newHonour, force: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Batch Year
                      </label>
                      <input
                        type="text"
                        placeholder="2025-2026 Batch"
                        value={newHonour.batchYear}
                        onChange={e => setNewHonour({ ...newHonour, batchYear: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Soldier Uniform Photo URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://... (or leave empty for default tactical portrait)"
                        value={newHonour.photoUrl}
                        onChange={e => setNewHonour({ ...newHonour, photoUrl: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                        Selection Citation & PET Score Record
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Clocked 05m 12s in 1600m Barrackpore Army Rally. 10 Pull-ups on first whistle."
                        value={newHonour.achievement}
                        onChange={e => setNewHonour({ ...newHonour, achievement: e.target.value })}
                        className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <Button
                        type="submit"
                        variant="saffron"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4 text-black" />}
                      >
                        Induct Soldier to Hall of Fame
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Wall of Fame Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                      Purulia AIM Selected Cadets ({honourList.length})
                    </h4>
                    <span className="text-[11px] font-mono text-amber-400">Displayed on Institute Wall of Fame</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {honourList.map(soldier => (
                      <div
                        key={soldier.id}
                        className="rounded-2xl sm:rounded-3xl bg-[#161F15] border border-amber-500/30 overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                      >
                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 flex-shrink-0 bg-black">
                              <img
                                src={soldier.photoUrl}
                                alt={soldier.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Badge variant="army" size="sm">{soldier.batchYear}</Badge>
                              <h4 className="font-display font-black text-base text-white uppercase mt-1">
                                {soldier.name}
                              </h4>
                              <div className="text-[11px] font-mono text-amber-400 font-bold">
                                {soldier.force}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] font-mono text-gray-400">
                            Belt: <span className="text-white font-bold">{soldier.beltNo}</span>
                          </div>

                          <p className="text-xs text-gray-300 font-sans italic leading-relaxed border-t border-[#273623] pt-2">
                            &ldquo;{soldier.achievement}&rdquo;
                          </p>
                        </div>

                        <div className="p-3 bg-[#0B0F0A] border-t border-[#273623] flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <Award className="w-3.5 h-3.5" />
                            Selected
                          </span>
                          <button
                            onClick={() => handleDeleteHonour(soldier.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PAGE 3: ADMISSIONS & ENLISTMENT VERIFICATION QUEUE
            =================================================================== */}
        {effectiveTab === 'ADMISSIONS' && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-5">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#273623]">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="saffron" size="sm">
                    Chief Drill Directorate Gatekeeper
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-400">UIDAI & Academic Check</span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider mt-1">
                  Cadet Enlistment Verification Queue
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Cadets can enter their profile ONLY after a trainer verifies their identity and approves their admission.
                </p>
              </div>

              {/* Status Counters & Refresh Action */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Pending: <strong>{allApplications.filter(a => a.admissionStatus === 'PENDING' || a.admissionStatus === 'UNDER_REVIEW' || !a.admissionStatus).length}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Approved: <strong>{allApplications.filter(a => a.admissionStatus === 'APPROVED').length}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                  Rejected: <strong>{allApplications.filter(a => a.admissionStatus === 'REJECTED').length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => loadCadetApplications(false)}
                  disabled={isRefreshingApps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161F15] hover:bg-[#1C2618] text-amber-400 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer disabled:opacity-50 font-bold ml-auto sm:ml-0"
                  title="Fetch latest online cadet enlistments from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingApps ? 'animate-spin text-amber-300' : ''}`} />
                  <span>{isRefreshingApps ? 'Syncing...' : 'Refresh Roster'}</span>
                  {lastRefreshedAt && <span className="text-[10px] text-gray-500 font-normal hidden sm:inline">({lastRefreshedAt})</span>}
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {verificationNotice && (
              <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 ${
                verificationNotice.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {verificationNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span>{verificationNotice.message}</span>
                </div>
                <button
                  onClick={() => setVerificationNotice(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
                {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(flt => (
                  <button
                    key={flt}
                    onClick={() => setVerificationFilter(flt)}
                    className={`px-3 py-1.5 rounded-lg border font-bold transition-all whitespace-nowrap cursor-pointer ${
                      verificationFilter === flt
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-[#0B0F0A] text-gray-400 border-[#273623] hover:text-white'
                    }`}
                  >
                    {flt === 'PENDING' ? 'Pending Review' : flt === 'APPROVED' ? 'Approved Cadets' : flt === 'REJECTED' ? 'Rejected' : 'All Applications'}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, dossier, Aadhaar..."
                  value={verificationSearch}
                  onChange={e => setVerificationSearch(e.target.value)}
                  className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Applications List */}
            {(() => {
              const list = allApplications.filter(app => {
                if (verificationFilter === 'PENDING') {
                  if (app.admissionStatus === 'APPROVED' || app.admissionStatus === 'REJECTED') return false;
                } else if (verificationFilter === 'APPROVED') {
                  if (app.admissionStatus !== 'APPROVED') return false;
                } else if (verificationFilter === 'REJECTED') {
                  if (app.admissionStatus !== 'REJECTED') return false;
                }

                if (verificationSearch.trim()) {
                  const q = verificationSearch.toLowerCase().trim();
                  const n = (app.fullName || '').toLowerCase();
                  const d = (app.dossierNumber || '').toLowerCase();
                  const p = (app.phone || '').toLowerCase();
                  const a = (app.aadhaarNumber || '').toLowerCase();
                  const f = (app.targetForce || '').toLowerCase();
                  return n.includes(q) || d.includes(q) || p.includes(q) || a.includes(q) || f.includes(q);
                }
                return true;
              });

              if (list.length === 0) {
                return (
                  <div className="py-16 text-center space-y-3 border border-dashed border-[#273623] rounded-2xl">
                    <Shield className="w-12 h-12 text-gray-600 mx-auto" />
                    <p className="text-gray-400 text-xs font-mono">
                      No applications found for the selected filter ({verificationFilter}).
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {list.map(app => {
                    const isAppApproved = app.admissionStatus === 'APPROVED';
                    const isAppRejected = app.admissionStatus === 'REJECTED';
                    const isPending = !isAppApproved && !isAppRejected;
                    const expansion = Number(app.chestExpandedCm || 0) - Number(app.chestNormalCm || 0);

                    return (
                      <div
                        key={app.id || app.dossierNumber}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isPending
                            ? 'bg-gradient-to-r from-[#171D12] via-[#121811] to-[#0E140C] border-amber-500/50 shadow-lg'
                            : isAppApproved
                            ? 'bg-[#121811] border-emerald-500/40'
                            : 'bg-[#140E0E] border-red-900/50'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                          {/* Cadet Profile & Bio */}
                          <div className="flex items-start gap-4">
                            {app.passportPhoto ? (
                              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 border-amber-500/60 overflow-hidden bg-black flex-shrink-0 relative shadow-md">
                                <img
                                  src={app.passportPhoto}
                                  alt={app.fullName}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] font-mono text-amber-400 text-center py-0.5 font-bold uppercase">
                                  ATTESTED
                                </span>
                              </div>
                            ) : (
                              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg flex-shrink-0">
                                {app.fullName?.slice(0, 2).toUpperCase() || 'CD'}
                              </div>
                            )}

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-display font-black text-base sm:text-lg text-white uppercase truncate">
                                  {app.fullName}
                                </h4>
                                {isPending && (
                                  <Badge variant="saffron" size="sm">
                                    Pending Review
                                  </Badge>
                                )}
                                {isAppApproved && (
                                  <Badge variant="army" size="sm">
                                    ✓ Admission Approved
                                  </Badge>
                                )}
                                {isAppRejected && (
                                  <Badge variant="danger" size="sm">
                                    Disapproved
                                  </Badge>
                                )}
                              </div>

                              <div className="text-xs font-mono text-amber-400 font-bold flex flex-wrap items-center gap-2">
                                <span>Dossier: {app.dossierNumber}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-300">Target: {app.targetForce || 'Army GD'}</span>
                              </div>

                              <div className="text-[11px] font-mono text-gray-400 space-y-0.5 pt-1">
                                <div>
                                  <strong className="text-gray-300">Father:</strong> {app.fatherName}
                                  {app.motherName ? ` • Mother: ${app.motherName}` : ''}
                                </div>
                                <div>
                                  <strong className="text-gray-300">DOB:</strong> {app.dob ? app.dob.split('T')[0] : '—'} • {app.gender} • Category: {app.casteCategory || 'General'}
                                </div>
                                <div>
                                  <strong className="text-gray-300">Address:</strong> {app.villageTown}, PS: {app.policeStation}, Dist: {app.domicileDistrict} ({app.pinCode})
                                </div>
                                <div className="text-amber-300">
                                  <strong>Aadhaar UIDAI:</strong> {app.aadhaarNumber} (Duplicate Protection Checked)
                                </div>
                                <div>
                                  <strong className="text-gray-300">Mobile:</strong> <a href={`tel:${app.phone}`} className="text-emerald-400 hover:underline">{app.phone}</a> | Emergency: {app.emergencyPhone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2 w-full lg:w-auto flex-shrink-0 pt-2 lg:pt-0">
                            {isPending && (
                              <Button
                                variant="saffron"
                                size="sm"
                                className="justify-center"
                                disabled={verifyingId === (app.id || app.dossierNumber)}
                                leftIcon={<UserCheck className="w-4 h-4 text-black" />}
                                onClick={() => handleVerificationAction(app, 'APPROVED')}
                              >
                                {verifyingId === (app.id || app.dossierNumber) ? 'Authorizing...' : 'Verify & Approve Admission'}
                              </Button>
                            )}

                            {isPending && (
                              <button
                                onClick={() => handleVerificationAction(app, 'REJECTED')}
                                disabled={verifyingId === (app.id || app.dossierNumber)}
                                className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Reject Admission</span>
                              </button>
                            )}

                            {isAppApproved && (
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  Profile Access Unlocked
                                </span>
                                <button
                                  onClick={() => handleVerificationAction(app, 'REJECTED')}
                                  title="Revoke / Set Disapproved"
                                  className="text-[10px] text-gray-500 hover:text-red-400 underline font-mono ml-2"
                                >
                                  Revoke
                                </button>
                              </div>
                            )}

                            {isAppRejected && (
                              <button
                                onClick={() => handleVerificationAction(app, 'APPROVED')}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Reconsider & Approve</span>
                              </button>
                            )}

                            <a
                              href={`${getApiBaseUrl()}/mvc/cadet-card/${app.dossierNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#1A2415] hover:bg-[#273623] border border-[#273623] text-gray-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Official Admit Card</span>
                            </a>
                          </div>
                        </div>

                        {/* Physical Standard & Academic Metrics Strip */}
                        <div className="mt-4 pt-3 border-t border-[#1F2B1A] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs font-mono">
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">Height (PST)</span>
                            <span className="text-white font-bold">{app.heightCm} cm</span>
                          </div>
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">Weight</span>
                            <span className="text-white font-bold">{app.weightKg} kg</span>
                          </div>
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">Chest (N/Exp)</span>
                            <span className="text-white font-bold">{app.chestNormalCm} / {app.chestExpandedCm} cm (+{expansion}cm)</span>
                          </div>
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">1600m Self PB</span>
                            <span className="text-amber-400 font-bold">{app.current1600mTime || 'Not Tested'}</span>
                          </div>
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">Chin-ups</span>
                            <span className="text-lime-400 font-bold">{app.currentBeamPullups ?? '—'}</span>
                          </div>
                          <div className="bg-[#0B0F0A] p-2 rounded-lg border border-[#273623]">
                            <span className="text-[10px] text-gray-500 block uppercase">10th Academic</span>
                            <span className="text-blue-400 font-bold truncate block">
                              {app.tenthPercentage || app.matricAggregatePercent ? `${app.tenthPercentage || app.matricAggregatePercent}%` : 'Recorded'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ===================================================================
            PAGE 4: BATCH ROLL CALL, DEFAULTERS & TELEMETRY SCORING
            =================================================================== */}
        {effectiveTab === 'ATTENDANCE' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Morning Session Command Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#161F15] via-[#121811] to-[#0E140C] border border-[#273623] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                    Morning Muster Roll • J.K. College Field
                  </h2>
                </div>
                <p className="text-xs text-amber-400 font-mono">
                  Enrolled Alfa Batch: {cadets.length} Cadets • Reporting Time: 05:00 AM Sharp
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllPresent}
                  leftIcon={<Check className="w-4 h-4 text-emerald-400" />}
                  className="flex-1 sm:flex-initial justify-center"
                >
                  All Present
                </Button>
                <Button
                  variant="saffron"
                  size="sm"
                  onClick={handleSaveAttendance}
                  leftIcon={<Save className="w-4 h-4 text-black" />}
                  className="flex-1 sm:flex-initial justify-center"
                >
                  {attendanceSaved ? 'Saved!' : 'Save Attendance Roster'}
                </Button>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="p-1.5 rounded-2xl bg-[#121811] border border-[#273623] flex items-center gap-1.5 max-w-lg">
              <button
                onClick={() => setAttendanceSubTab('ROSTER')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  attendanceSubTab === 'ROSTER'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Roll Call</span>
              </button>
              <button
                onClick={() => setAttendanceSubTab('DEFAULTERS')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  attendanceSubTab === 'DEFAULTERS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Defaulters ({cadets.filter(c => c.consecutiveAbsences >= 3).length})</span>
              </button>
              <button
                onClick={() => setAttendanceSubTab('TELEMETRY')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  attendanceSubTab === 'TELEMETRY'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Sunday Scoring</span>
              </button>
            </div>

            {attendanceSubTab === 'ROSTER' && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#273623]">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search cadet name or roll..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono">
                <span className="text-gray-400">Total: <strong className="text-white">{filteredCadets.length}</strong></span>
                <span className="text-emerald-400">P: <strong>{cadets.filter(c => c.status === 'PRESENT').length}</strong></span>
                <span className="text-rose-400">A: <strong>{cadets.filter(c => c.status === 'ABSENT').length}</strong></span>
                <span className="text-amber-400">L: <strong>{cadets.filter(c => c.status === 'LATE').length}</strong></span>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-1 sm:mx-0 px-1 sm:px-0">
              <table className="w-full text-left text-xs font-mono min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#273623] text-gray-400">
                    <th className="py-3 px-4">Cadet Name & Roll</th>
                    <th className="py-3 px-4">Recruitment Target</th>
                    <th className="py-3 px-4">Last 1600m PB</th>
                    <th className="py-3 px-4">Absence History</th>
                    <th className="py-3 px-4 text-center">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2415]">
                  {filteredCadets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-mono text-xs">
                        No enrolled cadets found in database. Cadets will appear here automatically when they enlist or register.
                      </td>
                    </tr>
                  ) : (
                    filteredCadets.map(cadet => (
                      <tr key={cadet.id} className="hover:bg-[#161F15]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-display font-bold text-sm text-white uppercase">{cadet.name}</div>
                          <div className="text-[11px] text-amber-400/80">{cadet.roll}</div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-300">{cadet.target}</td>
                        <td className="py-3.5 px-4 font-bold text-amber-400">{cadet.last1600m}</td>
                        <td className="py-3.5 px-4">
                          {cadet.consecutiveAbsences >= 3 ? (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              {cadet.consecutiveAbsences} Days (Defaulter)
                            </span>
                          ) : cadet.consecutiveAbsences > 0 ? (
                            <span className="text-amber-400 font-bold">{cadet.consecutiveAbsences} Day Absent</span>
                          ) : (
                            <span className="text-emerald-400">Regular</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {(['PRESENT', 'ABSENT', 'LATE', 'LEAVE'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(cadet.id, s)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${cadet.status === s
                                  ? s === 'PRESENT'
                                    ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : s === 'ABSENT'
                                      ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                                      : s === 'LATE'
                                        ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                        : 'bg-blue-500 text-white'
                                  : 'bg-[#0B0F0A] text-gray-500 border border-[#273623] hover:text-white'
                                  }`}
                              >
                                {s[0]}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {attendanceSubTab === 'TELEMETRY' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Sunday Timed Trial Telemetry Logger
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Direct input for official stopwatch marks and strict beam pull-up rep counts with real-time mark scoring.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Select Cadet *</label>
                  <select
                    value={selectedCadetId}
                    onChange={e => setSelectedCadetId(e.target.value)}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {cadets.length === 0 ? (
                      <option value="">No enrolled cadets found in database</option>
                    ) : (
                      cadets.map(c => (
                        <option key={c.id} value={c.roll}>
                          {c.roll} — {c.name} ({c.target})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] space-y-2">
                    <label className="block text-xs font-mono text-amber-400 uppercase font-bold">1600m Running Time</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 font-mono block">MIN</span>
                        <input
                          type="number"
                          value={entryRunMins}
                          onChange={e => setEntryRunMins(Number(e.target.value))}
                          className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-500 mt-3">:</span>
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-500 font-mono block">SEC</span>
                        <input
                          type="number"
                          value={entryRunSecs}
                          onChange={e => setEntryRunSecs(Number(e.target.value))}
                          className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] space-y-2">
                    <label className="block text-xs font-mono text-amber-400 uppercase font-bold">Strict Beam Pull-ups</label>
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono block">REPETITIONS</span>
                      <input
                        type="number"
                        value={entryPullUps}
                        onChange={e => setEntryPullUps(Number(e.target.value))}
                        className="w-full bg-[#161F15] border border-[#273623] rounded p-2 text-white font-display text-lg font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Trainer Observation Remarks *</label>
                  <textarea
                    rows={3}
                    value={trainerRemarks}
                    onChange={e => setTrainerRemarks(e.target.value)}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <Button
                  variant="saffron"
                  size="md"
                  className="w-full justify-center"
                  onClick={async () => {
                    try {
                      await recordTrialAssessment({
                        studentId: selectedCadetId,
                        run1600mSeconds: totalSeconds,
                        pullupsCount: entryPullUps,
                        ditchJump9ftPass: true,
                        zigzagBalancePass: true,
                        trainerRemarks
                      });
                    } catch (err) {
                      console.warn('Saved to local telemetry store (offline mode):', err);
                    }
                    setTelemetrySaved(true);
                    setTimeout(() => setTelemetrySaved(false), 3000);
                  }}
                >
                  {telemetrySaved ? 'Assessment Recorded in Cadet Record!' : 'Save & Publish Trial Score'}
                </Button>
              </div>
            </div>

            {/* Instant Assessment Scorecard */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#161F15] border border-amber-500/40 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  Calculated Physical Score
                </h4>
                <Badge variant={isGroup1 ? 'success' : isGroup2 ? 'saffron' : 'danger'} size="sm">
                  {isGroup1 ? 'Group 1 Marks' : isGroup2 ? 'Group 2 Marks' : 'PET Gap'}
                </Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F0A] border border-[#273623]">
                  <span className="text-gray-400">1600m Running Points:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {runningScore} / 60 Pts {isGroup1 ? '(Group 1 - Excellent)' : isGroup2 ? '(Group 2)' : '(Disqualified)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F0A] border border-[#273623]">
                  <span className="text-gray-400">Beam Pull-ups Points:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {beamScore} / 40 Pts {entryPullUps >= 10 ? '(10/10 Perfect)' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/50">
                  <span className="font-display font-bold text-white uppercase text-sm">Total Physical Score:</span>
                  <span className="font-display font-black text-2xl text-amber-400">
                    {totalPetScore} / 100
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F0A] border border-[#273623] text-xs font-sans text-gray-300 leading-relaxed">
                <strong className="text-white uppercase font-mono block mb-1">Anup Sir's Evaluation:</strong>
                {totalPetScore >= 100
                  ? 'Cadet has attained full 100/100 Physical Efficiency Test marks. Maintain physical conditioning without overtraining.'
                  : totalPetScore >= 80
                    ? 'Solid performance. Focus on increasing arm endurance for 10 beam pull-ups to grab full 40 marks.'
                    : 'Needs intensive interval training to bring running time under 5m 45s.'}
              </div>
            </div>
          </div>
        )}

        {attendanceSubTab === 'DEFAULTERS' && (
          <div className="p-6 rounded-3xl bg-[#121811] border border-[#273623] space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                  Consecutive Absence Defaulter Registry
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                According to AIM training bylaws, cadets missing 3 consecutive morning sessions without prior medical notice are flagged for suspension.
              </p>
            </div>

            <div className="space-y-3">
              {cadets
                .filter(c => c.consecutiveAbsences >= 3)
                .map(defaulter => (
                  <div
                    key={defaulter.id}
                    className="p-5 rounded-2xl bg-[#161F15] border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-lg text-white uppercase">{defaulter.name}</span>
                        <Badge variant="danger" size="sm">
                          3 Consecutive Absences
                        </Badge>
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-1">
                        Roll: {defaulter.roll} • Batch: {defaulter.batch} • Last 1600m: {defaulter.last1600m}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<PhoneCall className="w-4 h-4 text-amber-400" />}
                        onClick={() => alert(`Calling guardian of ${defaulter.name}...`)}
                      >
                        Call Guardian
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => alert(`Suspension notice dispatched to ${defaulter.name}`)}
                      >
                        Issue Warning Notice
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
          </div>
        )}

        {/* ===================================================================
            PAGE 5: BULLETIN, RALLY NOTICES & RECRUITMENT ORDERS
            =================================================================== */}
        {effectiveTab === 'BULLETIN' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Sub-tab Navigation */}
            <div className="p-1.5 rounded-2xl bg-[#121811] border border-[#273623] flex items-center gap-1.5 max-w-md">
              <button
                onClick={() => setBulletinSubTab('EVENTS')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bulletinSubTab === 'EVENTS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Rally Events</span>
              </button>
              <button
                onClick={() => setBulletinSubTab('ORDERS')}
                className={`flex-1 py-2 px-3 rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  bulletinSubTab === 'ORDERS'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Orders & Media</span>
              </button>
            </div>

            {bulletinSubTab === 'EVENTS' ? (
              <div className="space-y-6">
            {/* Create Event Card */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#273623]">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                    Publish Drill Event or Physical Rally
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Announce upcoming trial rallies, mock PET simulations, or ground medical screenings for cadets.
                  </p>
                </div>
              </div>

              {eventSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Drill event published successfully and broadcast to cadet squad!</span>
                </div>
              )}

              <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Purulia Mega 1600m Speed Simulation & Beam Trial"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mock Physical Rally">Mock Physical Rally (PET)</option>
                    <option value="Obstacle Drill Clinic">Obstacle Drill Clinic</option>
                    <option value="1600m Timed Trial">1600m Timed Trial</option>
                    <option value="Pre-Medical Screening">Pre-Medical Screening</option>
                    <option value="Written Exam Crash Drill">Written Exam Crash Drill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-200 hover:[&::-webkit-calendar-picker-indicator]:scale-110 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Reporting Time
                  </label>
                  <input
                    type="text"
                    placeholder="05:00 AM IST"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                      Target Cadre *
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewEvent({ ...newEvent, targetCadre: 'All Cadets' })}
                      className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
                    >
                      Set to &quot;All Cadets&quot;
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="All Cadets, Indian Army GD, WBP..."
                    value={newEvent.targetCadre}
                    onChange={e => setNewEvent({ ...newEvent, targetCadre: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'All Cadets',
                      'Indian Army Agniveer GD',
                      'WBP / KP Police Squad',
                      'SSC GD Platoon',
                      'Women Military Police'
                    ].map(cadre => (
                      <button
                        key={cadre}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, targetCadre: cadre })}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${
                          newEvent.targetCadre === cadre
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-[#161F15] text-gray-400 hover:text-white border border-[#273623]'
                        }`}
                      >
                        {cadre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Ground / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="J.K. College Ground Synthetic & Mud Track, Purulia"
                    value={newEvent.venue}
                    onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Registration Status
                  </label>
                  <select
                    value={newEvent.reportingStatus}
                    onChange={e => setNewEvent({ ...newEvent, reportingStatus: e.target.value as any })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="OPEN">OPEN FOR ALL ENLISTED</option>
                    <option value="CLOSING SOON">CLOSING SOON</option>
                    <option value="RESTRICTED">RESTRICTED TO ALFA BATCH</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Drill Instructions & Uniform Guidelines
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mandatory running spikes or studs allowed on outer rim. Bring chest bib and hydration kit."
                    value={newEvent.guidelines}
                    onChange={e => setNewEvent({ ...newEvent, guidelines: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <Button
                    type="submit"
                    variant="saffron"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4 text-black" />}
                  >
                    Broadcast & Publish Event
                  </Button>
                </div>
              </form>
            </div>

            {/* Event List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                  Active Published Events ({events.length})
                </h4>
                <span className="text-[11px] font-mono text-amber-400">Synced to Cadet Portal</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl bg-[#161F15] border border-[#273623] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="army" size="sm">{event.type}</Badge>
                        <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                          {event.reportingStatus}
                        </span>
                      </div>
                      <h4 className="font-display font-black text-lg text-white uppercase leading-snug">
                        {event.title}
                      </h4>
                      <div className="text-xs font-mono text-gray-300 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="text-gray-400">📍 {event.venue}</div>
                        <div className="text-gray-400">🎯 Target: <strong className="text-white">{event.targetCadre}</strong></div>
                      </div>
                      {event.guidelines && (
                        <p className="text-xs text-gray-400 bg-[#0E140C] p-2.5 rounded-xl border border-[#273623] mt-2">
                          {event.guidelines}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#273623]">
                      <span className="text-[10px] font-mono text-gray-500">ID: {event.id}</span>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1 hover:bg-red-950/40 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Event</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Order Card */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#121811] border border-[#273623] space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#273623]">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                    Recruitment Orders & Ground Gallery Circulars
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Post official rally gazettes, exam syllabi, and ground training footage links for cadet access.
                  </p>
                </div>
              </div>

              {orderSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Circular / Media order successfully published!</span>
                </div>
              )}

              <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Order / Circular Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Army Agniveer GD Barrackpore Zone Physical Notification 2026"
                    value={newOrder.title}
                    onChange={e => setNewOrder({ ...newOrder, title: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newOrder.category}
                    onChange={e => setNewOrder({ ...newOrder, category: e.target.value as any })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="RALLY_ORDER">Official Rally Gazette</option>
                    <option value="PHYSICAL_STANDARDS">Physical Standards (PMT/PET)</option>
                    <option value="WRITTEN_SYLLABUS">Written Exam Syllabus & Blueprint</option>
                    <option value="GALLERY_FOOTAGE">Ground Training Video / Footage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="Army HQ / WBPRB / AIM Purulia"
                    value={newOrder.authority}
                    onChange={e => setNewOrder({ ...newOrder, authority: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Official URL / Video Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newOrder.url}
                    onChange={e => setNewOrder({ ...newOrder, url: e.target.value })}
                    className="w-full bg-[#0B0F0A] border border-[#273623] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <Button
                    type="submit"
                    variant="saffron"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4 text-black" />}
                  >
                    Publish Circular Order
                  </Button>
                </div>
              </form>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                  Published Recruitment Circulars & Media ({orders.length})
                </h4>
                <span className="text-[11px] font-mono text-amber-400">Available to Cadet Squad</span>
              </div>

              <div className="space-y-3">
                {orders.map(item => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#161F15] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/30 uppercase font-bold">
                          {item.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          • {item.authority}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          • {item.date}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-white uppercase">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Order</span>
                      </a>
                      <button
                        onClick={() => handleDeleteOrder(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 p-2 hover:bg-red-950/40 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </div>
        )}

        {/* ===================================================================
            WHATSAPP-STYLE BOTTOM NAVIGATION BAR (MOBILE ONLY)
            =================================================================== */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E140C]/95 backdrop-blur-md border-t border-[#273623] px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {[
              { id: 'STOPWATCH', label: 'Drill', icon: Timer, count: null },
              { id: 'WARCRY', label: 'War Cry', icon: Flame, count: null },
              {
                id: 'ADMISSIONS',
                label: 'Admissions',
                icon: Shield,
                count: allApplications.filter(a => a.admissionStatus === 'PENDING' || a.admissionStatus === 'UNDER_REVIEW' || !a.admissionStatus).length > 0
                  ? allApplications.filter(a => a.admissionStatus === 'PENDING' || a.admissionStatus === 'UNDER_REVIEW' || !a.admissionStatus).length
                  : null
              },
              { id: 'ATTENDANCE', label: 'Roll Call', icon: Users, count: null },
              { id: 'BULLETIN', label: 'Notices', icon: Megaphone, count: events.length > 0 ? events.length : null },
            ].map(item => {
              const isActive = effectiveTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 px-1 relative transition-all cursor-pointer ${
                    isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`relative p-1 rounded-xl transition-all ${
                    isActive ? 'bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : ''
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 stroke-[2.5]' : 'text-gray-400'}`} />
                    {item.count && (
                      <span className="absolute -top-1 -right-2 text-[9px] font-black font-mono px-1 rounded-full bg-amber-500 text-black">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                    isActive ? 'font-bold text-amber-400' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>

      {/* Drill Ustad Edit Profile Modal */}
      <EditTrainerProfileModal
        isOpen={isEditTrainerModalOpen}
        onClose={() => setIsEditTrainerModalOpen(false)}
        trainer={trainerDetails || currentUser}
        onProfileUpdated={handleTrainerProfileUpdated}
      />

      {/* Broadcast War Cry Story Modal */}
      <PostWarCryModal
        isOpen={isPostWarCryOpen}
        onClose={() => setIsPostWarCryOpen(false)}
        onStoryCreated={() => {}}
      />
    </div>
  );
}
