import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePercentageChange(baseline: number, current: number, lowerIsBetter: boolean = false): {
  percent: number;
  formatted: string;
  isImprovement: boolean;
} {
  if (!baseline || baseline === 0) {
    return { percent: 0, formatted: '0%', isImprovement: false };
  }

  const rawChange = ((current - baseline) / baseline) * 100;
  const isImprovement = lowerIsBetter ? rawChange < 0 : rawChange > 0;
  const absValue = Math.abs(rawChange).toFixed(1);
  const sign = rawChange > 0 ? '+' : '-';

  return {
    percent: rawChange,
    formatted: `${sign}${absValue}%`,
    isImprovement
  };
}
