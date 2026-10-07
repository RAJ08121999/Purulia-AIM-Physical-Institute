import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      status: 'ok',
      message: 'Purulia Aim Physical Institute (AIM) API Server is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/v1/health'
      }
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
