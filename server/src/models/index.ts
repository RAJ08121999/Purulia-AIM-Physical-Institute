export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TRAINER' | 'STUDENT' | 'APPLICANT';
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  totpSecret?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileEntity {
  id: string;
  userId?: string;
  dossierNumber: string; // e.g. AIM-CADET-2026-4821
  rollNumber?: string;
  
  // Step 1: Personal & Bio-Data
  fullName: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: string;
  aadhaarNumber: string;
  phone: string;
  emergencyPhone: string;
  domicileDistrict: string;
  policeStation: string;
  villageTown: string;
  postOffice?: string;
  pinCode?: string;
  casteCategory: string;
  passportPhoto?: string;
  bloodGroup?: string;
  birthMarks?: string;
  tattooDetails?: string;
  physicalMentalIssues?: string;

  // Step 2: Educational & NCC / Sports Qualifications
  highestEducation: string;
  matricBoard: string;
  matricRollNumber?: string;
  matricPassingYear?: string;
  matricAggregatePercent?: number;
  scienceMathPercent?: number;

  tenthBoard?: string;
  tenthStream?: string;
  tenthSpecialization?: string;
  tenthPassingYear?: string;
  tenthRollNumber?: string;
  tenthMarksObtained?: number;
  tenthFullMarks?: number;
  tenthPercentage?: number;

  hasTwelfth?: boolean;
  twelfthBoard?: string;
  twelfthStream?: string;
  twelfthSpecialization?: string;
  twelfthPassingYear?: string;
  twelfthRollNumber?: string;
  twelfthMarksObtained?: number;
  twelfthFullMarks?: number;
  twelfthPercentage?: number;

  hasGraduation?: boolean;
  gradUniversity?: string;
  gradStream?: string;
  gradSpecialization?: string;
  gradPassingYear?: string;
  gradRollNumber?: string;
  gradMarksObtained?: number;
  gradFullMarks?: number;
  gradPercentage?: number;

  hasPostGraduation?: boolean;
  pgUniversity?: string;
  pgStream?: string;
  pgSpecialization?: string;
  pgPassingYear?: string;
  pgRollNumber?: string;
  pgMarksObtained?: number;
  pgFullMarks?: number;
  pgPercentage?: number;

  nccCertificate: string;
  sportsLevel: string;
  sportsDiscipline?: string;

  // Step 3: Physical Standard Test (PST) & Baseline Metrics
  targetForce: string;
  heightCm: number;
  weightKg: number;
  chestNormalCm: number;
  chestExpandedCm: number;
  chestExpansionCm: number;
  current1600mTime?: string;
  currentBeamPullups?: number;
  visionStatus: string;
  bodyTattoo: string;

  // Step 4: Disciplinary, Past Records & Legal Consent
  hasCriminalRecord: string;
  criminalRecordDetails?: string;
  hasAttendedPastRally: string;
  pastRallyDetails?: string;
  hasMedicalCondition: string;
  medicalHistoryDetails?: string;
  characterCertificateAvailable: boolean;
  standToOathConsent: boolean;
  noSubstanceAbuseConsent: boolean;
  mediaConsent: boolean;

  // Status & Batch
  admissionStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  batchId?: string;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchEntity {
  id: string;
  name: string;
  code: string;
  trainingGround: string;
  morningTime: string;
  targetFocus: string;
  isActive: boolean;
  maxCapacity: number;
  createdAt: string;
}

export interface AttendanceEntity {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  dossierNumber: string;
  batchId: string;
  batchName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  markedBy: string;
  createdAt: string;
}

export interface AssessmentResultEntity {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  dossierNumber: string;
  run1600mSeconds: number;
  run1600mFormatted: string;
  groupClassification: string; // "Group 1 (≤ 5m 30s)" | "Group 2 (5m 31s - 5m 45s)" | "Failed"
  marks1600m: number; // 60, 48, 0
  pullupsCount: number;
  marksPullups: number; // 40, 33, 27, 21, 16, 0
  ditchJump9ftPass: boolean;
  zigzagBalancePass: boolean;
  totalPhysicalMarks: number; // max 100
  gradeClassification: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  trainerRemarks?: string;
  createdAt: string;
}

export interface InstituteEventEntity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'TRIAL' | 'SEMINAR' | 'RALLY_ALERT' | 'CAMP';
  description: string;
  requiredKit: string;
  reportingTime: string;
  isRollCallOpen: boolean;
  slotsLimit: number;
  registeredCount: number;
  createdAt: string;
}

export interface EventRsvpEntity {
  id: string;
  eventId: string;
  cadetName: string;
  phone: string;
  dossierOrAadhaar: string;
  targetForce: string;
  confirmed: boolean;
  createdAt: string;
}

export interface AuditLogEntity {
  id: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export type RunCategoryKey = '100M' | '400M' | '800M' | '1600M' | '5KM' | '10KM' | 'CUSTOM';

export interface RunTrialEntity {
  id: string;
  studentId: string;
  studentName: string;
  dossierNumber?: string;
  category: RunCategoryKey;
  categoryLabel: string;
  distanceMeters: number;
  timeSeconds: number;
  timeFormatted: string;
  targetSeconds: number;
  targetFormatted: string;
  varianceSeconds: number;
  isQualified: boolean;
  pullupsCount?: number;
  source: 'TRAINER_DRILL' | 'CADET_SELF_TRAINING';
  drillSessionId?: string;
  trainerRemarks?: string;
  date: string;
  createdAt: string;
}

export interface LiveDrillSessionEntity {
  id: string;
  trainerId: string;
  trainerName: string;
  category: RunCategoryKey;
  categoryLabel: string;
  distanceMeters: number;
  targetSeconds: number;
  targetLabel: string;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'STOPPED';
  startedAt: number | null; // epoch ms
  pausedAt: number | null;
  elapsedMs: number;
  laps: Array<{
    lapNumber: number;
    splitTimeMs: number;
    splitFormatted: string;
    label: string;
  }>;
  cadetFinishes?: Record<string, { seconds: number; formatted: string; isQualified: boolean }>;
  updatedAt: number;
}
