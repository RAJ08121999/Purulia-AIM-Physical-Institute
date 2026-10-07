'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * 21st.dev style Shimmer Badge
 * High-velocity animated gradient border badge for announcements & key milestones
 */
export const ShimmerBadge: React.FC<ShimmerBadgeProps> = ({
  children,
  icon,
  className,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-display uppercase tracking-widest text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg',
        className
      )}
    >
      {/* 21st.dev rotating conic gradient shimmer border */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#26351F_0%,#F59E0B_50%,#4B6135_100%)]" />

      {/* Inner Badge Core */}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-AIM-dark px-4 py-1.5 text-amber-300 backdrop-blur-3xl gap-2 z-10 border border-AIM-army/30 hover:bg-AIM-dark-elevated transition-colors">
        {icon && <span className="text-amber-400">{icon}</span>}
        <span>{children}</span>
      </span>
    </div>
  );
};
