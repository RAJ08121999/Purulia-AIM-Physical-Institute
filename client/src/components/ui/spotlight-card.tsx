'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
  borderColor?: string;
}

/**
 * 21st.dev style Spotlight Card
 * Dynamic mouse-tracking radial glow for high-impact interactive cards
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  spotlightColor = 'rgba(245, 158, 11, 0.15)', // Saffron glow
  borderColor = 'rgba(245, 158, 11, 0.4)',
  children,
  className,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-xl border border-AIM-army/30 bg-AIM-dark-elevated p-6 overflow-hidden transition-all duration-300 hover:border-amber-500/50 group',
        className
      )}
      {...props}
    >
      {/* Dynamic mouse spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`
        }}
      />
      {/* Dynamic spotlight border highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          border: `1px solid ${borderColor}`,
          maskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
