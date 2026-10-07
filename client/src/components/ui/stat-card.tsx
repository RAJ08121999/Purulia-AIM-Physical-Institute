'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  baseline?: string | number;
  percentageChange?: string;
  isImprovement?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  label,
  value,
  unit,
  baseline,
  percentageChange,
  isImprovement = true,
  icon,
  subtitle,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-b from-AIM-dark-elevated to-AIM-dark-card border border-AIM-army/30 p-5 shadow-lg hover:border-amber-500/40 transition-all duration-300 group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-display">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-AIM-olive/40 border border-AIM-army/40 text-amber-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-gray-400">{unit}</span>}
      </div>

      {(percentageChange || baseline) && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-AIM-army/20 text-xs">
          {percentageChange && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full',
                isImprovement
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}
            >
              {isImprovement ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {percentageChange}
            </span>
          )}
          {baseline && (
            <span className="text-gray-400">
              from <span className="font-semibold text-gray-300">{baseline}</span> baseline
            </span>
          )}
        </div>
      )}

      {subtitle && <p className="mt-2 text-xs text-gray-400">{subtitle}</p>}

      {/* Decorative tactical accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
