'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Shield,
  Send,
  Lock,
  Check,
  User,
  Sparkles,
  Award
} from 'lucide-react';
import {
  WarCryStory,
  toggleLikeWarCryStory,
  addWarCryComment,
  getCurrentUser
} from '@/lib/api';

interface WarCryStoryModalProps {
  stories: WarCryStory[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onStoriesUpdated?: () => void;
}

export const WarCryStoryModal: React.FC<WarCryStoryModalProps> = ({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onStoriesUpdated
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Local likes tracking
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>({});

  const currentUser = getCurrentUser();
  const story = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Synchronize initial likes state from stories
  useEffect(() => {
    const lMap: Record<string, number> = {};
    const hMap: Record<string, boolean> = {};
    const clientToken = getClientToken();

    stories.forEach(s => {
      lMap[s.id] = s.likesCount || 0;
      hMap[s.id] = Array.isArray(s.likedBy) && s.likedBy.includes(clientToken);
    });
    setLikesMap(lMap);
    setHasLikedMap(hMap);
  }, [stories]);

  // Client identifier for anonymous public likes
  const getClientToken = () => {
    if (typeof window === 'undefined') return 'anon';
    let token = localStorage.getItem('aim_client_visitor_token');
    if (!token) {
      token = 'visitor_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
      localStorage.setItem('aim_client_visitor_token', token);
    }
    return token;
  };

  // Story Progress Timer (5 Seconds Auto-Advance)
  useEffect(() => {
    if (!isOpen || isPaused || showComments || !story) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, isPaused, showComments, stories.length, story]);

  if (!isOpen || !story) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  // Toggle Like (Public visitors can like!)
  const handleLike = async () => {
    const storyId = story.id;
    const clientToken = getClientToken();
    const currentLiked = hasLikedMap[storyId];

    // Optimistic UI update
    setHasLikedMap(prev => ({ ...prev, [storyId]: !currentLiked }));
    setLikesMap(prev => ({
      ...prev,
      [storyId]: currentLiked ? Math.max(0, (prev[storyId] || 1) - 1) : (prev[storyId] || 0) + 1
    }));

    try {
      await toggleLikeWarCryStory(storyId, clientToken);
      onStoriesUpdated?.();
    } catch (e) {
      // Revert on error
      setHasLikedMap(prev => ({ ...prev, [storyId]: currentLiked }));
      setLikesMap(prev => ({
        ...prev,
        [storyId]: currentLiked ? (prev[storyId] || 0) + 1 : Math.max(0, (prev[storyId] || 1) - 1)
      }));
    }
  };

  // Handle Comment Submission (Registered Cadets / Ustads only)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    setIsSubmittingComment(true);
    try {
      await addWarCryComment(story.id, {
        authorName: currentUser.name || 'Enlisted Cadet',
        authorRole: (currentUser.role as any) === 'TRAINER' ? 'USTAD' : 'CADET',
        text: commentText.trim()
      });

      // Local update for instant feedback
      story.comments = [
        ...(story.comments || []),
        {
          id: 'comm-' + Date.now(),
          authorName: currentUser.name || 'Enlisted Cadet',
          authorRole: (currentUser.role as any) === 'TRAINER' ? 'USTAD' : 'CADET',
          text: commentText.trim(),
          createdAt: new Date().toISOString()
        }
      ];

      setCommentText('');
      onStoriesUpdated?.();
    } catch (err: any) {
      alert(err?.message || 'Could not post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Native Social Share / Copy Link
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/wall-of-fame?storyId=${story.id}`
      : 'https://purulia-aim-physical-institute-g5g1.vercel.app/wall-of-fame';

    const shareText = `🔥 Check out this War Cry ground story by ${story.authorName} (${story.authorCadre || 'AIM Institute'})!\n\n"${story.caption.slice(0, 100)}..."\n\nFree Physical Defence Training at Purulia J.K. College Ground:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `AIM War Cry • ${story.authorName}`,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (err) {
      // Fallback
    }
  };

  // Remaining Hours calculation
  const getRemainingHours = (expiresAt: string) => {
    if (!expiresAt) return '24h';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24 * 30) return 'Permanent';
    if (hours < 1) {
      const mins = Math.max(1, Math.floor(diff / (1000 * 60)));
      return `${mins}m left`;
    }
    return `${hours}h left`;
  };

  const isUstad = story.authorRole === 'USTAD';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Container: Max phone dimension width on desktop (max-w-md), full height on mobile */}
      <div className="relative w-full max-w-md h-full sm:h-[92vh] sm:rounded-3xl bg-[#090D08] border border-[#273623] overflow-hidden flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        
        {/* ===================================================================
            HEADER CONTROLS & SEGMENTED PROGRESS BARS
            =================================================================== */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 pt-4 sm:p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent space-y-3">
          
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((s, idx) => {
              let segProgress = 0;
              if (idx < currentIndex) segProgress = 100;
              else if (idx === currentIndex) segProgress = progress;
              return (
                <div
                  key={s.id}
                  className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
                >
                  <div
                    className="h-full bg-amber-400 transition-all duration-75"
                    style={{ width: `${segProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author Meta Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-full p-0.5 flex-shrink-0 ${
                  isUstad
                    ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300'
                    : 'bg-gradient-to-tr from-emerald-500 via-green-400 to-amber-400'
                }`}
              >
                <div className="w-full h-full rounded-full bg-[#121811] overflow-hidden flex items-center justify-center">
                  {story.authorPhoto ? (
                    <img
                      src={story.authorPhoto}
                      alt={story.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display font-black text-xs text-amber-400">
                      {story.authorName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate">
                    {story.authorName}
                  </h4>
                  {isUstad ? (
                    <span className="text-[9px] font-mono bg-amber-500 text-black px-1.5 py-0.2 rounded font-black uppercase flex-shrink-0">
                      USTAD
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase flex-shrink-0">
                      CADET
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
                  <span className="truncate max-w-[130px]">{story.authorCadre || 'AIM Institute'}</span>
                  <span className="text-gray-500">•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{getRemainingHours(story.expiresAt)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer flex-shrink-0"
              title="Close War Cry"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            STORY CONTENT / CANVAS
            =================================================================== */}
        <div className="relative flex-1 w-full flex items-center justify-center bg-black overflow-hidden">
          {/* Touch / Click Tap Zones for Story Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-0 inset-y-0 w-1/4 z-20 opacity-0 hover:opacity-10 transition-opacity bg-white/5 cursor-pointer flex items-center justify-start pl-2"
            title="Previous Story"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 inset-y-0 w-1/4 z-20 opacity-0 hover:opacity-10 transition-opacity bg-white/5 cursor-pointer flex items-center justify-end pr-2"
            title="Next Story"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Background Media or Camo Gradient */}
          {story.mediaUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={story.mediaUrl}
                alt="War Cry Story"
                className="w-full h-full object-cover sm:object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1E2613] via-[#141C0E] to-[#0A0E08] text-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <Flame className="w-16 h-16 text-amber-500/30 animate-pulse mb-6" />
            </div>
          )}

          {/* Story Caption & Badge Overlay */}
          <div className="absolute bottom-20 inset-x-0 z-20 p-5 sm:p-6 space-y-3 pointer-events-auto">
            {story.tagLabel && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/60 backdrop-blur-md text-amber-300 text-[11px] font-mono font-black uppercase tracking-wider shadow-md">
                <span>{story.tagLabel}</span>
              </div>
            )}

            <p className="font-display font-extrabold text-base sm:text-lg text-white leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-h-48 overflow-y-auto no-scrollbar">
              &ldquo;{story.caption}&rdquo;
            </p>

            {story.isPermanentHonour && story.selectedForce && (
              <div className="p-2.5 rounded-xl bg-black/70 border border-emerald-500/50 backdrop-blur-md text-xs font-mono text-emerald-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate font-bold">
                  Inducted in {story.selectedForce} ({story.selectionYear || 'Verified'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            BOTTOM ACTION TOOLBAR (LIKE, COMMENT, SHARE)
            =================================================================== */}
        <div className="relative z-30 p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-[#273623] flex items-center justify-between gap-3">
          
          {/* Left: Like / Salute Action (Available to Public!) */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all cursor-pointer border ${
              hasLikedMap[story.id]
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400'
                : 'bg-[#121811] hover:bg-[#1A2415] border-[#273623] text-gray-300'
            }`}
            title="Salute & Like War Cry"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                hasLikedMap[story.id] ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span className="font-mono text-xs font-bold">
              {likesMap[story.id] || 0}
            </span>
          </button>

          {/* Middle: Open Comments Tray */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-[#121811] hover:bg-[#1A2415] border border-[#273623] text-gray-300 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold">
              {story.comments?.length || 0} Comments
            </span>
          </button>

          {/* Right: Social Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            title="Share on WhatsApp / Social Media"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span className="text-[10px]">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-black" />
                <span className="hidden xs:inline">Share</span>
              </>
            )}
          </button>
        </div>

        {/* ===================================================================
            COMMENTS BOTTOM SHEET / DRAWER
            =================================================================== */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 z-40 max-h-[70%] bg-[#0D120B] border-t-2 border-amber-500/70 rounded-t-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#273623]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Regimental Salutes & Comments ({story.comments?.length || 0})
                </h4>
              </div>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 max-h-56 no-scrollbar">
              {(!story.comments || story.comments.length === 0) ? (
                <div className="py-6 text-center text-xs text-gray-500 font-mono">
                  No salutes posted yet. Be the first to cheer on this cadet!
                </div>
              ) : (
                story.comments.map(c => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-[#121811] border border-[#273623] text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 font-display uppercase">
                        {c.authorName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {c.authorRole}
                      </span>
                    </div>
                    <p className="text-gray-200 text-[11px] font-sans">
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-[#273623] flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Salute or cheer on cadet..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-1 bg-[#090D08] border border-[#273623] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="pt-3 border-t border-[#273623] p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-amber-400 font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Comments Reserved for Registered Cadets</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  <a href="/login" className="text-amber-400 font-bold underline">Login</a> or <a href="/apply" className="text-amber-400 font-bold underline">Enlist Free</a> to post comments. Anyone can still like & share above!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
