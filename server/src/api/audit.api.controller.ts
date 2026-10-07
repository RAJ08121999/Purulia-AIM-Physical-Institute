import { Controller, Get, Query } from '@nestjs/common';
import { DbService } from '../services/db.service';

@Controller('audit')
export class AuditApiController {
  constructor(private readonly db: DbService) {}

  @Get('logs')
  getAuditLogs(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 50;
    return {
      success: true,
      count: this.db.getAuditLogs(lim).length,
      logs: this.db.getAuditLogs(lim)
    };
  }
}
