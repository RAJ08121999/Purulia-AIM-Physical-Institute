import { z } from 'zod';

export const SingleStudentTelemetryInputSchema = z.object({
  studentId: z.string().uuid(),
  runDistanceM: z.number().int().positive().default(1600),
  runTimeSeconds: z.number().int().min(180, 'Minimum realistic 1600m time is 3 min').max(1200),
  pushups: z.number().int().min(0).max(150),
  situps: z.number().int().min(0).max(150),
  pullups: z.number().int().min(0).max(50),
  longJumpCm: z.number().min(0).max(800),
  highJumpCm: z.number().min(0).max(300).default(0),
  weightKg: z.number().min(30).max(160),
  heightCm: z.number().min(130).max(230),
  score: z.number().min(0).max(100).optional(),
  trainerRemark: z.string().max(500).optional()
});

export const BulkAssessmentRecordingSchema = z.object({
  batchId: z.string().uuid(),
  assessmentName: z.string().min(3).max(120),
  date: z.string().refine((val) => !isNaN(Date.parse(val))),
  results: z.array(SingleStudentTelemetryInputSchema).min(1, 'At least one student result required')
});

export type SingleStudentTelemetryInput = z.infer<typeof SingleStudentTelemetryInputSchema>;
export type BulkAssessmentRecordingInput = z.infer<typeof BulkAssessmentRecordingSchema>;
