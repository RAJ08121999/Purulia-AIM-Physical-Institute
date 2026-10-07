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
    if (this.data.batches.length === 0) {
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

    // Authentic records only - students register through the official admission form
    this.data.students = [];

    // Authentic events uploaded live by trainers
    this.data.events = [];

    // Authentic assessments only - recorded live by Ustad/trainers
    this.data.assessments = [];

    // Authentic attendance records only - marked during morning roll call
    this.data.attendance = [];

    // Authentic run trials only - logged from field trials or cadet submissions
    this.data.runTrials = [];

    // Authentic event RSVPs only
    this.data.rsvps = [];

    this.saveData();
    this.logger.log('AIM Database seeding complete.');
  }
}
