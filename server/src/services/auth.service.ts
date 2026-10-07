import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from './db.service';

export interface LoginDto {
  identifier: string; // phone or email or dossier number
  accessPin?: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService
  ) {}

  async validateAndLogin(dto: LoginDto) {
    const { identifier, role } = dto;
    const cleanId = identifier.trim();

    // Check if matching trainer or admin
    if (cleanId === 'admin' || cleanId === 'havaldar' || cleanId.includes('aiminstitute')) {
      const payload = {
        sub: 'user-havaldar-anup',
        name: 'Havaldar Anup Kumar Mahato',
        role: role || 'SUPER_ADMIN',
        regiment: 'Indian Army Veteran'
      };

      const token = this.jwtService.sign(payload);
      return {
        success: true,
        token,
        user: {
          id: payload.sub,
          name: payload.name,
          role: payload.role,
          regiment: payload.regiment,
          designation: 'Head Trainer & Founder'
        }
      };
    }

    // Check if matching a registered cadet
    const cadet = this.db.findStudentById(cleanId) || this.db.getStudents().find(s => s.phone === cleanId);
    if (cadet) {
      const payload = {
        sub: cadet.id,
        name: cadet.fullName,
        role: 'STUDENT',
        dossierNumber: cadet.dossierNumber
      };

      const token = this.jwtService.sign(payload);
      return {
        success: true,
        token,
        user: {
          id: cadet.id,
          name: cadet.fullName,
          role: 'STUDENT',
          dossierNumber: cadet.dossierNumber,
          batchId: cadet.batchId,
          targetForce: cadet.targetForce
        }
      };
    }

    // Default fast-pass login for demonstration
    const fallbackPayload = {
      sub: `user-${Date.now()}`,
      name: cleanId || 'Officer Cadet',
      role: role || 'STUDENT'
    };
    const token = this.jwtService.sign(fallbackPayload);

    return {
      success: true,
      token,
      user: {
        id: fallbackPayload.sub,
        name: fallbackPayload.name,
        role: fallbackPayload.role
      }
    };
  }
}
