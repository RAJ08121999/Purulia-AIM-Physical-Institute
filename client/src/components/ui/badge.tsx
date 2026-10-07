
import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'olive' | 'army' | 'saffron' | 'yellow' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'olive',
  size = 'md',
  pulse = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white/5 text-gray-400 border-white/10',
    olive: 'bg-papi-olive/80 text-emerald-300 border-papi-army',
    army: 'bg-papi-army/30 text-lime-300 border-papi-army/60',
    saffron: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    yellow: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50',
    outline: 'bg-transparent text-gray-300 border-papi-dark-border',
    danger: 'bg-red-500/20 text-red-300 border-red-500/50',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap flex-shrink-0 gap-1.5 font-display font-bold uppercase rounded border backdrop-blur-sm select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
      {children}
    </span>
  );
};
