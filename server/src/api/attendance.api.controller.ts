import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttendanceService, MarkAttendanceItemDto } from '../services/attendance.service';

@Controller('attendance')
export class AttendanceApiController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAttendance(@Query('batchId') batchId?: string, @Query('date') date?: string) {
    return this.attendanceService.getAttendanceRecords(batchId, date);
  }

  @Get('batches')
  getBatches() {
    return this.attendanceService.getBatches();
  }

  @Get('defaulters')
  getDefaulters() {
    return this.attendanceService.getDefaulters();
  }

  @Post('bulk')
  recordBulkRollCall(@Body() body: { records: MarkAttendanceItemDto[]; markedBy?: string }) {
    return this.attendanceService.markBulkAttendance(body.records, body.markedBy);
  }
}
