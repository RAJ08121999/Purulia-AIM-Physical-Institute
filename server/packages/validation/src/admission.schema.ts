import { z } from 'zod';
import { ForceType } from '@AIM/types';

export const AdmissionApplicationSchema = z
  .object({
    // Step 1: Basic Information
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Valid date of birth required'
    }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number'),
    email: z.string().email('Valid email address required'),
    address: z.string().min(5, 'Address is required'),
    district: z.string().min(2, 'District is required (e.g. Purulia, Bankura)'),
    village: z.string().min(2, 'Village/Town is required'),

    // Step 2: Emergency Contact & Guardian
    emergencyContactName: z.string().min(2, 'Emergency contact name required'),
    emergencyContactPhone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Valid 10-digit emergency contact phone required'),
    emergencyContactRelation: z.string().min(2, 'Relationship is required'),
    isMinor: z.boolean().default(false),
    guardianName: z.string().optional(),
    guardianPhone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Valid 10-digit guardian phone required')
      .optional()
      .or(z.literal('')),

    // Step 3: Physical Telemetry & Training Targets
    heightCm: z.number().min(140, 'Height must be at least 140 cm').max(220),
    weightKg: z.number().min(35, 'Weight must be at least 35 kg').max(150),
    chestCm: z.number().min(60, 'Chest must be at least 60 cm').max(140),
    targetForces: z
      .array(z.nativeEnum(ForceType))
      .min(1, 'Please select at least one target defence/police service'),
    preferredBatch: z.string().min(1, 'Please select a preferred training batch'),
    previousTrainingExperience: z.string().optional(),
    currentRunningTime1600m: z.string().optional(),

    // Step 4: Strict Explicit Consent Enforcements (FR-APP-02)
    trainingConsent: z.literal(true, {
      errorMap: () => ({
        message: 'You must consent to physical training regulations and data processing'
      })
    }),
    mediaConsent: z.boolean().default(false),
    guardianConsent: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    // If applicant is under 18 years old based on DOB or isMinor flag:
    const birthDate = new Date(data.dateOfBirth);
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18 || data.isMinor) {
      if (!data.guardianName || data.guardianName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianName'],
          message: 'Parent or Guardian name is mandatory for minors under 18'
        });
      }
      if (!data.guardianPhone || !/^[6-9]\d{9}$/.test(data.guardianPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianPhone'],
          message: 'Valid Parent/Guardian phone is mandatory for minors'
        });
      }
      if (data.guardianConsent !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianConsent'],
          message: 'Parent/Guardian signed consent is mandatory for applicants under 18'
        });
      }
    }
  });

export type AdmissionApplicationInput = z.infer<typeof AdmissionApplicationSchema>;
