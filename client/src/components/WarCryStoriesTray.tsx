'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Plus,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import {
  WarCryStory,
  fetchWarCryStories,
  getCurrentUser
} from '@/lib/api';
import { WarCryStoryModal } from './WarCryStoryModal';
import { PostWarCryModal } from './PostWarCryModal';

interface WarCryStoriesTrayProps {
  title?: string;
  subtitle?: string;
  showPostButton?: boolean;
  className?: string;
  onUploadClick?: () => void;
}

export const WarCryStoriesTray: React.FC<WarCryStoriesTrayProps> = ({
  title = 'WAR CRY • 24H GROUND STORIES',
  subtitle = 'Daily struggle, 1600m PR milestones, and battlefield war cries from J.K. College ground',
  showPostButton = true,
  className = '',
  onUploadClick
}) => {
  const [stories, setStories] = useState<WarCryStory[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = getCurrentUser();

  const handlePostClick = () => {
    if (onUploadClick) {
      onUploadClick();
      return;
    }
    if (!currentUser) {
      window.location.href = '/login?msg=' + encodeURIComponent('Please login to post your War Cry story.');
      return;
    }
    setIsPostModalOpen(true);
  };

  const loadStories = async () => {
    try {
      const data = await fetchWarCryStories();
      if (Array.isArray(data)) {
        setStories(data);
      }
    } catch (e) {
      // silent fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
    const interval = setInterval(loadStories, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#172012] via-[#121811] to-[#0A0F08] border-2 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.2)] space-y-4 ${className}`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Flame className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider truncate">
                {title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500 text-black font-black uppercase tracking-wider hidden xs:inline-block">
                LIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-400 truncate max-w-sm">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action Button: Post War Cry */}
        {showPostButton && (
          <button
            onClick={handlePostClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-display font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex-shrink-0"
            title="Post your daily War Cry story"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Post War Cry</span>
            <span className="sm:hidden">Post</span>
          </button>
        )}
      </div>

      {/* Horizontal Story Rings Carousel (Mobile First, No Scrollbar) */}
      <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1 touch-pan-x">
        
        {/* "+ Your Story" Bubble if logged in or allowed */}
        {showPostButton && (
          <div
            onClick={handlePostClick}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-dashed border-amber-500/60 hover:border-amber-400 transition-all flex items-center justify-center bg-[#0B0F09]">
              <div className="w-full h-full rounded-full bg-[#161F15] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 text-amber-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs border border-black shadow">
                +
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase truncate max-w-[70px] text-center">
              Your Story
            </span>
          </div>
        )}

        {/* Stories List */}
        {stories.length === 0 ? (
          <div className="text-xs font-mono text-gray-500 py-3 px-2 flex items-center gap-2">
            <span>No 24h stories active right now.</span>
            <button
              onClick={handlePostClick}
              className="text-amber-400 underline font-bold"
            >
              Be the first to post!
            </button>
          </div>
        ) : (
          stories.map((s, index) => {
            const isUstad = s.authorRole === 'USTAD';
            return (
              <div
                key={s.id}
                onClick={() => handleOpenStory(index)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
              >
                {/* Glowing Military Avatar Ring */}
                <div
                  className={`w-15 h-15 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all group-hover:scale-105 shadow-md relative ${
                    isUstad
                      ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 ring-2 ring-amber-500/40 animate-pulse'
                      : 'bg-gradient-to-tr from-emerald-500 via-green-400 to-amber-400'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-[#0E140C] overflow-hidden flex items-center justify-center border-2 border-[#090D08]">
                    {s.authorPhoto || s.mediaUrl ? (
                      <img
                        src={s.authorPhoto || s.mediaUrl}
                        alt={s.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-display font-black text-sm text-amber-400">
                        {s.authorName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Corner Badge */}
                  {isUstad ? (
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[8px] font-mono font-black uppercase border border-black shadow">
                      USTAD
                    </span>
                  ) : s.isPermanentHonour ? (
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[8px] font-mono font-black uppercase border border-black shadow">
                      HONOUR
                    </span>
                  ) : null}
                </div>

                <div className="text-center w-16">
                  <span className="text-[10px] font-mono text-gray-200 group-hover:text-amber-400 transition-colors uppercase font-bold truncate block">
                    {s.authorName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 truncate block">
                    {s.likesCount || 0} ❤️
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <WarCryStoryModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedStoryIndex(null);
          }}
          onStoriesUpdated={loadStories}
        />
      )}

      {/* Post War Cry Story Modal */}
      <PostWarCryModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onStoryCreated={loadStories}
      />
    </div>
  );
};
