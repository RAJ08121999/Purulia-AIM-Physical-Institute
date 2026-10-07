import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import {
  TelemetryService,
  RecordAssessmentDto,
  ControlDrillDto,
  RecordRunTrialDto
} from '../services/telemetry.service';

@Controller('telemetry')
export class TelemetryApiController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  getAllAssessments() {
    return this.telemetryService.getAllAssessments();
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.telemetryService.getLeaderboard();
  }

  @Get('student/:studentId')
  getStudentAssessments(@Param('studentId') studentId: string) {
    return this.telemetryService.getStudentAssessments(studentId);
  }

  @Post('assessment')
  recordTrialAssessment(@Body() dto: RecordAssessmentDto) {
    return this.telemetryService.recordTrialAssessment(dto);
  }

  // -------------------------------------------------------------
  // RUN CATEGORIES & LIVE DRILL STOPWATCH BROADCAST
  // -------------------------------------------------------------

  @Get('categories')
  getRunCategories() {
    return this.telemetryService.getRunCategories();
  }

  @Get('live-drill')
  getLiveDrillSession() {
    return this.telemetryService.getLiveDrillSession();
  }

  @Post('live-drill/control')
  controlLiveDrill(@Body() dto: ControlDrillDto) {
    return this.telemetryService.controlLiveDrill(dto);
  }

  @Get('trials')
  getRunTrials(
    @Query('studentId') studentId?: string,
    @Query('category') category?: string
  ) {
    return this.telemetryService.getRunTrials(studentId, category);
  }

  @Post('trials')
  recordRunTrial(@Body() dto: RecordRunTrialDto) {
    return this.telemetryService.recordRunTrial(dto);
  }
}
