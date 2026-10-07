import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Phone or email is required')
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
        /^[6-9]\d{9}$/.test(val.replace(/\s+/g, '')),
      {
        message: 'Must be a valid email or 10-digit Indian mobile number'
      }
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  totpCode: z
    .string()
    .length(6, 'TOTP code must be 6 digits')
    .optional()
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
