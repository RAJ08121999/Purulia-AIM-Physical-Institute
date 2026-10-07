import { z } from 'zod';
import { AttendanceStatus } from '@AIM/types';

export const SingleAttendanceMarkSchema = z.object({
  studentId: z.string().uuid(),
  status: z.nativeEnum(AttendanceStatus),
  notes: z.string().max(200).optional()
});

export const BulkAttendanceSchema = z.object({
  batchId: z.string().uuid(),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
  title: z.string().min(3).max(100).default('Morning Physical Session'),
  warmupMinutes: z.number().int().min(5).max(60).default(15),
  runningDetails: z.string().min(3).default('5km endurance run + 100m sprint intervals'),
  strengthWork: z.string().min(3).default('Push-ups, pull-ups, squats and core work'),
  cooldownMinutes: z.number().int().min(5).max(30).default(10),
  records: z.array(SingleAttendanceMarkSchema).min(1, 'Records cannot be empty')
});

export type BulkAttendanceInput = z.infer<typeof BulkAttendanceSchema>;
