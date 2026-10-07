import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// MVC Controllers
import { AppController } from './controllers/app.controller';
import { MvcController } from './controllers/mvc.controller';

// REST API Controllers
import { AdmissionsApiController } from './api/admissions.api.controller';
import { EventsApiController } from './api/events.api.controller';
import { TelemetryApiController } from './api/telemetry.api.controller';
import { AttendanceApiController } from './api/attendance.api.controller';
import { AuthApiController } from './api/auth.api.controller';
import { AuditApiController } from './api/audit.api.controller';

// Domain Services
import { DbService } from './services/db.service';
import { AdmissionsService } from './services/admissions.service';
import { EventsService } from './services/events.service';
import { TelemetryService } from './services/telemetry.service';
import { AttendanceService } from './services/attendance.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'papi_defence_tactical_jwt_secret_purulia_2026_aim_academy',
      signOptions: { expiresIn: '15m' }
    })
  ],
  controllers: [
    AppController,
    MvcController,
    AdmissionsApiController,
    EventsApiController,
    TelemetryApiController,
    AttendanceApiController,
    AuthApiController,
    AuditApiController
  ],
  providers: [
    DbService,
    AdmissionsService,
    EventsService,
    TelemetryService,
    AttendanceService,
    AuthService
  ]
})
export class AppModule {}
