'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface KineticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showArrow?: boolean;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * 21st.dev style Kinetic Military Action Button
 * Features a high-voltage glow sweep and micro-feedback
 */
export const KineticButton: React.FC<KineticButtonProps> = ({
  children,
  showArrow = true,
  glow = true,
  size = 'md',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-2.5',
    lg: 'text-sm px-8 py-3.5',
    xl: 'text-base px-10 py-4'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative group overflow-hidden rounded font-display font-extrabold uppercase tracking-widest transition-all duration-300 select-none cursor-pointer',
        sizeStyles[size],
        glow && 'shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.65)]',
        'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black border border-amber-300/60',
        className
      )}
      {...(props as any)}
    >
      {/* Light sheen sweep effect */}
      <span className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-700 ease-in-out pointer-events-none" />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <span>{children}</span>
        {showArrow && (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        )}
      </span>
    </motion.button>
  );
};
