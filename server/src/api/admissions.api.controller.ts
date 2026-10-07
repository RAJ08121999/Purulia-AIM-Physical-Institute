import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { AdmissionsService, CreateAdmissionDto } from '../services/admissions.service';

@Controller('admissions')
export class AdmissionsApiController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Get()
  getAllApplications(@Query('status') status?: string) {
    return this.admissionsService.getAllApplications(status);
  }

  @Get(':id')
  getApplicationById(@Param('id') id: string) {
    return this.admissionsService.getApplicationById(id);
  }

  @Post()
  submitEnlistment(@Body() dto: CreateAdmissionDto) {
    return this.admissionsService.createApplication(dto);
  }

  @Patch(':id/status')
  updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'; batchId?: string }
  ) {
    return this.admissionsService.updateStatus(id, body.status, body.batchId);
  }
}
