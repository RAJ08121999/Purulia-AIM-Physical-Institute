'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  User,
  MapPin,
  Calendar,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Flame
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import {
  WarCryStory,
  fetchPendingHonourStories,
  verifyHonourStory,
  fetchApprovedHonourStories
} from '@/lib/api';

export const UstadStoryVerificationDesk: React.FC = () => {
  const [pendingStories, setPendingStories] = useState<WarCryStory[]>([]);
  const [approvedStories, setApprovedStories] = useState<WarCryStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState<Record<string, string>>({});

  const loadHonourQueue = async () => {
    setIsLoading(true);
    try {
      const [pending, approved] = await Promise.all([
        fetchPendingHonourStories(),
        fetchApprovedHonourStories()
      ]);
      setPendingStories(pending);
      setApprovedStories(approved);
    } catch (e) {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHonourQueue();
  }, []);

  const handleVerify = async (storyId: string, approved: boolean) => {
    setActionId(storyId);
    setStatusMsg(null);
    try {
      const remarks = rejectRemarks[storyId] || '';
      const res = await verifyHonourStory(storyId, approved, remarks);
      setStatusMsg(res.message);
      await loadHonourQueue();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Verification action failed.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#121811] border border-[#273623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
              Roll of Honour • Ustad Verification Desk
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Review cadet physical trial selections, verify recruitment letters, and formally induct heroes onto the permanent Wall of Fame.
          </p>
        </div>

        <button
          onClick={loadHonourQueue}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E140C] hover:bg-[#1A2415] border border-amber-500/40 text-amber-400 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Review Queue</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Pending Submissions Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
            <span>Pending Induction Reviews ({pendingStories.length})</span>
          </h4>
          <span className="text-[11px] font-mono text-amber-400">
            Awaiting Chief Ustad Approval
          </span>
        </div>

        {pendingStories.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#161F15] border border-[#273623] text-center text-xs font-mono text-gray-500">
            ✓ All cadet success nominations have been verified and processed. No pending dossiers.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingStories.map(story => (
              <div
                key={story.id}
                className="p-5 rounded-2xl bg-[#161F15] border-2 border-amber-500/50 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-black uppercase">
                      🎖️ {story.selectedForce || 'DEFENCE / POLICE'}
                    </span>
                    <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-700 animate-pulse">
                      PENDING REVIEW
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {story.mediaUrl ? (
                      <img
                        src={story.mediaUrl}
                        alt={story.authorName}
                        className="w-16 h-20 rounded-xl object-cover border border-amber-500/40 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 rounded-xl bg-[#0E140C] border border-[#273623] text-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {story.authorName.charAt(0)}
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <h4 className="font-display font-black text-base text-white uppercase truncate">
                        {story.authorName}
                      </h4>
                      <p className="text-xs font-mono text-gray-300">
                        Belt / Unit: <strong className="text-amber-400">{story.beltNo || 'N/A'}</strong>
                      </p>
                      <p className="text-xs font-mono text-gray-300">
                        1600m PB: <strong className="text-emerald-400">{story.timing1600m || 'Pass'}</strong>
                      </p>
                      <p className="text-[11px] font-mono text-gray-400">
                        📍 {story.villageTown || 'Purulia District'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-sans italic bg-[#0E140C] p-3 rounded-xl border border-[#273623]">
                    &ldquo;{story.caption}&rdquo;
                  </p>

                  <input
                    type="text"
                    placeholder="Optional remarks (e.g. Verified Panagarh Rally pass)"
                    value={rejectRemarks[story.id] || ''}
                    onChange={e => setRejectRemarks({ ...rejectRemarks, [story.id]: e.target.value })}
                    className="w-full bg-[#0E140C] border border-[#273623] rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#273623]">
                  <Button
                    variant="saffron"
                    size="sm"
                    className="flex-1 justify-center text-xs font-bold font-display uppercase tracking-wider"
                    disabled={actionId === story.id}
                    onClick={() => handleVerify(story.id, true)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  >
                    {actionId === story.id ? 'Inducting...' : 'Verify & Induct to Roll of Honour'}
                  </Button>

                  <button
                    onClick={() => handleVerify(story.id, false)}
                    disabled={actionId === story.id}
                    className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 text-xs font-mono uppercase transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permanently Inducted Wall of Fame Showcase */}
      <div className="space-y-3 pt-6 border-t border-[#273623]">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
            <span>Verified Roll of Honour Inductees ({approvedStories.length})</span>
          </h4>
          <span className="text-[11px] font-mono text-emerald-400">
            ✓ Live on Public Wall of Fame
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {approvedStories.map(story => (
            <div
              key={story.id}
              className="p-4 rounded-2xl bg-[#121811] border border-emerald-500/40 space-y-2 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-white uppercase truncate text-sm">
                  {story.authorName}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/30">
                  {story.selectedForce?.split(' ')[0] || 'DEFENCE'}
                </span>
              </div>
              <p className="text-gray-300 text-[11px] truncate">
                {story.selectedForce} • {story.selectionYear || '2024'}
              </p>
              <p className="text-gray-400 text-[10px] line-clamp-2">
                &ldquo;{story.caption}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
