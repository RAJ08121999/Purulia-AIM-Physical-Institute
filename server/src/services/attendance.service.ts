import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from './db.service';
import { AttendanceEntity } from '../models';

export interface MarkAttendanceItemDto {
  studentId: string;
  batchId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

@Injectable()
export class AttendanceService {
  constructor(private readonly db: DbService) {}

  getBatches() {
    return this.db.getBatches();
  }

  getAttendanceRecords(batchId?: string, date?: string) {
    return this.db.getAttendance(batchId, date);
  }

  markBulkAttendance(records: MarkAttendanceItemDto[], markedByName = 'Havaldar Anup Kumar Mahato') {
    if (!records || records.length === 0) {
      throw new BadRequestException('Attendance records list cannot be empty');
    }

    const todayIso = new Date().toISOString();
    const entities: AttendanceEntity[] = records.map(rec => {
      const student = this.db.findStudentById(rec.studentId);
      const batch = this.db.findBatchById(rec.batchId);

      return {
        id: `att-${Date.now()}-${rec.studentId}`,
        date: todayIso,
        studentId: rec.studentId,
        studentName: student?.fullName || 'Cadet',
        dossierNumber: student?.dossierNumber || 'AIM-CADET',
        batchId: rec.batchId,
        batchName: batch?.name || 'General Batch',
        status: rec.status,
        remarks: rec.remarks || '',
        markedBy: markedByName,
        createdAt: todayIso
      };
    });

    const saved = this.db.recordAttendanceBatch(entities);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'BULK_ATTENDANCE_RECORDED',
      entity: 'Attendance',
      details: `${records.length} cadets roll call recorded by ${markedByName}`,
      createdAt: todayIso
    });

    return {
      success: true,
      message: `Morning roll call recorded for ${records.length} cadets.`,
      records: saved
    };
  }

  getDefaulters() {
    const students = this.db.getStudents();
    const attendance = this.db.getAttendance();

    // Check last 3 attendances per student
    const defaulters: Array<{
      studentId: string;
      fullName: string;
      dossierNumber: string;
      consecutiveAbsences: number;
      phone: string;
      batchId?: string;
    }> = [];

    students.forEach(st => {
      const studentHistory = attendance
        .filter(a => a.studentId === st.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      let absentStreak = 0;
      for (const rec of studentHistory) {
        if (rec.status === 'ABSENT') {
          absentStreak++;
        } else {
          break;
        }
      }

      if (absentStreak >= 2) {
        defaulters.push({
          studentId: st.id,
          fullName: st.fullName,
          dossierNumber: st.dossierNumber,
          consecutiveAbsences: absentStreak,
          phone: st.phone,
          batchId: st.batchId
        });
      }
    });

    return defaulters;
  }
}
