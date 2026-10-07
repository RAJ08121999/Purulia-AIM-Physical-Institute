import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'tactical' | 'accent';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  hoverEffect = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-AIM-dark-elevated/90 border border-AIM-dark-border/80 backdrop-blur-md',
    elevated: 'bg-AIM-dark-card border border-AIM-army/40 shadow-xl shadow-black/50',
    tactical: 'bg-AIM-dark-elevated border border-AIM-army/60 tactical-corner shadow-lg shadow-black/40',
    accent: 'bg-gradient-to-b from-AIM-dark-card to-AIM-dark border border-amber-500/30'
  };

  return (
    <div
      className={cn(
        'rounded-lg p-6 text-gray-200 transition-all duration-300',
        variantStyles[variant],
        hoverEffect && 'hover:border-AIM-saffron/60 hover:shadow-saffron-glow/10 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
