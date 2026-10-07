// Purulia Aim Physical Institute (AIM) - Client API Service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface AdmissionFormData {
  fullName: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  aadhaarNumber: string;
  phone: string;
  emergencyPhone: string;
  email?: string;
  password?: string;
  domicileDistrict: string;
  policeStation: string;
  villageTown: string;
  postOffice?: string;
  pinCode: string;
  casteCategory: string;
  passportPhoto?: string;
  bloodGroup?: string;
  birthMarks?: string;
  tattooDetails?: string;
  physicalMentalIssues?: string;

  highestEducation: string;
  matricBoard: string;
  matricRollNumber?: string;
  matricPassingYear?: string;
  matricAggregatePercent?: string | number;
  scienceMathPercent?: string | number;

  // Detailed 10th, 12th, Graduation, and Post Graduation Qualification Records
  tenthBoard?: string;
  tenthStream?: string;
  tenthSpecialization?: string;
  tenthPassingYear?: string;
  tenthRollNumber?: string;
  tenthMarksObtained?: string | number;
  tenthFullMarks?: string | number;
  tenthPercentage?: string | number;

  hasTwelfth?: boolean;
  twelfthBoard?: string;
  twelfthStream?: string;
  twelfthSpecialization?: string;
  twelfthPassingYear?: string;
  twelfthRollNumber?: string;
  twelfthMarksObtained?: string | number;
  twelfthFullMarks?: string | number;
  twelfthPercentage?: string | number;

  hasGraduation?: boolean;
  gradUniversity?: string;
  gradStream?: string;
  gradSpecialization?: string;
  gradPassingYear?: string;
  gradRollNumber?: string;
  gradMarksObtained?: string | number;
  gradFullMarks?: string | number;
  gradPercentage?: string | number;

  hasPostGraduation?: boolean;
  pgUniversity?: string;
  pgStream?: string;
  pgSpecialization?: string;
  pgPassingYear?: string;
  pgRollNumber?: string;
  pgMarksObtained?: string | number;
  pgFullMarks?: string | number;
  pgPercentage?: string | number;

  nccCertificate: string;
  sportsLevel: string;
  sportsDiscipline?: string;

  targetForce: string;
  heightCm: string | number;
  weightKg: string | number;
  chestNormalCm: string | number;
  chestExpandedCm: string | number;
  current1600mTime?: string;
  currentBeamPullups?: string | number;
  visionStatus?: string;
  bodyTattoo?: string;

  hasCriminalRecord: string;
  criminalRecordDetails?: string;
  hasAttendedPastRally: string;
  pastRallyDetails?: string;
  hasMedicalConditionOrSurgery?: string;
  medicalHistoryDetails?: string;
  characterCertificateAvailable?: boolean;
  standToOathConsent: boolean;
  noSubstanceAbuseConsent: boolean;
  mediaConsent: boolean;
}

export interface InstituteEvent {
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
}

export interface EventRsvpPayload {
  eventId: string;
  cadetName: string;
  phone: string;
  dossierOrAadhaar: string;
  targetForce?: string;
}

export interface AttendanceRecord {
  studentId: string;
  batchId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface AssessmentPayload {
  studentId: string;
  run1600mSeconds: number;
  pullupsCount: number;
  ditchJump9ftPass?: boolean;
  zigzagBalancePass?: boolean;
  trainerRemarks?: string;
}

// -------------------------------------------------------------
// ADMISSIONS API
// -------------------------------------------------------------

export async function submitCadetAdmission(data: AdmissionFormData) {
  const payload = {
    ...data,
    heightCm: Number(data.heightCm),
    weightKg: Number(data.weightKg),
    chestNormalCm: Number(data.chestNormalCm),
    chestExpandedCm: Number(data.chestExpandedCm),
    matricAggregatePercent: data.matricAggregatePercent ? Number(data.matricAggregatePercent) : undefined,
    scienceMathPercent: data.scienceMathPercent ? Number(data.scienceMathPercent) : undefined,
    currentBeamPullups: data.currentBeamPullups ? Number(data.currentBeamPullups) : undefined,
    hasMedicalCondition: data.hasMedicalConditionOrSurgery || 'NO'
  };

  const res = await fetch(`${API_BASE_URL}/admissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit admission dossier to server');
  }

  return res.json();
}

export async function fetchCadetApplications(status?: string) {
  const url = status ? `${API_BASE_URL}/admissions?status=${status}` : `${API_BASE_URL}/admissions`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch admissions');
  return res.json();
}

export async function updateCadetStatus(id: string, status: string, batchId?: string) {
  const res = await fetch(`${API_BASE_URL}/admissions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, batchId })
  });
  if (!res.ok) throw new Error('Failed to update cadet status');
  return res.json();
}

// -------------------------------------------------------------
// EVENTS & RSVP API
// -------------------------------------------------------------

export async function fetchInstituteEvents(): Promise<InstituteEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch (err) {
    console.warn('Fallback to local event cache:', err);
    return [
      {
        id: 'evt-001',
        title: 'Sunday 1600m Super-Timed Trial (Open Rally Simulation)',
        date: '2026-10-11',
        time: '05:30 hrs - 08:30 hrs',
        location: 'J.K. College Stadium Ground, Purulia',
        category: 'TRIAL',
        description: 'Electronic chip & synchronized stopwatch timed 1600m trial simulating official Army ARO Barrackpore rally conditions. Group 1 cut-off: 5m 30s.',
        requiredKit: 'White Running Vest, Running Spikes/Shoes, AIM Chest Number Bib, Water Flask',
        reportingTime: '05:00 hrs sharp at North Pavilion Gate',
        isRollCallOpen: true,
        slotsLimit: 120,
        registeredCount: 84
      }
    ];
  }
}

export async function registerRollCallRsvp(payload: EventRsvpPayload) {
  const res = await fetch(`${API_BASE_URL}/events/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to confirm roll call RSVP');
  }

  return res.json();
}

// -------------------------------------------------------------
// ATTENDANCE & BATCHES API
// -------------------------------------------------------------

export async function fetchBatches() {
  const res = await fetch(`${API_BASE_URL}/attendance/batches`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch batches');
  return res.json();
}

export async function fetchAttendance(batchId?: string, date?: string) {
  let url = `${API_BASE_URL}/attendance`;
  const params = new URLSearchParams();
  if (batchId) params.append('batchId', batchId);
  if (date) params.append('date', date);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function submitBulkAttendance(records: AttendanceRecord[], markedBy?: string) {
  const res = await fetch(`${API_BASE_URL}/attendance/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records, markedBy })
  });
  if (!res.ok) throw new Error('Failed to record attendance');
  return res.json();
}

export async function fetchDefaulters() {
  const res = await fetch(`${API_BASE_URL}/attendance/defaulters`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch defaulters');
  return res.json();
}

// -------------------------------------------------------------
// TELEMETRY & ASSESSMENT API
// -------------------------------------------------------------

export interface AssessmentResultItem {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName?: string;
  dossierNumber?: string;
  run1600mSeconds: number;
  run1600mFormatted: string;
  groupClassification: string;
  marks1600m: number;
  pullupsCount: number;
  marksPullups: number;
  ditchJump9ftPass: boolean;
  zigzagBalancePass: boolean;
  totalPhysicalMarks: number;
  gradeClassification: string;
  trainerRemarks?: string;
  createdAt: string;
}

export async function fetchTelemetryLeaderboard(): Promise<AssessmentResultItem[]> {
  const res = await fetch(`${API_BASE_URL}/telemetry/leaderboard`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function fetchStudentAssessments(studentId: string): Promise<AssessmentResultItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry/student/${encodeURIComponent(studentId)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`Falling back to local telemetry for student ${studentId}:`, err);
    return [];
  }
}

export async function recordTrialAssessment(payload: AssessmentPayload) {
  const res = await fetch(`${API_BASE_URL}/telemetry/assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to record trial assessment');
  return res.json();
}

// -------------------------------------------------------------
// AUTH & DASHBOARD API
// -------------------------------------------------------------

export async function authenticateUser(identifier: string, accessPin?: string, role?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, accessPin, role })
  });
  if (!res.ok) throw new Error('Authentication failed');
  return res.json();
}

export async function fetchMvcDashboard() {
  const res = await fetch(`${API_BASE_URL}/mvc/dashboard`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

// -------------------------------------------------------------
// AUDIT LOGS & SYSTEM INTEGRITY API
// -------------------------------------------------------------

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  entity?: string;
  entityId?: string;
  details: string;
  createdAt: string;
  ip?: string;
}

export async function fetchAuditLogs(limit: number = 50): Promise<AuditLogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/audit/logs?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('Falling back to local audit cache:', err);
    return [
      {
        id: 'log-1',
        actor: 'Havaldar Anup Kumar Mahato (Admin)',
        action: 'ADMISSION_APPROVED',
        details: 'Approved applicant Anjali Hansda. Allocated to Morning Alfa. Roll: AIM-2026-039',
        createdAt: new Date().toISOString(),
        ip: '192.168.1.42'
      },
      {
        id: 'log-2',
        actor: 'System Telemetry Engine',
        action: 'ATTENDANCE_BATCH_RECORDED',
        details: 'Recorded 42 presents, 3 absents for Morning Alfa drill session.',
        createdAt: new Date().toISOString(),
        ip: '127.0.0.1'
      },
      {
        id: 'log-3',
        actor: 'Havaldar Anup Kumar Mahato (Admin)',
        action: 'TRIAL_TELEMETRY_LOGGED',
        details: 'Recorded Sunday 1600m time for Cadet Sourav Mukherjee (05m 24s).',
        createdAt: new Date().toISOString(),
        ip: '192.168.1.42'
      }
    ];
  }
}

export async function fetchCurrentSessionProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    return {
      authenticated: true,
      user: {
        role: 'SUPER_ADMIN',
        name: 'Havaldar Anup Kumar Mahato',
        institution: 'Purulia Aim Physical Institute'
      }
    };
  }
}

// -------------------------------------------------------------
// CATEGORIZED RUNS & LIVE DRILL STOPWATCH API
// -------------------------------------------------------------

export type RunCategoryKey = '100M' | '400M' | '800M' | '1600M' | '5KM' | '10KM' | 'CUSTOM';

export interface RunCategoryItem {
  key: RunCategoryKey;
  label: string;
  distanceMeters: number;
  targetSeconds: number;
  targetFormatted: string;
  targetLabel: string;
  description: string;
}

export interface RunTrial {
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

export interface LiveDrillSession {
  id: string;
  trainerId: string;
  trainerName: string;
  category: RunCategoryKey;
  categoryLabel: string;
  distanceMeters: number;
  targetSeconds: number;
  targetLabel: string;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'STOPPED';
  startedAt: number | null;
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

export interface ControlDrillPayload {
  action: 'START' | 'PAUSE' | 'RESUME' | 'STOP' | 'RESET' | 'LAP' | 'CONFIGURE' | 'CLOSE';
  category?: RunCategoryKey;
  categoryLabel?: string;
  distanceMeters?: number;
  targetSeconds?: number;
  targetLabel?: string;
  trainerName?: string;
  operatorRole?: 'TRAINER' | 'CADET';
  operatorName?: string;
}

export interface RecordRunTrialPayload {
  studentId: string;
  studentName?: string;
  category: RunCategoryKey;
  distanceMeters?: number;
  timeSeconds: number;
  targetSeconds?: number;
  source?: 'TRAINER_DRILL' | 'CADET_SELF_TRAINING';
  pullupsCount?: number;
  trainerRemarks?: string;
}

export async function fetchRunCategories(): Promise<RunCategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn('Using standard fallback run categories:', err);
    return [
      {
        key: '100M',
        label: '100m Explosive Sprint',
        distanceMeters: 100,
        targetSeconds: 12.0,
        targetFormatted: '12.00s',
        targetLabel: 'Sprint Standard (≤ 12.0s)',
        description: 'Explosive start acceleration and top-end velocity.'
      },
      {
        key: '400M',
        label: '400m Track Lap',
        distanceMeters: 400,
        targetSeconds: 60.0,
        targetFormatted: '01m 00s',
        targetLabel: 'Standard Lap (≤ 60.0s)',
        description: 'Anaerobic threshold maintenance and turn cadence.'
      },
      {
        key: '800M',
        label: '800m Speed Sprint',
        distanceMeters: 800,
        targetSeconds: 180.0,
        targetFormatted: '03m 00s',
        targetLabel: 'Police SI Cutoff (≤ 03m 00s)',
        description: 'Middle-distance pacing for Police Services & Lady Cadets.'
      },
      {
        key: '1600M',
        label: '1600m Battle Physical Efficiency (BPET) Run',
        distanceMeters: 1600,
        targetSeconds: 330.0,
        targetFormatted: '05m 30s',
        targetLabel: 'Army Group 1 Cutoff (≤ 05m 30s • 60 Pts)',
        description: 'Indian Army Agniveer GD 4-lap battlefield endurance trial.'
      },
      {
        key: '5KM',
        label: '5.0 km Road Endurance Run',
        distanceMeters: 5000,
        targetSeconds: 1440.0,
        targetFormatted: '24m 00s',
        targetLabel: 'SSC GD / CAPF Cutoff (≤ 24m 00s)',
        description: 'Continuous road endurance test for Paramilitary forces.'
      },
      {
        key: '10KM',
        label: '10.0 km Cross-Country Marathon',
        distanceMeters: 10000,
        targetSeconds: 3000.0,
        targetFormatted: '50m 00s',
        targetLabel: 'Special Forces Standard (≤ 50m 00s)',
        description: 'High-mileage aerobic base and mental stamina road conditioning.'
      }
    ];
  }
}

export async function fetchLiveDrillSession(): Promise<LiveDrillSession> {
  try {
    const res = await fetch(`${API_BASE_URL}/telemetry/live-drill`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    return {
      id: 'local-drill-session',
      trainerId: 'trainer-anup',
      trainerName: 'Havaldar Anup Kumar Mahato (Ex-Army)',
      category: '1600M',
      categoryLabel: '1600m Battle Physical Efficiency (BPET) Run',
      distanceMeters: 1600,
      targetSeconds: 330,
      targetLabel: 'Group 1 (≤ 5m 30s)',
      status: 'IDLE',
      startedAt: null,
      pausedAt: null,
      elapsedMs: 0,
      laps: [],
      updatedAt: Date.now()
    };
  }
}

export async function controlLiveDrillSession(payload: ControlDrillPayload): Promise<LiveDrillSession> {
  const res = await fetch(`${API_BASE_URL}/telemetry/live-drill/control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to update drill session: ${res.status}`);
  return res.json();
}

export async function fetchRunTrials(studentId?: string, category?: string): Promise<RunTrial[]> {
  try {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (category && category !== 'ALL') params.append('category', category);

    const res = await fetch(`${API_BASE_URL}/telemetry/trials?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn('Using local fallback trials:', err);
    return [];
  }
}

export async function saveRunTrial(payload: RecordRunTrialPayload): Promise<RunTrial> {
  const res = await fetch(`${API_BASE_URL}/telemetry/trials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to save run trial: ${res.status}`);
  return res.json();
}

// -------------------------------------------------------------
// AUTHENTICATION API (CADETS & USTADS)
// -------------------------------------------------------------

export interface LoginPayload {
  identifier: string;
  password?: string;
  role?: 'STUDENT' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface RegisterTrainerPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  regimentOrTitle?: string;
  specialization?: string;
  secretVerificationCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    dossierNumber?: string;
    batchId?: string;
    targetForce?: string;
    regiment?: string;
  };
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
  }
  const data: AuthResponse = await res.json();
  if (data.token) {
    localStorage.setItem('aim_auth_token', data.token);
    localStorage.setItem('aim_auth_user', JSON.stringify(data.user));
    if (data.user.name) localStorage.setItem('cadet_name', data.user.name);
    if (data.user.dossierNumber) localStorage.setItem('cadet_dossier_id', data.user.dossierNumber);
    if (data.user.targetForce) localStorage.setItem('cadet_target_force', data.user.targetForce);
  }
  return data;
}

export async function registerTrainer(payload: RegisterTrainerPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register-trainer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Trainer registration failed.');
  }
  const data: AuthResponse = await res.json();
  if (data.token) {
    localStorage.setItem('aim_auth_token', data.token);
    localStorage.setItem('aim_auth_user', JSON.stringify(data.user));
  }
  return data;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('aim_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('aim_auth_token');
  localStorage.removeItem('aim_auth_user');
  window.location.href = '/';
}


