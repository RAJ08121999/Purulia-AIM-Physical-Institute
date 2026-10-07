'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'army' | 'saffron' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'saffron',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider',
      md: 'px-5 py-2.5 text-sm font-bold uppercase tracking-wider',
      lg: 'px-7 py-3 text-base font-bold uppercase tracking-wider',
      xl: 'px-9 py-4 text-lg font-extrabold uppercase tracking-widest'
    };

    const variantClasses = {
      primary:
        'bg-AIM-olive hover:bg-AIM-olive-light text-white border border-AIM-army shadow-tactical-inset active:scale-[0.98]',
      army:
        'bg-gradient-to-r from-AIM-olive to-AIM-army hover:from-AIM-army hover:to-AIM-army-muted text-white border border-AIM-army-muted/40 shadow-tactical-inset active:scale-[0.98]',
      saffron:
        'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold shadow-saffron-glow border border-amber-300/40 active:scale-[0.98]',
      outline:
        'bg-transparent hover:bg-AIM-olive/40 text-amber-400 border border-AIM-army hover:border-amber-400/80 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-transparent active:scale-[0.98]',
      danger:
        'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 active:scale-[0.98]'
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        whileHover={{ translateY: disabled || isLoading ? 0 : -1 }}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded font-display transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
