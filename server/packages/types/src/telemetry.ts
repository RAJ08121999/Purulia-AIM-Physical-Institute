import { ForceType } from './roles';

export interface TelemetryMetrics {
  runDistanceM: number;
  runTimeSeconds: number; // e.g. 378s for 6m 18s
  pushups: number;
  situps: number;
  pullups: number;
  longJumpCm: number;
  highJumpCm: number;
  weightKg: number;
  heightCm: number;
}

export interface CalculatedTelemetry {
  bmi: number;
  runPaceFormatted: string; // "06:18"
  benchmarkComparisons: MetricComparison[];
  overallReadinessScore: number; // 0-100%
}

export interface MetricComparison {
  metricName: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  variancePercentage: number;
  qualified: boolean;
  gap: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface TargetBenchmark {
  id: string;
  forceName: ForceType;
  category: string; // e.g. "General Duty", "Sub-Inspector"
  target1600mSeconds: number;
  targetPushups: number;
  targetPullups: number;
  targetSitups: number;
  targetLongJumpCm: number;
  targetHighJumpCm: number;
  minHeightCm: number;
  minChestCm: number;
  chestExpansionCm: number;
}
