import { ForceType } from './roles';

export interface StudentProfile {
  id: string;
  userId: string;
  enrollmentNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  district: string;
  village: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  guardianConsentGranted: boolean;
  mediaConsentGranted: boolean;
  heightCm: number;
  weightKg: number;
  chestCm: number;
  targetForces: ForceType[];
  batchId?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SELECTED';
  selectedForce?: ForceType;
  selectedYear?: number;
}

export interface MembershipApplicationPayload {
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  address: string;
  district: string;
  village: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  heightCm: number;
  weightKg: number;
  chestCm: number;
  targetForces: ForceType[];
  preferredBatch: string;
  previousTrainingExperience?: string;
  currentRunningTime1600m?: string;
  trainingConsent: boolean;
  mediaConsent: boolean;
  guardianConsent?: boolean;
}
