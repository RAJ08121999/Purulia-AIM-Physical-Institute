import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserEntity,
  StudentProfileEntity,
  BatchEntity,
  AttendanceEntity,
  AssessmentResultEntity,
  InstituteEventEntity,
  EventRsvpEntity,
  AuditLogEntity,
  RunTrialEntity,
  LiveDrillSessionEntity
} from '../models';

interface DatabaseSchema {
  users: UserEntity[];
  students: StudentProfileEntity[];
  batches: BatchEntity[];
  attendance: AttendanceEntity[];
  assessments: AssessmentResultEntity[];
  runTrials: RunTrialEntity[];
  activeDrill: LiveDrillSessionEntity;
  events: InstituteEventEntity[];
  rsvps: EventRsvpEntity[];
  auditLogs: AuditLogEntity[];
}

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger('DbService');
  private readonly dataDir = path.resolve(process.cwd(), 'data');
  private readonly filePath = path.join(this.dataDir, 'aim_store.json');

  private data: DatabaseSchema = {
    users: [],
    students: [],
    batches: [],
    attendance: [],
    assessments: [],
    runTrials: [],
    activeDrill: {
      id: 'drill-session-regimental-01',
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
      cadetFinishes: {},
      updatedAt: Date.now()
    },
    events: [],
    rsvps: [],
    auditLogs: []
  };

  onModuleInit() {
    this.ensureStorage();
    this.loadData();
    if (this.data.batches.length === 0 || !this.data.runTrials || this.data.runTrials.length === 0) {
      this.seedInitialData();
    }
  }

  private ensureStorage() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed
        };
        if (!this.data.runTrials) this.data.runTrials = [];
        if (!this.data.activeDrill) {
          this.data.activeDrill = {
            id: 'drill-session-regimental-01',
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
            cadetFinishes: {},
            updatedAt: Date.now()
          };
        }
        this.logger.log(`Database loaded: ${this.data.students.length} cadets, ${this.data.events.length} events, ${this.data.runTrials.length} run trials.`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not parse data file, initializing fresh store: ${err.message}`);
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error(`Error persisting database: ${err.message}`);
    }
  }

  // --------------------------------------------------------------------------
  // REPOSITORY ACCESSORS
  // --------------------------------------------------------------------------

  // Students / Cadets
  getStudents() {
    return this.data.students;
  }

  findStudentById(id: string) {
    return this.data.students.find(s => s.id === id || s.dossierNumber === id);
  }

  createStudent(student: StudentProfileEntity) {
    this.data.students.unshift(student);
    this.saveData();
    return student;
  }

  updateStudent(id: string, updates: Partial<StudentProfileEntity>) {
    const idx = this.data.students.findIndex(s => s.id === id || s.dossierNumber === id);
    if (idx !== -1) {
      this.data.students[idx] = {
        ...this.data.students[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      } as StudentProfileEntity;
      this.saveData();
      return this.data.students[idx];
    }
    return null;
  }

  // Batches
  getBatches() {
    return this.data.batches;
  }

  findBatchById(id: string) {
    return this.data.batches.find(b => b.id === id || b.code === id);
  }

  // Attendance
  getAttendance(batchId?: string, date?: string) {
    return this.data.attendance.filter(a => {
      let match = true;
      if (batchId && a.batchId !== batchId) match = false;
      if (date && !a.date.startsWith(date)) match = false;
      return match;
    });
  }

  recordAttendanceBatch(records: AttendanceEntity[]) {
    // Replace existing records for same student & date if already present
    records.forEach(newRec => {
      const idx = this.data.attendance.findIndex(
        a => a.studentId === newRec.studentId && a.date.slice(0, 10) === newRec.date.slice(0, 10)
      );
      if (idx !== -1) {
        this.data.attendance[idx] = newRec;
      } else {
        this.data.attendance.unshift(newRec);
      }
    });
    this.saveData();
    return records;
  }

  // Telemetry & Assessments
  getAssessments() {
    return this.data.assessments;
  }

  recordAssessmentResult(result: AssessmentResultEntity) {
    this.data.assessments.unshift(result);
    this.saveData();
    return result;
  }

  // Active Drill Session
  getActiveDrill(): LiveDrillSessionEntity {
    return this.data.activeDrill;
  }

  updateActiveDrill(updates: Partial<LiveDrillSessionEntity>): LiveDrillSessionEntity {
    this.data.activeDrill = {
      ...this.data.activeDrill,
      ...updates,
      updatedAt: Date.now()
    };
    this.saveData();
    return this.data.activeDrill;
  }

  // Run Trials (Categorized Runs: 100m, 400m, 800m, 1600m, 5km, 10km)
  getRunTrials(studentId?: string, category?: string): RunTrialEntity[] {
    return (this.data.runTrials || []).filter(trial => {
      let match = true;
      if (studentId && trial.studentId !== studentId) match = false;
      if (category && category !== 'ALL' && trial.category !== category) match = false;
      return match;
    });
  }

  recordRunTrial(trial: RunTrialEntity): RunTrialEntity {
    if (!this.data.runTrials) this.data.runTrials = [];
    this.data.runTrials.unshift(trial);
    this.saveData();
    return trial;
  }

  // Events & RSVPs
  getEvents() {
    return this.data.events;
  }

  findEventById(id: string) {
    return this.data.events.find(e => e.id === id);
  }

  createRsvp(rsvp: EventRsvpEntity) {
    this.data.rsvps.unshift(rsvp);
    // increment event counter
    const evt = this.data.events.find(e => e.id === rsvp.eventId);
    if (evt) {
      evt.registeredCount = (evt.registeredCount || 0) + 1;
    }
    this.saveData();
    return rsvp;
  }

  getRsvps(eventId?: string) {
    if (eventId) {
      return this.data.rsvps.filter(r => r.eventId === eventId);
    }
    return this.data.rsvps;
  }

  // Audit Logs
  createAuditLog(log: AuditLogEntity) {
    this.data.auditLogs.unshift(log);
    this.saveData();
    return log;
  }

  getAuditLogs(limit = 50) {
    return this.data.auditLogs.slice(0, limit);
  }

  // --------------------------------------------------------------------------
  // INITIAL SEEDING
  // --------------------------------------------------------------------------
  private seedInitialData() {
    this.logger.log('Seeding initial authentic AIM military training data...');

    // Batches
    this.data.batches = [
      {
        id: 'batch-alpha',
        name: 'Alpha Platoon (05:00 - 07:00 hrs)',
        code: 'ALPHA-05:00am',
        trainingGround: 'J.K. College Ground, Purulia',
        morningTime: '05:00 - 07:00',
        targetFocus: 'Indian Army Agniveer GD & Technical',
        isActive: true,
        maxCapacity: 60,
        createdAt: new Date().toISOString()
      },
      {
        id: 'batch-bravo',
        name: 'Bravo Platoon (06:15 - 08:00 hrs)',
        code: 'BRAVO-0615',
        trainingGround: 'J.K. College Ground, Purulia',
        morningTime: '06:15 - 08:00',
        targetFocus: 'WBP / Kolkata Police Constable & SI Squad',
        isActive: true,
        maxCapacity: 50,
        createdAt: new Date().toISOString()
      },
      {
        id: 'batch-charlie',
        name: 'Charlie Lady Platoon (05:30 - 07:15 hrs)',
        code: 'CHARLIE-LADY',
        trainingGround: 'J.K. College Ground, Purulia',
        morningTime: '05:30 - 07:15',
        targetFocus: 'Women Military Police (CMP) & Lady Constable',
        isActive: true,
        maxCapacity: 45,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed Cadets
    this.data.students = [
      {
        id: 'cadet-001',
        dossierNumber: 'AIM-CADET-2026-1042',
        rollNumber: 'AIM-ALPHA-01',
        fullName: 'Rahul Soren',
        fatherName: 'Mangal Soren',
        dob: '2004-03-12',
        gender: 'Male',
        maritalStatus: 'Unmarried',
        aadhaarNumber: 'XXXX-XXXX-8492',
        phone: '9832109845',
        emergencyPhone: '9832109846',
        domicileDistrict: 'Purulia',
        policeStation: 'Purulia Town',
        villageTown: 'Dulmi-Nadiha',
        pinCode: '723102',
        casteCategory: 'ST',
        highestEducation: '12th Higher Secondary',
        matricBoard: 'WBBSE',
        matricAggregatePercent: 78.5,
        nccCertificate: 'NCC_B',
        sportsLevel: 'District',
        sportsDiscipline: '1500m Athletics',
        targetForce: 'Indian Army Agniveer GD',
        heightCm: 172.0,
        weightKg: 64.5,
        chestNormalCm: 81.0,
        chestExpandedCm: 87.0,
        chestExpansionCm: 6.0,
        current1600mTime: '5m 12s',
        currentBeamPullups: 10,
        visionStatus: 'Normal 6/6 (No Spectacles)',
        bodyTattoo: 'No Permanent Tattoos',
        hasCriminalRecord: 'NO',
        hasAttendedPastRally: 'YES',
        pastRallyDetails: 'Ran 1600m at Siliguri Army Rally (Cleared Group 1)',
        hasMedicalCondition: 'NO',
        characterCertificateAvailable: true,
        standToOathConsent: true,
        noSubstanceAbuseConsent: true,
        mediaConsent: true,
        admissionStatus: 'APPROVED',
        batchId: 'batch-alpha',
        joinedDate: '2025-11-01T05:00:00Z',
        createdAt: '2025-11-01T05:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cadet-002',
        dossierNumber: 'AIM-CADET-2026-1088',
        rollNumber: 'AIM-ALPHA-02',
        fullName: 'Subhasish Ghosh',
        fatherName: 'Gouranga Ghosh',
        dob: '2005-07-22',
        gender: 'Male',
        maritalStatus: 'Unmarried',
        aadhaarNumber: 'XXXX-XXXX-3194',
        phone: '9733451290',
        emergencyPhone: '9733451291',
        domicileDistrict: 'Purulia',
        policeStation: 'Arsha PS',
        villageTown: 'Arsha Basti',
        pinCode: '723153',
        casteCategory: 'OBC',
        highestEducation: '10th Matriculation',
        matricBoard: 'WBBSE',
        matricAggregatePercent: 71.0,
        nccCertificate: 'None',
        sportsLevel: 'None',
        targetForce: 'West Bengal Police Constable',
        heightCm: 169.5,
        weightKg: 61.0,
        chestNormalCm: 79.5,
        chestExpandedCm: 85.5,
        chestExpansionCm: 6.0,
        current1600mTime: '5m 32s',
        currentBeamPullups: 9,
        visionStatus: 'Normal 6/6 (No Spectacles)',
        bodyTattoo: 'No Permanent Tattoos',
        hasCriminalRecord: 'NO',
        hasAttendedPastRally: 'NO',
        hasMedicalCondition: 'NO',
        characterCertificateAvailable: true,
        standToOathConsent: true,
        noSubstanceAbuseConsent: true,
        mediaConsent: true,
        admissionStatus: 'APPROVED',
        batchId: 'batch-bravo',
        joinedDate: '2025-11-15T06:15:00Z',
        createdAt: '2025-11-15T06:15:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cadet-003',
        dossierNumber: 'AIM-CADET-2026-1120',
        rollNumber: 'AIM-CHARLIE-01',
        fullName: 'Priya Murmu',
        fatherName: 'Hopna Murmu',
        dob: '2004-09-14',
        gender: 'Female',
        maritalStatus: 'Unmarried',
        aadhaarNumber: 'XXXX-XXXX-5521',
        phone: '9475112233',
        emergencyPhone: '9475112234',
        domicileDistrict: 'Purulia',
        policeStation: 'Balarampur PS',
        villageTown: 'Ghatbera',
        pinCode: '723143',
        casteCategory: 'ST',
        highestEducation: '12th Higher Secondary',
        matricBoard: 'WBBSE',
        matricAggregatePercent: 82.0,
        nccCertificate: 'NCC_A',
        sportsLevel: 'District',
        sportsDiscipline: 'Cross Country 5K',
        targetForce: 'Women Military Police (CMP)',
        heightCm: 162.0,
        weightKg: 52.0,
        chestNormalCm: 75.0,
        chestExpandedCm: 80.5,
        chestExpansionCm: 5.5,
        current1600mTime: '7m 10s (Female 1600m Group 1)',
        currentBeamPullups: 6,
        visionStatus: 'Normal 6/6 (No Spectacles)',
        bodyTattoo: 'No Permanent Tattoos',
        hasCriminalRecord: 'NO',
        hasAttendedPastRally: 'NO',
        hasMedicalCondition: 'NO',
        characterCertificateAvailable: true,
        standToOathConsent: true,
        noSubstanceAbuseConsent: true,
        mediaConsent: true,
        admissionStatus: 'APPROVED',
        batchId: 'batch-charlie',
        joinedDate: '2025-12-01T05:30:00Z',
        createdAt: '2025-12-01T05:30:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cadet-004',
        dossierNumber: 'AIM-CADET-2026-1194',
        rollNumber: 'AIM-ALPHA-04',
        fullName: 'Bikram Hembram',
        fatherName: 'Sunil Hembram',
        dob: '2005-01-18',
        gender: 'Male',
        maritalStatus: 'Unmarried',
        aadhaarNumber: 'XXXX-XXXX-7714',
        phone: '9933887766',
        emergencyPhone: '9933887767',
        domicileDistrict: 'Purulia',
        policeStation: 'Bandwan PS',
        villageTown: 'Kuylapal',
        pinCode: '723129',
        casteCategory: 'ST',
        highestEducation: '10th Matriculation',
        matricBoard: 'WBBSE',
        matricAggregatePercent: 65.0,
        nccCertificate: 'None',
        sportsLevel: 'None',
        targetForce: 'Indian Army Agniveer GD',
        heightCm: 170.0,
        weightKg: 62.0,
        chestNormalCm: 80.0,
        chestExpandedCm: 86.0,
        chestExpansionCm: 6.0,
        current1600mTime: '5m 24s',
        currentBeamPullups: 10,
        visionStatus: 'Normal 6/6 (No Spectacles)',
        bodyTattoo: 'No Permanent Tattoos',
        hasCriminalRecord: 'NO',
        hasAttendedPastRally: 'NO',
        hasMedicalCondition: 'NO',
        characterCertificateAvailable: true,
        standToOathConsent: true,
        noSubstanceAbuseConsent: true,
        mediaConsent: true,
        admissionStatus: 'APPROVED',
        batchId: 'batch-alpha',
        joinedDate: '2025-12-10T05:00:00Z',
        createdAt: '2025-12-10T05:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];

    // Seed Events
    this.data.events = [
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
        registeredCount: 84,
        createdAt: new Date().toISOString()
      },
      {
        id: 'evt-002',
        title: 'WBP & KP Police Physical Standard Test (PST) Mock Camp',
        date: '2026-10-18',
        time: '06:00 hrs - 09:30 hrs',
        location: 'AIM Ground Facility, Purulia',
        category: 'CAMP',
        description: 'Rigorous Height-Weight-Chest verification, 5cm expansion drills, long jump, and 800m speed tactical conditioning for West Bengal Police aspirants.',
        requiredKit: 'Standard PT Uniform, Identification Aadhaar copy, Hydration electrolytes',
        reportingTime: '05:45 hrs at Admin Post',
        isRollCallOpen: true,
        slotsLimit: 100,
        registeredCount: 62,
        createdAt: new Date().toISOString()
      },
      {
        id: 'evt-003',
        title: 'Special Tactical Endurance & 9-ft Ditch Jump Clinic',
        date: '2026-10-25',
        time: '05:00 hrs - 07:30 hrs',
        location: 'J.K. College Obstacle Course, Purulia',
        category: 'TRIAL',
        description: 'Special masterclass conducted by Havaldar Anup Kumar Mahato covering the 9-foot ditch leap technique, zig-zag balancing beam, and dead-hang pull-up grip strengthening.',
        requiredKit: 'Tactical Army green shorts/track pants, grip gloves (optional), sports footwear',
        reportingTime: '04:45 hrs at Obstacle Zone',
        isRollCallOpen: true,
        slotsLimit: 80,
        registeredCount: 45,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed Telemetry & Assessments
    this.data.assessments = [
      {
        id: 'telemetry-001',
        assessmentId: 'trial-oct-01',
        studentId: 'cadet-001',
        studentName: 'Rahul Soren',
        dossierNumber: 'AIM-CADET-2026-1042',
        run1600mSeconds: 312,
        run1600mFormatted: '5m 12s',
        groupClassification: 'Group 1 (≤ 5m 30s)',
        marks1600m: 60,
        pullupsCount: 10,
        marksPullups: 40,
        ditchJump9ftPass: true,
        zigzagBalancePass: true,
        totalPhysicalMarks: 100,
        gradeClassification: 'EXCELLENT',
        trainerRemarks: 'Outstanding cadence. Perfect 100/100 physical score. Ready for upcoming ARO rally.',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'telemetry-002',
        assessmentId: 'trial-oct-01',
        studentId: 'cadet-004',
        studentName: 'Bikram Hembram',
        dossierNumber: 'AIM-CADET-2026-1194',
        run1600mSeconds: 324,
        run1600mFormatted: '5m 24s',
        groupClassification: 'Group 1 (≤ 5m 30s)',
        marks1600m: 60,
        pullupsCount: 10,
        marksPullups: 40,
        ditchJump9ftPass: true,
        zigzagBalancePass: true,
        totalPhysicalMarks: 100,
        gradeClassification: 'EXCELLENT',
        trainerRemarks: 'Superb 4th lap kick. Maintained 10 dead-hang pull-ups without swinging.',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'telemetry-003',
        assessmentId: 'trial-oct-01',
        studentId: 'cadet-002',
        studentName: 'Subhasish Ghosh',
        dossierNumber: 'AIM-CADET-2026-1088',
        run1600mSeconds: 332,
        run1600mFormatted: '5m 32s',
        groupClassification: 'Group 2 (5m 31s - 5m 45s)',
        marks1600m: 48,
        pullupsCount: 9,
        marksPullups: 33,
        ditchJump9ftPass: true,
        zigzagBalancePass: true,
        totalPhysicalMarks: 81,
        gradeClassification: 'GOOD',
        trainerRemarks: 'Needs 3 seconds shaved off lap 3 to break into Group 1 60-mark threshold.',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      }
    ];

    // Seed Today's Attendance Roll Call
    const today = new Date().toISOString().slice(0, 10);
    this.data.attendance = [
      {
        id: 'att-001',
        date: `${today}T05:05:00Z`,
        studentId: 'cadet-001',
        studentName: 'Rahul Soren',
        dossierNumber: 'AIM-CADET-2026-1042',
        batchId: 'batch-alpha',
        batchName: 'Alpha Platoon (05:00 - 07:00 hrs)',
        status: 'PRESENT',
        remarks: 'Reported 04:52 hrs. Led platoon warm-up lap.',
        markedBy: 'Havaldar Anup Kumar Mahato',
        createdAt: `${today}T05:05:00Z`
      },
      {
        id: 'att-002',
        date: `${today}T05:05:00Z`,
        studentId: 'cadet-004',
        studentName: 'Bikram Hembram',
        dossierNumber: 'AIM-CADET-2026-1194',
        batchId: 'batch-alpha',
        batchName: 'Alpha Platoon (05:00 - 07:00 hrs)',
        status: 'PRESENT',
        remarks: 'Reported on time. 100% attendance this week.',
        markedBy: 'Havaldar Anup Kumar Mahato',
        createdAt: `${today}T05:05:00Z`
      },
      {
        id: 'att-003',
        date: `${today}T06:18:00Z`,
        studentId: 'cadet-002',
        studentName: 'Subhasish Ghosh',
        dossierNumber: 'AIM-CADET-2026-1088',
        batchId: 'batch-bravo',
        batchName: 'Bravo Platoon (06:15 - 08:00 hrs)',
        status: 'PRESENT',
        remarks: 'Reported on time.',
        markedBy: 'Havaldar Anup Kumar Mahato',
        createdAt: `${today}T06:18:00Z`
      },
      {
        id: 'att-004',
        date: `${today}T05:32:00Z`,
        studentId: 'cadet-003',
        studentName: 'Priya Murmu',
        dossierNumber: 'AIM-CADET-2026-1120',
        batchId: 'batch-charlie',
        batchName: 'Charlie Lady Platoon (05:30 - 07:15 hrs)',
        status: 'PRESENT',
        remarks: 'Reported on time. Leading female endurance drills.',
        markedBy: 'Havaldar Anup Kumar Mahato',
        createdAt: `${today}T05:32:00Z`
      }
    ];

    // Seed Categorized Run Trials (100m, 400m, 800m, 1600m, 5km, 10km)
    this.data.runTrials = [
      // Cadet Sourav Mukherjee (AIM-2026-042)
      {
        id: 'trial-100m-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '100M',
        categoryLabel: '100m Explosive Sprint',
        distanceMeters: 100,
        timeSeconds: 11.45,
        timeFormatted: '11.45s',
        targetSeconds: 12.0,
        targetFormatted: '12.00s',
        varianceSeconds: -0.55,
        isQualified: true,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Explosive drive off the line. Flawless knee lift.',
        date: '04-Oct-2026',
        createdAt: '2026-10-04T05:30:00Z'
      },
      {
        id: 'trial-100m-02',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '100M',
        categoryLabel: '100m Explosive Sprint',
        distanceMeters: 100,
        timeSeconds: 12.30,
        timeFormatted: '12.30s',
        targetSeconds: 12.0,
        targetFormatted: '12.00s',
        varianceSeconds: 0.30,
        isQualified: false,
        source: 'CADET_SELF_TRAINING',
        trainerRemarks: 'Self-practice morning acceleration block drill.',
        date: '20-Sep-2026',
        createdAt: '2026-09-20T06:15:00Z'
      },
      {
        id: 'trial-400m-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '400M',
        categoryLabel: '400m Anaerobic Track Lap',
        distanceMeters: 400,
        timeSeconds: 58.20,
        timeFormatted: '58.20s',
        targetSeconds: 60.0,
        targetFormatted: '01m 00s',
        varianceSeconds: -1.80,
        isQualified: true,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Maintained stride frequency around the 200m bend.',
        date: '02-Oct-2026',
        createdAt: '2026-10-02T05:45:00Z'
      },
      {
        id: 'trial-800m-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '800M',
        categoryLabel: '800m Speed Sprint (WBP/KP Standard)',
        distanceMeters: 800,
        timeSeconds: 164,
        timeFormatted: '02m 44s',
        targetSeconds: 180,
        targetFormatted: '03m 00s',
        varianceSeconds: -16,
        isQualified: true,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Strong kick at 600m mark. Exceeding police cutoff.',
        date: '27-Sep-2026',
        createdAt: '2026-09-27T06:00:00Z'
      },
      {
        id: 'trial-1600m-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '1600M',
        categoryLabel: '1600m Battle Physical Efficiency (BPET) Run',
        distanceMeters: 1600,
        timeSeconds: 324,
        timeFormatted: '05m 24s',
        targetSeconds: 330,
        targetFormatted: '05m 30s',
        varianceSeconds: -6,
        isQualified: true,
        pullupsCount: 11,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Super-timed trial PB. Army Group 1 full marks (60/60).',
        date: '04-Oct-2026',
        createdAt: '2026-10-04T05:40:00Z'
      },
      {
        id: 'trial-1600m-02',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '1600M',
        categoryLabel: '1600m Battle Physical Efficiency (BPET) Run',
        distanceMeters: 1600,
        timeSeconds: 342,
        timeFormatted: '05m 42s',
        targetSeconds: 330,
        targetFormatted: '05m 30s',
        varianceSeconds: 12,
        isQualified: true, // Qualified Grp 2
        pullupsCount: 10,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Army Group 2 qualification benchmark cleared.',
        date: '20-Sep-2026',
        createdAt: '2026-09-20T05:40:00Z'
      },
      {
        id: 'trial-5km-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '5KM',
        categoryLabel: '5.0 km Road Endurance Run (SSC GD/CAPF)',
        distanceMeters: 5000,
        timeSeconds: 1312,
        timeFormatted: '21m 52s',
        targetSeconds: 1440,
        targetFormatted: '24m 00s',
        varianceSeconds: -128,
        isQualified: true,
        source: 'TRAINER_DRILL',
        trainerRemarks: 'Steady aerobic cadence on Station Road perimeter.',
        date: '15-Sep-2026',
        createdAt: '2026-09-15T05:15:00Z'
      },
      {
        id: 'trial-10km-01',
        studentId: 'AIM-2026-042',
        studentName: 'Sourav Mukherjee',
        dossierNumber: 'AIM-2026-042',
        category: '10KM',
        categoryLabel: '10.0 km Cross-Country Marathon',
        distanceMeters: 10000,
        timeSeconds: 2840,
        timeFormatted: '47m 20s',
        targetSeconds: 3000,
        targetFormatted: '50m 00s',
        varianceSeconds: -160,
        isQualified: true,
        source: 'CADET_SELF_TRAINING',
        trainerRemarks: 'Self-guided Sunday long run. Excellent hydration protocol.',
        date: '08-Sep-2026',
        createdAt: '2026-09-08T05:00:00Z'
      }
    ];

    this.saveData();
    this.logger.log('AIM Database seeding complete.');
  }
}
