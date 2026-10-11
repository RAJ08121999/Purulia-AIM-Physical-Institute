'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Flame,
  Camera,
  Upload,
  CheckCircle2,
  Award,
  Shield,
  Zap,
  Clock,
  Sparkles,
  Trophy,
  Activity,
  Timer,
  Dumbbell,
  TrendingUp
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import {
  createWarCryStory,
  getCurrentUser,
  WarCryActivityStats
} from '@/lib/api';

interface PostWarCryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: () => void;
  defaultRole?: 'USTAD' | 'CADET';
}

export const PostWarCryModal: React.FC<PostWarCryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated,
  defaultRole
}) => {
  const currentUser = getCurrentUser();
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('WAR_CRY');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoSizeMsg, setPhotoSizeMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Drill Best / Physical Activity Metrics state
  const [shareDrillStats, setShareDrillStats] = useState(false);
  const [drillRunTiming, setDrillRunTiming] = useState('');
  const [drillBeamsCount, setDrillBeamsCount] = useState('');
  const [drillPushupsCount, setDrillPushupsCount] = useState('');
  const [drillDitchJump, setDrillDitchJump] = useState('CLEARED (Pass)');
  const [drillZigzagBalance, setDrillZigzagBalance] = useState('PASSED');
  const [drillOtherActivity, setDrillOtherActivity] = useState('');

  // Roll of Honour Nomination state
  const [isHonourNomination, setIsHonourNomination] = useState(false);
  const [selectedForce, setSelectedForce] = useState('Indian Army Agniveer GD');
  const [beltNo, setBeltNo] = useState('');
  const [regiment, setRegiment] = useState('');
  const [timing1600m, setTiming1600m] = useState('');
  const [villageTown, setVillageTown] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const role: 'USTAD' | 'CADET' = defaultRole || (currentUser?.role === 'TRAINER' ? 'USTAD' : 'CADET');
  const authorName = currentUser?.name || (role === 'USTAD' ? 'Havaldar Anup Kumar Mahato' : 'Enlisted Cadet');
  const authorId = currentUser?.id || currentUser?.dossierNumber || 'user-' + Date.now();
  const authorCadre = (currentUser as any)?.targetForce || (role === 'USTAD' ? 'Chief Drill Ustad' : 'AIM Platoon');

  const tagOptions = [
    { id: 'WAR_CRY', label: '🔥 Daily War Cry', tagLabel: '🔥 Ground War Cry' },
    { id: '1600M_PR', label: '⚡ 1600m PR / Speed Lap', tagLabel: '⚡ 1600m Track Milestone' },
    { id: 'DRILL_RECORD', label: '🏆 Drill PR & Best Stats', tagLabel: '🏆 Drill Record / PR' },
    { id: 'STRUGGLE_GRIT', label: '🪖 Struggle & Sweat', tagLabel: '🪖 Struggle & Ground Grit' },
    { id: 'DRILL_LOG', label: '💪 Daily Drill Win', tagLabel: '💪 Morning Muster Achievement' }
  ];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setPhotoSizeMsg('Image size exceeds 500 KB limit. Please choose a smaller photo.');
      setTimeout(() => setPhotoSizeMsg(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
      setPhotoSizeMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Auto-generate high-motivation drill War Cry caption from telemetry
  const generateDrillCaption = () => {
    const parts: string[] = [];
    if (drillRunTiming) parts.push(`🏃 1600m: ${drillRunTiming}`);
    if (drillBeamsCount) parts.push(`💪 Beams: ${drillBeamsCount}`);
    if (drillPushupsCount) parts.push(`⚡ Pushups: ${drillPushupsCount}`);
    if (drillDitchJump && drillDitchJump !== 'NOT ATTEMPTED') parts.push(`🕳️ 9ft Ditch: ${drillDitchJump}`);
    if (drillZigzagBalance && drillZigzagBalance !== 'NOT ATTEMPTED') parts.push(`⚖️ Balance: ${drillZigzagBalance}`);
    if (drillOtherActivity) parts.push(`🎯 ${drillOtherActivity}`);

    const summary = parts.length > 0 ? parts.join(' | ') : 'Ground PR unlocked today!';
    const generated = role === 'USTAD'
      ? `🔥 SQUAD DRILL RECORD: ${summary}. Drill standard strictly maintained! Discipline is destiny. Alpha Platoon stand-to tomorrow at 05:00 AM sharp! Jai Hind!`
      : `🔥 GROUND PR RECORDED: ${summary}. Smashed personal drill record at J.K. College Ground. Pain is temporary, Uniform is forever. Jai Hind!`;

    setCaption(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      alert('Please write your War Cry story or quote.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeTagSpec = tagOptions.find(t => t.id === selectedTag);

      const activityStatsPayload: WarCryActivityStats | undefined =
        shareDrillStats && (drillRunTiming || drillBeamsCount || drillPushupsCount || drillDitchJump || drillZigzagBalance || drillOtherActivity)
          ? {
              runTiming: drillRunTiming.trim() || undefined,
              beamsCount: drillBeamsCount.trim() || undefined,
              pushupsCount: drillPushupsCount.trim() || undefined,
              ditchJump: drillDitchJump.trim() || undefined,
              zigzagBalance: drillZigzagBalance.trim() || undefined,
              otherActivity: drillOtherActivity.trim() || undefined
            }
          : undefined;

      await createWarCryStory({
        authorId,
        authorName,
        authorRole: role,
        authorPhoto: (currentUser as any)?.passportPhoto || (currentUser as any)?.photo || '',
        authorCadre,
        tag: isHonourNomination ? 'SUCCESS_STORY' : selectedTag,
        tagLabel: isHonourNomination ? '🎖️ Roll of Honour Candidate' : activeTagSpec?.tagLabel,
        caption: caption.trim(),
        mediaUrl: photoBase64 || '',
        activityStats: activityStatsPayload,
        isPermanentHonour: isHonourNomination,
        selectedForce: isHonourNomination ? selectedForce : '',
        beltNo: isHonourNomination ? beltNo : '',
        regimentOrDistrict: isHonourNomination ? regiment : '',
        timing1600m: isHonourNomination ? timing1600m : (drillRunTiming || ''),
        villageTown: isHonourNomination ? villageTown : ''
      });

      setSuccessMsg(
        isHonourNomination
          ? 'Success story submitted for Ustad verification and Roll of Honour induction!'
          : 'War Cry Story broadcasted live! It will be visible to all cadets and visitors for 24 hours.'
      );

      setTimeout(() => {
        setSuccessMsg(null);
        onStoryCreated?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      alert(err?.message || 'Could not post War Cry story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0E140C] border-2 border-amber-500/70 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] my-auto animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#273623]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                Broadcast Ground War Cry
              </h3>
              <p className="text-[11px] font-mono text-gray-400">
                Visible for 24 hours across WhatsApp-style stories tray
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white border border-[#273623] hover:border-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Author Badge Snapshot */}
          <div className="p-3 rounded-2xl bg-[#080B07] border border-[#273623] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-display font-bold uppercase truncate">
                {authorName}
              </span>
            </div>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
              {role === 'USTAD' ? 'DRILL INSTRUCTOR' : 'ACTIVE RECRUIT'}
            </span>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
              Select Story Badge
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tagOptions.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSelectedTag(tag.id);
                    if (tag.id === 'DRILL_RECORD' || tag.id === '1600M_PR') {
                      setShareDrillStats(true);
                    }
                  }}
                  className={`p-2 rounded-xl text-[11px] font-mono text-left transition-all border cursor-pointer ${
                    selectedTag === tag.id
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                      : 'bg-[#121811] text-gray-400 border-[#273623] hover:text-white'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===================================================================
              DRILL BEST & PHYSICAL TELEMETRY PANEL (NEW FEATURE)
              =================================================================== */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#080B07] border border-amber-500/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareDrillStats}
                  onChange={e => {
                    setShareDrillStats(e.target.checked);
                    if (e.target.checked && selectedTag === 'WAR_CRY') {
                      setSelectedTag('DRILL_RECORD');
                    }
                  }}
                  className="mt-0.5 rounded border-[#273623] text-amber-500 focus:ring-0 accent-amber-500"
                />
                <div>
                  <span className="font-display font-bold text-white uppercase text-xs flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share Daily Drill & Personal Best Telemetry</span>
                  </span>
                  <span className="text-gray-400 font-mono text-[10px] block mt-0.5">
                    Attach 1600m timings, beams / pull-ups, pushups, 9-ft ditch & other activities
                  </span>
                </div>
              </label>

              {shareDrillStats && (
                <button
                  type="button"
                  onClick={generateDrillCaption}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold cursor-pointer transition-all flex-shrink-0"
                  title="Generate War Cry quote from these stats"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="hidden xs:inline">Auto-Write Caption</span>
                  <span className="xs:hidden">Auto</span>
                </button>
              )}
            </div>

            {shareDrillStats && (
              <div className="pt-3 border-t border-[#273623] space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* 1. 1600m Running Timing */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Timer className="w-3 h-3 text-amber-400" />
                        <span>1600m / Speed Run Timing</span>
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">e.g. 05m 18s</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 05m 24s (Group 1)"
                      value={drillRunTiming}
                      onChange={e => setDrillRunTiming(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['05m 15s', '05m 30s', '05m 45s', '06m 00s'].map(quickTime => (
                        <button
                          key={quickTime}
                          type="button"
                          onClick={() => setDrillRunTiming(quickTime)}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161F15] text-amber-400/90 border border-[#273623] hover:border-amber-500/50 cursor-pointer"
                        >
                          {quickTime}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Beams / Pull-ups Count */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Dumbbell className="w-3 h-3 text-amber-400" />
                        <span>Beams (Pull-ups) Count</span>
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">Max 10 / 40 Pts</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 10 Beams (Group 1 - 40 Pts)"
                      value={drillBeamsCount}
                      onChange={e => setDrillBeamsCount(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['10 (Full 40 Pts)', '9 Beams (33 Pts)', '8 Beams (27 Pts)', '6 Beams (Min Pass)'].map(quickBeam => (
                        <button
                          key={quickBeam}
                          type="button"
                          onClick={() => setDrillBeamsCount(quickBeam)}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161F15] text-amber-400/90 border border-[#273623] hover:border-amber-500/50 cursor-pointer"
                        >
                          {quickBeam}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Pushups Reps */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>Pushups Reps (1 Min)</span>
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">e.g. 45 reps</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 42 Reps (Strict Cadence)"
                      value={drillPushupsCount}
                      onChange={e => setDrillPushupsCount(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['30 Reps', '40 Reps', '50 Reps', '60 Reps'].map(quickPush => (
                        <button
                          key={quickPush}
                          type="button"
                          onClick={() => setDrillPushupsCount(quickPush)}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161F15] text-cyan-400/90 border border-[#273623] hover:border-cyan-500/50 cursor-pointer"
                        >
                          {quickPush}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. 9-Feet Ditch Jump */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-300 uppercase tracking-wider">
                      🕳️ 9-Feet Ditch Jump
                    </label>
                    <select
                      value={drillDitchJump}
                      onChange={e => setDrillDitchJump(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="CLEARED (Pass)">CLEARED (Pass - Clean Jump)</option>
                      <option value="CLEARED (High Flight)">CLEARED (High Flight)</option>
                      <option value="NOT ATTEMPTED">NOT ATTEMPTED</option>
                      <option value="FAILED (Toe Touched)">FAILED (Toe Touched Rim)</option>
                    </select>
                  </div>

                  {/* 5. Zig-Zag Balance */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-300 uppercase tracking-wider">
                      ⚖️ Zig-Zag Balance Beam
                    </label>
                    <select
                      value={drillZigzagBalance}
                      onChange={e => setDrillZigzagBalance(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="PASSED">PASSED (Zero Slip)</option>
                      <option value="PERFECT BALANCE">PERFECT BALANCE</option>
                      <option value="NOT ATTEMPTED">NOT ATTEMPTED</option>
                      <option value="SLIPPED">SLIPPED (Retry Needed)</option>
                    </select>
                  </div>

                  {/* 6. Other Activity Milestone */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3 text-purple-400" />
                        <span>Other Activity Milestone</span>
                      </label>
                      <span className="text-[9px] font-mono text-gray-500">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 100m Sprint: 11.8s, 5KM Ruck March: 22m"
                      value={drillOtherActivity}
                      onChange={e => setDrillOtherActivity(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['100m Sprint in 11.8s', '5KM Road Run: 21m 40s', '15ft Rope Climb', '50 Sit-ups in 2 min'].map(quickAct => (
                        <button
                          key={quickAct}
                          type="button"
                          onClick={() => setDrillOtherActivity(quickAct)}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161F15] text-purple-300/90 border border-[#273623] hover:border-purple-500/50 cursor-pointer"
                        >
                          {quickAct}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Story Text / War Cry Quote */}
          <div>
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
              Daily War Cry / Struggle Story Caption *
            </label>
            <textarea
              required
              rows={4}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="e.g. Clocked 05m 28s on 1600m today! Pain is temporary, Uniform is forever. Alpha Platoon stand-to tomorrow at 05:00 AM..."
              className="w-full bg-[#080B07] border border-[#273623] rounded-2xl p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          {/* Optional Ground Photo Upload (< 500 KB) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                Ground Photo / Milestone Proof (Optional)
              </label>
              <span className="text-[10px] font-mono text-gray-500">Max 500 KB</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#121811] hover:bg-[#1A2415] border border-[#273623] hover:border-amber-500/50 text-amber-400 text-xs font-mono transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{photoBase64 ? 'Change Photo' : 'Attach Photo'}</span>
              </button>

              {photoBase64 && (
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-amber-500/50">
                  <img
                    src={photoBase64}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoBase64(null)}
                    className="absolute top-0 right-0 p-0.5 bg-black/80 text-white rounded-bl"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoSizeMsg && (
              <p className="text-[10px] font-mono text-rose-400 mt-1">
                ⚠ {photoSizeMsg}
              </p>
            )}
          </div>

          {/* Roll of Honour Checkbox Nomination */}
          <div className="p-3.5 rounded-2xl bg-[#080B07] border border-[#273623] space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isHonourNomination}
                onChange={e => setIsHonourNomination(e.target.checked)}
                className="mt-0.5 rounded border-[#273623] text-amber-500 focus:ring-0 accent-amber-500"
              />
              <div className="text-xs">
                <span className="font-display font-bold text-white uppercase block">
                  Nominate as Official Roll of Honour Success Story
                </span>
                <span className="text-gray-400 font-mono text-[10px] leading-tight block mt-0.5">
                  Check this if you cleared an official physical rally / final selection. Ustad Anup will review and permanently induct your name into the Wall of Fame.
                </span>
              </div>
            </label>

            {isHonourNomination && (
              <div className="pt-2 border-t border-[#273623] space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Selected Force / Service *
                    </label>
                    <select
                      value={selectedForce}
                      onChange={e => setSelectedForce(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Indian Army Agniveer GD">Indian Army Agniveer GD</option>
                      <option value="Indian Army Technical / Clerk">Indian Army Technical / Clerk</option>
                      <option value="West Bengal Police (WBP)">West Bengal Police (WBP)</option>
                      <option value="Kolkata Police (KP)">Kolkata Police (KP)</option>
                      <option value="SSC GD (BSF / CISF / CRPF)">SSC GD (BSF / CISF / CRPF)</option>
                      <option value="Railway Protection Force (RPF)">Railway Protection Force (RPF)</option>
                      <option value="Women Military Police (CMP)">Women Military Police (CMP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Belt Number / Regimental Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 24-RAJRIF-892"
                      value={beltNo}
                      onChange={e => setBeltNo(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      1600m Trial Timing
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 05m 14s (Group 1)"
                      value={timing1600m}
                      onChange={e => setTiming1600m(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                      Village / Domicile
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manbazar, Purulia"
                      value={villageTown}
                      onChange={e => setVillageTown(e.target.value)}
                      className="w-full bg-[#121811] border border-[#273623] rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#121811] hover:bg-[#1A2415] border border-[#273623] text-gray-400 text-xs font-mono uppercase cursor-pointer"
            >
              Cancel
            </button>

            <Button
              variant="saffron"
              size="md"
              type="submit"
              disabled={isSubmitting}
              className="font-black font-display uppercase tracking-wider text-black"
            >
              {isSubmitting
                ? 'Broadcasting...'
                : isHonourNomination
                ? 'Submit for Ustad Review'
                : 'Publish 24h War Cry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
