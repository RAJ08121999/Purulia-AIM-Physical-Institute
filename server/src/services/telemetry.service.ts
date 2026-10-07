import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from './db.service';
import {
  AssessmentResultEntity,
  LiveDrillSessionEntity,
  RunTrialEntity,
  RunCategoryKey
} from '../models';

export interface RecordAssessmentDto {
  studentId: string;
  run1600mSeconds: number; // e.g. 312 for 5:12
  pullupsCount: number;    // e.g. 10
  ditchJump9ftPass?: boolean;
  zigzagBalancePass?: boolean;
  trainerRemarks?: string;
}

@Injectable()
export class TelemetryService {
  constructor(private readonly db: DbService) {}

  getAllAssessments() {
    return this.db.getAssessments();
  }

  getStudentAssessments(studentId: string) {
    return this.db.getAssessments().filter(a => a.studentId === studentId);
  }

  getLeaderboard() {
    return this.db
      .getAssessments()
      .sort((a, b) => b.totalPhysicalMarks - a.totalPhysicalMarks || a.run1600mSeconds - b.run1600mSeconds)
      .slice(0, 20);
  }

  // Official Indian Army Rally Scoring Standard Engine
  calculateArmyBPET(seconds1600m: number, pullups: number, ditchPass = true, zigzagPass = true) {
    // 1600m Run Scoring
    let marks1600m = 0;
    let groupClassification = 'Failed (Over 5m 45s)';

    if (seconds1600m <= 330) {
      // ≤ 5m 30s
      marks1600m = 60;
      groupClassification = 'Group 1 (≤ 5m 30s)';
    } else if (seconds1600m <= 345) {
      // 5m 31s - 5m 45s
      marks1600m = 48;
      groupClassification = 'Group 2 (5m 31s - 5m 45s)';
    } else {
      marks1600m = 0;
      groupClassification = 'Failed (Exceeded Group 2 cut-off)';
    }

    // Dead-hang Beam Pull-ups Scoring
    let marksPullups = 0;
    if (pullups >= 10) marksPullups = 40;
    else if (pullups === 9) marksPullups = 33;
    else if (pullups === 8) marksPullups = 27;
    else if (pullups === 7) marksPullups = 21;
    else if (pullups === 6) marksPullups = 16;
    else marksPullups = 0;

    const totalMarks = (ditchPass && zigzagPass) ? (marks1600m + marksPullups) : 0;

    let grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' = 'NEEDS_IMPROVEMENT';
    if (totalMarks >= 80) grade = 'EXCELLENT';
    else if (totalMarks >= 60) grade = 'GOOD';

    const mins = Math.floor(seconds1600m / 60);
    const secs = seconds1600m % 60;
    const formattedTime = `${mins}m ${secs.toString().padStart(2, '0')}s`;

    return {
      run1600mFormatted: formattedTime,
      groupClassification,
      marks1600m,
      marksPullups,
      totalPhysicalMarks: totalMarks,
      gradeClassification: grade
    };
  }

  recordTrialAssessment(dto: RecordAssessmentDto) {
    const student = this.db.findStudentById(dto.studentId);
    if (!student) {
      throw new BadRequestException(`Cadet with ID "${dto.studentId}" not found`);
    }

    const ditch = dto.ditchJump9ftPass ?? true;
    const zigzag = dto.zigzagBalancePass ?? true;
    const telemetry = this.calculateArmyBPET(dto.run1600mSeconds, dto.pullupsCount, ditch, zigzag);

    const newResult: AssessmentResultEntity = {
      id: `telemetry-${Date.now()}`,
      assessmentId: `assessment-${new Date().toISOString().slice(0, 10)}`,
      studentId: student.id,
      studentName: student.fullName,
      dossierNumber: student.dossierNumber,
      run1600mSeconds: dto.run1600mSeconds,
      run1600mFormatted: telemetry.run1600mFormatted,
      groupClassification: telemetry.groupClassification,
      marks1600m: telemetry.marks1600m,
      pullupsCount: dto.pullupsCount,
      marksPullups: telemetry.marksPullups,
      ditchJump9ftPass: ditch,
      zigzagBalancePass: zigzag,
      totalPhysicalMarks: telemetry.totalPhysicalMarks,
      gradeClassification: telemetry.gradeClassification,
      trainerRemarks: dto.trainerRemarks || 'Standard timed evaluation on J.K. College ground track',
      createdAt: new Date().toISOString()
    };

    const saved = this.db.recordAssessmentResult(newResult);

    // Update student's baseline time if better
    this.db.updateStudent(student.id, {
      current1600mTime: telemetry.run1600mFormatted,
      currentBeamPullups: dto.pullupsCount
    });

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'BPET_TELEMETRY_RECORDED',
      entity: 'AssessmentResult',
      entityId: saved.id,
      details: `Cadet ${student.fullName} scored ${saved.totalPhysicalMarks}/100. 1600m: ${saved.run1600mFormatted} (${saved.groupClassification}), Pull-ups: ${saved.pullupsCount}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'BPET physical trial score recorded successfully',
      assessment: saved
    };
  }

  // --------------------------------------------------------------------------
  // RUN CATEGORIES & LIVE DRILL STOPWATCH CONTROL
  // --------------------------------------------------------------------------

  getRunCategories() {
    return STANDARD_RUN_CATEGORIES;
  }

  getLiveDrillSession(): LiveDrillSessionEntity {
    return this.db.getActiveDrill();
  }

  controlLiveDrill(dto: ControlDrillDto): LiveDrillSessionEntity {
    const current = this.db.getActiveDrill();
    const now = Date.now();
    let updates: Partial<LiveDrillSessionEntity> = {};

    switch (dto.action) {
      case 'START': {
        const cat = dto.category || current.category || '1600M';
        const std = STANDARD_RUN_CATEGORIES.find(c => c.key === cat);
        const distance = dto.distanceMeters ?? (std?.distanceMeters || 1600);
        const target = dto.targetSeconds ?? (std?.targetSeconds || 330);
        const targetLabel = dto.targetLabel || (std?.targetLabel || `${Math.floor(target / 60)}m ${target % 60}s`);

        updates = {
          category: cat,
          categoryLabel: dto.categoryLabel || std?.label || `${distance}m Custom Run`,
          distanceMeters: distance,
          targetSeconds: target,
          targetLabel: targetLabel,
          trainerName: dto.trainerName || current.trainerName || 'Havaldar Anup Kumar Mahato (Ex-Army)',
          status: 'RUNNING',
          startedAt: now,
          pausedAt: null,
          elapsedMs: 0,
          laps: [],
          cadetFinishes: {}
        };
        break;
      }

      case 'PAUSE': {
        if (current.status === 'RUNNING' && current.startedAt) {
          const added = now - current.startedAt;
          updates = {
            status: 'PAUSED',
            pausedAt: now,
            elapsedMs: current.elapsedMs + added,
            startedAt: null
          };
        }
        break;
      }

      case 'RESUME': {
        if (current.status === 'PAUSED') {
          updates = {
            status: 'RUNNING',
            startedAt: now,
            pausedAt: null
          };
        }
        break;
      }

      case 'STOP': {
        let finalElapsed = current.elapsedMs;
        if (current.status === 'RUNNING' && current.startedAt) {
          finalElapsed += (now - current.startedAt);
        }
        updates = {
          status: 'STOPPED',
          startedAt: null,
          pausedAt: null,
          elapsedMs: finalElapsed
        };
        break;
      }

      case 'CLOSE':
      case 'RESET': {
        updates = {
          status: 'IDLE',
          startedAt: null,
          pausedAt: null,
          elapsedMs: 0,
          laps: [],
          cadetFinishes: {}
        };
        break;
      }

      case 'LAP': {
        let currentTotalMs = current.elapsedMs;
        if (current.status === 'RUNNING' && current.startedAt) {
          currentTotalMs += (now - current.startedAt);
        }
        const lapNum = current.laps.length + 1;
        const totalSecs = currentTotalMs / 1000;
        const mins = Math.floor(totalSecs / 60);
        const secs = (totalSecs % 60).toFixed(2);
        const formatted = `${mins}m ${secs.padStart(5, '0')}s`;

        const newLaps = [
          ...current.laps,
          {
            lapNumber: lapNum,
            splitTimeMs: currentTotalMs,
            splitFormatted: formatted,
            label: `Lap ${lapNum}`
          }
        ];
        updates = { laps: newLaps };
        break;
      }

      case 'CONFIGURE': {
        const cat = dto.category || current.category;
        const std = STANDARD_RUN_CATEGORIES.find(c => c.key === cat);
        updates = {
          category: cat,
          categoryLabel: dto.categoryLabel || std?.label || current.categoryLabel,
          distanceMeters: dto.distanceMeters ?? (std?.distanceMeters || current.distanceMeters),
          targetSeconds: dto.targetSeconds ?? (std?.targetSeconds || current.targetSeconds),
          targetLabel: dto.targetLabel || (std?.targetLabel || current.targetLabel)
        };
        break;
      }

      default:
        throw new BadRequestException(`Unknown drill action: ${dto.action}`);
    }

    const updated = this.db.updateActiveDrill(updates);

    const operator = dto.operatorName
      ? `${dto.operatorName} (${dto.operatorRole || 'Authorized Cadet/Trainer'})`
      : (dto.trainerName || 'Drill Officer');

    this.db.createAuditLog({
      id: `audit-${now}`,
      action: `DRILL_TIMER_${dto.action}`,
      entity: 'LiveDrillSession',
      entityId: updated.id,
      details: `Drill timer action ${dto.action} for ${updated.categoryLabel} by ${operator}. Status: ${updated.status}`,
      createdAt: new Date().toISOString()
    });

    return updated;
  }

  // --------------------------------------------------------------------------
  // CATEGORIZED RUN TRIALS (100M, 400M, 800M, 1600M, 5KM, 10KM)
  // --------------------------------------------------------------------------

  getRunTrials(studentId?: string, category?: string) {
    return this.db.getRunTrials(studentId, category);
  }

  recordRunTrial(dto: RecordRunTrialDto): RunTrialEntity {
    const student = this.db.findStudentById(dto.studentId);
    const studentName = dto.studentName || student?.fullName || dto.studentId;

    const std = STANDARD_RUN_CATEGORIES.find(c => c.key === dto.category);
    const distance = dto.distanceMeters ?? (std?.distanceMeters || 1600);
    const target = dto.targetSeconds ?? (std?.targetSeconds || 330);
    const variance = Number((dto.timeSeconds - target).toFixed(2));
    const isQualified = variance <= 0;

    let timeFormatted = '';
    if (dto.timeSeconds < 60) {
      timeFormatted = `${dto.timeSeconds.toFixed(2)}s`;
    } else {
      const mins = Math.floor(dto.timeSeconds / 60);
      const secs = Math.floor(dto.timeSeconds % 60).toString().padStart(2, '0');
      timeFormatted = `${mins}m ${secs}s`;
    }

    let targetFormatted = '';
    if (target < 60) {
      targetFormatted = `${target.toFixed(2)}s`;
    } else {
      const mins = Math.floor(target / 60);
      const secs = Math.floor(target % 60).toString().padStart(2, '0');
      targetFormatted = `${mins}m ${secs}s`;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newTrial: RunTrialEntity = {
      id: `trial-${dto.category.toLowerCase()}-${Date.now()}`,
      studentId: dto.studentId,
      studentName: studentName,
      dossierNumber: student?.dossierNumber || dto.studentId,
      category: dto.category,
      categoryLabel: std?.label || `${distance}m Run`,
      distanceMeters: distance,
      timeSeconds: dto.timeSeconds,
      timeFormatted: timeFormatted,
      targetSeconds: target,
      targetFormatted: targetFormatted,
      varianceSeconds: variance,
      isQualified: isQualified,
      pullupsCount: dto.pullupsCount,
      source: dto.source || 'CADET_SELF_TRAINING',
      trainerRemarks: dto.trainerRemarks || (isQualified ? 'Target met.' : 'Gap identified.'),
      date: todayStr,
      createdAt: new Date().toISOString()
    };

    const saved = this.db.recordRunTrial(newTrial);

    // If 1600m run, also update baseline if needed
    if (dto.category === '1600M' && student) {
      this.db.updateStudent(student.id, {
        current1600mTime: timeFormatted
      });
    }

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'RUN_TRIAL_RECORDED',
      entity: 'RunTrial',
      entityId: saved.id,
      details: `${saved.categoryLabel} trial recorded for ${studentName}: ${saved.timeFormatted} (${saved.isQualified ? 'Qualified' : 'Gap: +' + saved.varianceSeconds + 's'}) [${saved.source}]`,
      createdAt: new Date().toISOString()
    });

    return saved;
  }
}

export interface ControlDrillDto {
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

export interface RecordRunTrialDto {
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

export const STANDARD_RUN_CATEGORIES = [
  {
    key: '100M' as RunCategoryKey,
    label: '100m Explosive Sprint',
    distanceMeters: 100,
    targetSeconds: 12.0,
    targetFormatted: '12.00s',
    targetLabel: 'Sprint Standard (≤ 12.0s)',
    description: 'Explosive start acceleration, knee drive, and maximum velocity mechanics.'
  },
  {
    key: '400M' as RunCategoryKey,
    label: '400m Track Lap',
    distanceMeters: 400,
    targetSeconds: 60.0,
    targetFormatted: '01m 00s',
    targetLabel: 'Standard 400m Lap (≤ 60.0s)',
    description: 'Anaerobic threshold maintenance and stride cadence through turn 2.'
  },
  {
    key: '800M' as RunCategoryKey,
    label: '800m Speed Sprint',
    distanceMeters: 800,
    targetSeconds: 180.0,
    targetFormatted: '03m 00s',
    targetLabel: 'WBP & KP SI Cutoff (≤ 03m 00s)',
    description: 'Middle-distance pacing for Police Services and Lady Cadet recruitment.'
  },
  {
    key: '1600M' as RunCategoryKey,
    label: '1600m Battle Physical Efficiency (BPET) Run',
    distanceMeters: 1600,
    targetSeconds: 330.0,
    targetFormatted: '05m 30s',
    targetLabel: 'Army Group 1 Cutoff (≤ 05m 30s • 60 Pts)',
    description: 'Indian Army Agniveer GD & Tradesman 4-lap battlefield endurance trial.'
  },
  {
    key: '5KM' as RunCategoryKey,
    label: '5.0 km Road Endurance Run',
    distanceMeters: 5000,
    targetSeconds: 1440.0,
    targetFormatted: '24m 00s',
    targetLabel: 'SSC GD / CAPF Cutoff (≤ 24m 00s)',
    description: 'Continuous road endurance test for Paramilitary Central Armed Police Forces.'
  },
  {
    key: '10KM' as RunCategoryKey,
    label: '10.0 km Cross-Country Marathon',
    distanceMeters: 10000,
    targetSeconds: 3000.0,
    targetFormatted: '50m 00s',
    targetLabel: 'Special Forces Benchmark (≤ 50m 00s)',
    description: 'High-mileage aerobic base and mental stamina road/trail conditioning.'
  }
];
