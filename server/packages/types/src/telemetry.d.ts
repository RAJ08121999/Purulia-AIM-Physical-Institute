import { ForceType } from './roles';
export interface TelemetryMetrics {
    runDistanceM: number;
    runTimeSeconds: number;
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
    runPaceFormatted: string;
    benchmarkComparisons: MetricComparison[];
    overallReadinessScore: number;
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
    category: string;
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
//# sourceMappingURL=telemetry.d.ts.map