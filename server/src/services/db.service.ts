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
  LiveDrillSessionEntity,
  TrainerProfileEntity,
  WarCryStoryEntity,
  WarCryStoryComment
} from '../models';

interface DatabaseSchema {
  users: UserEntity[];
  trainers: TrainerProfileEntity[];
  students: StudentProfileEntity[];
  batches: BatchEntity[];
  attendance: AttendanceEntity[];
  assessments: AssessmentResultEntity[];
  runTrials: RunTrialEntity[];
  activeDrill: LiveDrillSessionEntity;
  events: InstituteEventEntity[];
  rsvps: EventRsvpEntity[];
  auditLogs: AuditLogEntity[];
  warCryStories: WarCryStoryEntity[];
}

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger('DbService');
  private readonly dataDir = path.resolve(process.cwd(), 'data');
  private readonly filePath = path.join(this.dataDir, 'aim_store.json');

  private data: DatabaseSchema = {
    users: [],
    trainers: [
      {
        id: 'trainer-anup-kumar-mahato',
        userId: 'user-havaldar-anup',
        instructorId: 'AIM-USTAD-01',
        fullName: 'Havaldar Anup Kumar Mahato',
        rank: 'Ex-Army Havaldar (Infantry Veteran)',
        regimentOrUnit: 'Indian Army (Infantry / Rajputana Rifles)',
        yearsOfService: 16,
        specialization: 'Chief Drill Instructor & 1600m Telemetry Master',
        designation: 'Head Drill Ustad & Founder',
        phone: '9876543210',
        email: 'havaldar.anup@aiminstitute.org',
        bloodGroup: 'B+',
        domicileDistrict: 'Purulia',
        bio: 'Ex-Indian Army Havaldar with 16+ years of frontline military drill and physical efficiency training experience. Chief Instructor and Founder of Purulia AIM Physical Institute.',
        heightCm: 178,
        weightKg: 74,
        chestNormalCm: 84,
        chestExpandedCm: 90,
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z'
      }
    ],
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
    auditLogs: [],
    warCryStories: []
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
        if (!this.data.trainers || this.data.trainers.length === 0) {
          this.data.trainers = [
            {
              id: 'trainer-anup-kumar-mahato',
              userId: 'user-havaldar-anup',
              instructorId: 'AIM-USTAD-01',
              fullName: 'Havaldar Anup Kumar Mahato',
              rank: 'Ex-Army Havaldar (Infantry Veteran)',
              regimentOrUnit: 'Indian Army (Infantry / Rajputana Rifles)',
              yearsOfService: 16,
              specialization: 'Chief Drill Instructor & 1600m Telemetry Master',
              designation: 'Head Drill Ustad & Founder',
              phone: '9876543210',
              email: 'havaldar.anup@aiminstitute.org',
              bloodGroup: 'B+',
              domicileDistrict: 'Purulia',
              bio: 'Ex-Indian Army Havaldar with 16+ years of frontline military drill and physical efficiency training experience. Chief Instructor and Founder of Purulia AIM Physical Institute.',
              heightCm: 178,
              weightKg: 74,
              chestNormalCm: 84,
              chestExpandedCm: 90,
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: new Date().toISOString()
            }
          ];
        }
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
        if (!this.data.warCryStories || this.data.warCryStories.length === 0) {
          this.data.warCryStories = this.getDefaultWarCryStories();
        }
        this.logger.log(`Database loaded: ${this.data.trainers.length} trainers, ${this.data.students.length} cadets, ${this.data.events.length} events, ${this.data.warCryStories.length} war cry stories.`);
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

  // Trainers / Drill Ustads
  getTrainers() {
    return this.data.trainers || [];
  }

  findTrainerById(id: string) {
    return (this.data.trainers || []).find(
      t => t.id === id || t.instructorId === id || t.email === id || t.phone === id
    );
  }

  saveTrainer(trainer: TrainerProfileEntity) {
    if (!this.data.trainers) this.data.trainers = [];
    const idx = this.data.trainers.findIndex(t => t.id === trainer.id || t.instructorId === trainer.instructorId);
    if (idx !== -1) {
      this.data.trainers[idx] = { ...this.data.trainers[idx], ...trainer, updatedAt: new Date().toISOString() };
    } else {
      this.data.trainers.push(trainer);
    }
    this.saveData();
    return trainer;
  }

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

  createEvent(event: any) {
    this.data.events.unshift(event);
    this.saveData();
    return event;
  }

  deleteEvent(id: string) {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.saveData();
    return true;
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
  // WAR CRY STORIES & ROLL OF HONOUR REPOSITORY
  // --------------------------------------------------------------------------
  getWarCryStories() {
    if (!this.data.warCryStories || this.data.warCryStories.length === 0) {
      this.data.warCryStories = this.getDefaultWarCryStories();
    }
    const now = Date.now();
    return this.data.warCryStories.filter(s => {
      if (s.isPermanentHonour) return true;
      const exp = new Date(s.expiresAt).getTime();
      return !isNaN(exp) && exp > now;
    });
  }

  findWarCryStoryById(id: string) {
    return (this.data.warCryStories || []).find(s => s.id === id);
  }

  createWarCryStory(story: WarCryStoryEntity) {
    if (!this.data.warCryStories) this.data.warCryStories = [];
    this.data.warCryStories.unshift(story);
    this.saveData();
    return story;
  }

  likeWarCryStory(id: string, clientToken?: string) {
    if (!this.data.warCryStories) this.data.warCryStories = [];
    const story = this.data.warCryStories.find(s => s.id === id);
    if (!story) return null;

    const token = clientToken || 'anon_' + Math.random().toString(36).substring(7);
    if (!story.likedBy) story.likedBy = [];

    const idx = story.likedBy.indexOf(token);
    if (idx === -1) {
      story.likedBy.push(token);
      story.likesCount = (story.likesCount || 0) + 1;
    } else {
      story.likedBy.splice(idx, 1);
      story.likesCount = Math.max(0, (story.likesCount || 1) - 1);
    }
    this.saveData();
    return story;
  }

  addWarCryComment(storyId: string, comment: WarCryStoryComment) {
    if (!this.data.warCryStories) this.data.warCryStories = [];
    const story = this.data.warCryStories.find(s => s.id === storyId);
    if (!story) return null;

    if (!story.comments) story.comments = [];
    story.comments.push(comment);
    this.saveData();
    return story;
  }

  getPendingHonourStories() {
    return (this.data.warCryStories || []).filter(s => s.honourStatus === 'PENDING');
  }

  verifyHonourStory(storyId: string, approved: boolean, remarks?: string, verifiedBy?: string) {
    if (!this.data.warCryStories) this.data.warCryStories = [];
    const story = this.data.warCryStories.find(s => s.id === storyId);
    if (!story) return null;

    story.honourStatus = approved ? 'APPROVED' : 'REJECTED';
    story.isPermanentHonour = approved;
    story.trainerRemarks = remarks || '';
    story.verifiedAt = new Date().toISOString();
    story.verifiedBy = verifiedBy || 'Havaldar Anup Kumar Mahato';

    if (approved) {
      story.expiresAt = new Date(Date.now() + 10 * 365 * 24 * 3600 * 1000).toISOString();
    }

    this.saveData();
    return story;
  }

  getApprovedHonourStories() {
    return (this.data.warCryStories || []).filter(s => s.isPermanentHonour === true && s.honourStatus === 'APPROVED');
  }

  private getDefaultWarCryStories(): WarCryStoryEntity[] {
    const now = Date.now();
    return [
      {
        id: 'warcry-ustad-01',
        authorId: 'AIM-USTAD-01',
        authorName: 'Havaldar Anup Kumar Mahato',
        authorRole: 'USTAD',
        authorCadre: 'Chief Drill Instructor & Founder',
        tag: 'WAR_CRY',
        tagLabel: '🔥 Ustad War Cry',
        caption: 'पसीने की स्याही से जो लिखते हैं अपने इरादों को, उनके मुक़द्दर के पन्ने कभी कोरे नहीं हुआ करते! 1600 meters is not a test of legs; it is a test of heart and hunger for the Uniform! Alpha Platoon, assemble at 05:00 AM sharp at J.K. College Ground!',
        mediaUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date(now - 2 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now + 22 * 3600 * 1000).toISOString(),
        likesCount: 42,
        likedBy: [],
        comments: [
          {
            id: 'comm-1',
            authorName: 'Cadet MD RAJ',
            authorRole: 'CADET',
            text: 'Jai Hind Ustad Ji! Squad is ready on track at 04:50 AM!',
            createdAt: new Date(now - 1 * 3600 * 1000).toISOString()
          },
          {
            id: 'comm-2',
            authorName: 'Subrata Roy',
            authorRole: 'CADET',
            text: 'Ground 1 timing locked today sir!',
            createdAt: new Date(now - 30 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'warcry-cadet-raj-01',
        authorId: 'AIM-CADET-2026-1220',
        authorName: 'Cadet MD RAJ',
        authorRole: 'CADET',
        authorCadre: 'Kolkata Police Squad',
        tag: '1600M_PR',
        tagLabel: '⚡ 1600m Track Milestone',
        caption: 'Clocked 05m 28s on 1600m track trial today at J.K. College Ground! Pushed beam pull-ups from 4 to 10. The morning dew and mud only make us tougher. Pain is temporary, Uniform is forever. Jai Hind!',
        mediaUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date(now - 4 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now + 20 * 3600 * 1000).toISOString(),
        likesCount: 31,
        likedBy: [],
        comments: [
          {
            id: 'comm-3',
            authorName: 'Havaldar Anup Kumar Mahato',
            authorRole: 'USTAD',
            text: 'Shabash Raj! Maintain this sprint cadence and you will crack the police trial comfortably.',
            createdAt: new Date(now - 3 * 3600 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'honour-subrata-01',
        authorId: 'AIM-CADET-2024-001',
        authorName: 'Subrata Roy',
        authorRole: 'CADET',
        authorCadre: '17th Kumaon Regiment (Indian Army)',
        tag: 'SUCCESS_STORY',
        tagLabel: '🎖️ Roll of Honour • Agniveer GD',
        caption: 'From zero running endurance to 05m 12s under Havaldar Anup Sir. Cleared Group 1 with full 100/100 physical marks at Panagarh Army Rally. Today standing proud in Indian Army uniform!',
        mediaUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date(now - 20 * 3600 * 1000).toISOString(),
        expiresAt: new Date(now + 3650 * 24 * 3600 * 1000).toISOString(),
        likesCount: 89,
        likedBy: [],
        comments: [],
        isPermanentHonour: true,
        honourStatus: 'APPROVED',
        selectedForce: 'Indian Army (Agniveer GD)',
        beltNo: '24-KUMAON-892',
        regimentOrDistrict: '17th Kumaon Regiment',
        selectionYear: '2024',
        timing1600m: '05m 12s (Group 1 • 60 Pts)',
        villageTown: 'Manbazar, Purulia',
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Havaldar Anup Kumar Mahato'
      }
    ];
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
