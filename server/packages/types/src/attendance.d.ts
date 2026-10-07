import { AttendanceStatus } from './roles';
export interface BatchSession {
    id: string;
    batchId: string;
    sessionDate: string;
    startTime: string;
    planTitle: string;
    warmupMinutes: number;
    runningDetails: string;
    strengthWork: string;
    cooldownMinutes: number;
}
export interface AttendanceRecordInput {
    studentId: string;
    status: AttendanceStatus;
    notes?: string;
}
export interface BulkAttendanceSubmission {
    sessionId: string;
    records: AttendanceRecordInput[];
}
export interface StudentAttendanceSummary {
    studentId: string;
    fullName: string;
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    leaveCount: number;
    attendancePercentage: number;
    consecutiveAbsences: number;
    needsAttention: boolean;
}
//# sourceMappingURL=attendance.d.ts.map