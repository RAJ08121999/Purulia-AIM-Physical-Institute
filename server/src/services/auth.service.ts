import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from './db.service';
import { PrismaService } from './prisma.service';
import * as argon2 from 'argon2';

export interface LoginDto {
  identifier: string; // email, phone, or dossier number
  password?: string;
  role?: 'STUDENT' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface RegisterTrainerDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  fatherName?: string;
  dob?: string;
  gender?: string;
  aadhaarNumber?: string;
  emergencyPhone?: string;
  domicileDistrict?: string;
  policeStation?: string;
  villageTown?: string;
  pinCode?: string;
  bloodGroup?: string;
  heightCm?: string | number;
  weightKg?: string | number;
  chestNormalCm?: string | number;
  chestExpandedCm?: string | number;
  highestEducation?: string;
  fieldExperienceYears?: string;
  regimentOrTitle?: string;
  specialization?: string;
  pastMilitaryServiceDetails?: string;
  secretVerificationCode?: string; // Optional regimental passkey (e.g. "AIM-PURULIA-2026")
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly db: DbService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    await this.seedChiefInstructor();
  }

  /**
   * Seed demo data for Havaldar Anup Kumar Mahato Sir (Chief Instructor & Founder)
   * into Supabase PostgreSQL (Prisma) and local datastore.
   */
  async seedChiefInstructor() {
    try {
      const email = 'havaldar.anup@aiminstitute.org';
      const phone = '9876543210';
      const defaultPassword = 'Ustad@AIM2026';
      const passwordHash = await argon2.hash(defaultPassword);

      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }]
        }
      });

      if (!existingUser) {
        const user = await this.prisma.user.create({
          data: {
            id: 'user-havaldar-anup',
            email,
            phone,
            fullName: 'Havaldar Anup Kumar Mahato',
            passwordHash,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE'
          }
        });

        try {
          await (this.prisma as any).trainerProfile?.create({
            data: {
              userId: user.id,
              instructorId: 'AIM-USTAD-01',
              fullName: 'Havaldar Anup Kumar Mahato',
              rank: 'Ex-Army Havaldar (Infantry Veteran)',
              regimentOrUnit: 'Indian Army (Infantry / Rajputana Rifles)',
              yearsOfService: 16,
              specialization: 'Chief Drill Instructor & 1600m Telemetry Master',
              designation: 'Head Drill Ustad & Founder',
              phone,
              email,
              bloodGroup: 'B+',
              domicileDistrict: 'Purulia',
              bio: 'Ex-Indian Army Havaldar with 16+ years of military drill discipline and physical efficiency training expertise. Founder & Chief Training Master at Purulia AIM Physical Institute.',
              heightCm: 178,
              weightKg: 74,
              chestNormalCm: 84,
              chestExpandedCm: 90,
              isActive: true
            }
          });
        } catch (tpErr: any) {
          this.logger.warn(`TrainerProfile note: ${tpErr.message}`);
        }

        this.logger.log('Chief Instructor Havaldar Anup Kumar Mahato successfully seeded into Supabase.');
      } else {
        // Ensure role is SUPER_ADMIN and passwordHash is updated to Ustad@AIM2026
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            role: 'SUPER_ADMIN'
          }
        });
        this.logger.log('Chief Instructor credentials verified in Supabase.');
      }
    } catch (err: any) {
      this.logger.warn(`Could not seed Chief Instructor to Prisma: ${err.message}`);
    }
  }

  async getChiefInstructorProfile() {
    const fromLocal = this.db.findTrainerById('AIM-USTAD-01') || this.db.getTrainers()[0];
    try {
      const fromPrisma = await (this.prisma as any).trainerProfile?.findFirst({
        where: { instructorId: 'AIM-USTAD-01' }
      });
      if (fromPrisma) return fromPrisma;
    } catch (e: any) {}
    return fromLocal;
  }

  async validateAndLogin(dto: LoginDto) {
    const { identifier, password, role } = dto;
    if (!identifier) {
      throw new BadRequestException('Identifier (Email / Phone / Dossier ID) is required');
    }
    if (!password) {
      throw new UnauthorizedException('Wrong credentials. Password is required to enter profile.');
    }

    const cleanId = identifier.trim().toLowerCase();
    const isAnupIdentifier =
      cleanId === 'havaldar.anup@aiminstitute.org' ||
      cleanId === 'anup.mahato@aiminstitute.org' ||
      cleanId === 'aim-ustad-01' ||
      identifier.trim() === '9876543210' ||
      identifier.trim() === '918699261094' ||
      cleanId === 'havaldar' ||
      cleanId === 'ustad' ||
      cleanId === 'admin';

    // 1. Strict Chief Instructor (Havaldar Anup Sir) Verification
    if (isAnupIdentifier) {
      let isMatch = password === 'Ustad@AIM2026';
      if (!isMatch) {
        try {
          const user = await this.prisma.user.findFirst({
            where: {
              OR: [
                { email: 'havaldar.anup@aiminstitute.org' },
                { phone: '9876543210' }
              ]
            }
          });
          if (user && user.passwordHash) {
            isMatch = await argon2.verify(user.passwordHash, password);
          }
        } catch (e: any) {}
      }

      if (!isMatch) {
        throw new UnauthorizedException('Wrong credentials. Invalid identifier or password.');
      }

      const payload = {
        sub: 'user-havaldar-anup',
        name: 'Havaldar Anup Kumar Mahato',
        email: 'havaldar.anup@aiminstitute.org',
        role: role || 'SUPER_ADMIN',
        regiment: 'Indian Army Veteran (Head Drill Ustad)',
        designation: 'Chief Instructor & Founder'
      };

      const token = this.jwtService.sign(payload);
      return {
        success: true,
        message: 'Welcome Drill Ustad Havaldar Anup Kumar Mahato Sir!',
        token,
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          phone: '9876543210',
          role: 'TRAINER',
          rank: 'Ex-Army Havaldar',
          regiment: payload.regiment,
          designation: payload.designation,
          instructorId: 'AIM-USTAD-01',
          specialization: 'Chief Drill Instructor & BPET Master'
        }
      };
    }

    // 2. Database User Lookup (Students & Registered Trainers) via Prisma
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanId },
            { phone: identifier.trim() },
            { studentProfile: { dossierNumber: identifier.trim() } }
          ]
        },
        include: {
          studentProfile: true
        }
      });

      if (user) {
        if (!user.passwordHash) {
          throw new UnauthorizedException('Wrong credentials. Please reset your password.');
        }
        const isPasswordValid = await argon2.verify(user.passwordHash, password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Wrong credentials. Invalid identifier or password.');
        }

        // Cadet access control: Must be verified and approved by a trainer
        if (user.role === 'STUDENT' || role === 'STUDENT') {
          const profile = user.studentProfile || await this.prisma.studentProfile.findFirst({
            where: {
              OR: [
                { userId: user.id },
                { phone: user.phone },
                { dossierNumber: identifier.trim() }
              ]
            }
          }) || this.db.getStudents().find(s => s.phone === user.phone || s.dossierNumber === identifier.trim());

          if (profile) {
            if (profile.admissionStatus === 'REJECTED') {
              throw new ForbiddenException(
                'Your admission application was rejected by the Drill Ustad. Please visit the academy office at J.K. College Ground for assistance.'
              );
            }
            if (profile.admissionStatus !== 'APPROVED') {
              throw new ForbiddenException(
                `Your admission dossier (${profile.dossierNumber}) is currently PENDING verification by the Drill Ustad / Trainer. Profile access will be granted once your admission is verified and approved.`
              );
            }
          }
        }

        const payload = {
          sub: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          dossierNumber: user.studentProfile?.dossierNumber || undefined
        };

        const token = this.jwtService.sign(payload);
        return {
          success: true,
          token,
          user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dossierNumber: user.studentProfile?.dossierNumber,
            batchId: user.studentProfile?.batchId,
            targetForce: user.studentProfile?.targetForce
          }
        };
      }
    } catch (err: any) {
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) throw err;
      this.logger.warn(`Prisma user lookup note: ${err.message}`);
    }

    // 3. Fallback: Check registered cadet in local store by dossier, phone, or email
    const cadet = this.db.findStudentById(identifier.trim()) ||
      this.db.getStudents().find(s => s.phone === identifier.trim() || (s as any).email === cleanId);

    if (cadet) {
      if ((cadet as any).password) {
        const storedPwd = (cadet as any).password;
        let isMatch = false;
        if (storedPwd.startsWith('$argon2')) {
          isMatch = await argon2.verify(storedPwd, password);
        } else {
          isMatch = storedPwd === password;
        }
        if (!isMatch) {
          throw new UnauthorizedException('Wrong credentials. Invalid identifier or password.');
        }
      }

      if (cadet.admissionStatus === 'REJECTED') {
        throw new ForbiddenException(
          'Your admission application was rejected by the Drill Ustad. Please visit the academy office at J.K. College Ground for assistance.'
        );
      }
      if (cadet.admissionStatus !== 'APPROVED') {
        throw new ForbiddenException(
          `Your admission dossier (${cadet.dossierNumber}) is currently PENDING verification by the Drill Ustad / Trainer. Profile access will be granted once your admission is verified and approved.`
        );
      }

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

    // 4. No valid account found or wrong credentials
    throw new UnauthorizedException('Wrong credentials. Cadet or Trainer account not found.');
  }

  async registerTrainer(dto: RegisterTrainerDto) {
    if (!dto.fullName || !dto.email || !dto.password || !dto.phone) {
      throw new BadRequestException('Full Name, Email, Phone, and Password are required for Ustad registration.');
    }

    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanPhone = dto.phone.trim();

    // Check if user already exists in Prisma
    try {
      const existing = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            { phone: cleanPhone }
          ]
        }
      });
      if (existing) {
        throw new BadRequestException('An account with this email or phone is already registered.');
      }
    } catch (e: any) {
      if (e instanceof BadRequestException) throw e;
    }

    const passwordHash = await argon2.hash(dto.password);
    let newUser = null;

    try {
      newUser = await this.prisma.user.create({
        data: {
          email: cleanEmail,
          phone: cleanPhone,
          fullName: dto.fullName.trim(),
          passwordHash,
          role: 'TRAINER',
          status: 'ACTIVE'
        }
      });
      this.logger.log(`Drill Ustad registered in Supabase: ${newUser.fullName} (${newUser.email})`);
    } catch (err: any) {
      this.logger.warn(`Could not save Ustad to Prisma: ${err.message}`);
      newUser = {
        id: `trainer-${Date.now()}`,
        email: cleanEmail,
        phone: cleanPhone,
        fullName: dto.fullName.trim(),
        role: 'TRAINER'
      };
    }

    const payload = {
      sub: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      role: 'TRAINER',
      regiment: dto.regimentOrTitle || 'Drill Instructor'
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Drill Ustad account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.fullName,
        email: newUser.email,
        phone: cleanPhone,
        role: 'TRAINER',
        regiment: dto.regimentOrTitle || 'Drill Instructor',
        specialization: dto.specialization || 'Physical Standards & Telemetry'
      }
    };
  }

  async updateTrainerProfile(dto: any) {
    const instructorId = dto.instructorId || 'AIM-USTAD-01';
    let targetUser: any = null;

    try {
      targetUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: 'havaldar.anup@aiminstitute.org' },
            { id: 'user-havaldar-anup' },
            { phone: '9876543210' },
            ...(dto.email ? [{ email: dto.email.trim().toLowerCase() }] : []),
            ...(dto.phone ? [{ phone: dto.phone.trim() }] : [])
          ]
        },
        include: { trainerProfile: true }
      });
    } catch (e: any) {
      this.logger.warn(`Prisma find trainer error: ${e.message}`);
    }

    const cleanPhone = dto.phone ? String(dto.phone).replace(/\D/g, '') : undefined;
    const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : undefined;

    const trainerData: any = {};
    if (dto.fullName) trainerData.fullName = dto.fullName.trim();
    if (dto.rank) trainerData.rank = dto.rank.trim();
    if (dto.regimentOrUnit) trainerData.regimentOrUnit = dto.regimentOrUnit.trim();
    if (dto.yearsOfService !== undefined && dto.yearsOfService !== '') trainerData.yearsOfService = Number(dto.yearsOfService);
    if (dto.specialization) trainerData.specialization = dto.specialization.trim();
    if (dto.designation) trainerData.designation = dto.designation.trim();
    if (cleanPhone) trainerData.phone = cleanPhone;
    if (cleanEmail) trainerData.email = cleanEmail;
    if (dto.bloodGroup) trainerData.bloodGroup = dto.bloodGroup;
    if (dto.domicileDistrict) trainerData.domicileDistrict = dto.domicileDistrict;
    if (dto.bio !== undefined) trainerData.bio = dto.bio;

    if (dto.heightCm !== undefined && dto.heightCm !== '') trainerData.heightCm = Number(dto.heightCm);
    if (dto.weightKg !== undefined && dto.weightKg !== '') trainerData.weightKg = Number(dto.weightKg);
    if (dto.chestNormalCm !== undefined && dto.chestNormalCm !== '') trainerData.chestNormalCm = Number(dto.chestNormalCm);
    if (dto.chestExpandedCm !== undefined && dto.chestExpandedCm !== '') trainerData.chestExpandedCm = Number(dto.chestExpandedCm);

    // Optional password update
    if (dto.newPassword && dto.newPassword.trim().length >= 6) {
      const newHash = await argon2.hash(dto.newPassword.trim());
      if (targetUser?.id) {
        try {
          await this.prisma.user.update({
            where: { id: targetUser.id },
            data: { passwordHash: newHash }
          });
          this.logger.log(`Ustad password updated in Supabase for user ${targetUser.id}`);
        } catch (pwErr: any) {
          this.logger.warn(`Could not update password in Prisma: ${pwErr.message}`);
        }
      }
    }

    // Update in Prisma
    try {
      if (targetUser) {
        await this.prisma.user.update({
          where: { id: targetUser.id },
          data: {
            ...(trainerData.fullName ? { fullName: trainerData.fullName } : {}),
            ...(cleanPhone ? { phone: cleanPhone } : {}),
            ...(cleanEmail ? { email: cleanEmail } : {})
          }
        });

        const tp = await (this.prisma as any).trainerProfile?.findFirst({
          where: {
            OR: [
              { userId: targetUser.id },
              { instructorId },
              { email: targetUser.email }
            ]
          }
        });

        if (tp) {
          await (this.prisma as any).trainerProfile?.update({
            where: { id: tp.id },
            data: trainerData
          });
        } else {
          await (this.prisma as any).trainerProfile?.create({
            data: {
              userId: targetUser.id,
              instructorId,
              fullName: trainerData.fullName || targetUser.fullName,
              phone: cleanPhone || targetUser.phone,
              email: cleanEmail || targetUser.email,
              ...trainerData
            }
          });
        }
        this.logger.log(`TrainerProfile updated in Supabase for ${instructorId}`);
      }
    } catch (tpErr: any) {
      this.logger.warn(`TrainerProfile update note: ${tpErr.message}`);
    }

    // Also update in local DB
    const localTrainers = this.db.getTrainers();
    if (localTrainers.length > 0) {
      const t = localTrainers[0];
      Object.assign(t, trainerData);
    }

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'TRAINER_PROFILE_UPDATED',
      entity: 'TrainerProfile',
      entityId: instructorId,
      details: `Drill Ustad profile updated for ${trainerData.fullName || 'Havaldar Anup Kumar Mahato'}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Drill Ustad profile updated successfully',
      trainer: {
        instructorId,
        ...(targetUser?.trainerProfile || {}),
        ...trainerData
      }
    };
  }
}
