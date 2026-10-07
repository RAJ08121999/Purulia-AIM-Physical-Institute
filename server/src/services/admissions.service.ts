import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DbService } from './db.service';
import { StudentProfileEntity } from '../models';

export interface CreateAdmissionDto {
  fullName: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: string;
  aadhaarNumber: string;
  phone: string;
  emergencyPhone: string;
  domicileDistrict?: string;
  policeStation: string;
  villageTown: string;
  postOffice?: string;
  pinCode: string;
  casteCategory?: string;
  passportPhoto?: string;
  bloodGroup?: string;
  birthMarks?: string;
  tattooDetails?: string;
  physicalMentalIssues?: string;

  highestEducation?: string;
  matricBoard?: string;
  matricRollNumber?: string;
  matricPassingYear?: string;
  matricAggregatePercent?: number;
  scienceMathPercent?: number;

  tenthBoard?: string;
  tenthStream?: string;
  tenthSpecialization?: string;
  tenthPassingYear?: string;
  tenthRollNumber?: string;
  tenthMarksObtained?: number;
  tenthFullMarks?: number;
  tenthPercentage?: number;

  hasTwelfth?: boolean;
  twelfthBoard?: string;
  twelfthStream?: string;
  twelfthSpecialization?: string;
  twelfthPassingYear?: string;
  twelfthRollNumber?: string;
  twelfthMarksObtained?: number;
  twelfthFullMarks?: number;
  twelfthPercentage?: number;

  hasGraduation?: boolean;
  gradUniversity?: string;
  gradStream?: string;
  gradSpecialization?: string;
  gradPassingYear?: string;
  gradRollNumber?: string;
  gradMarksObtained?: number;
  gradFullMarks?: number;
  gradPercentage?: number;

  hasPostGraduation?: boolean;
  pgUniversity?: string;
  pgStream?: string;
  pgSpecialization?: string;
  pgPassingYear?: string;
  pgRollNumber?: string;
  pgMarksObtained?: number;
  pgFullMarks?: number;
  pgPercentage?: number;

  nccCertificate?: string;
  sportsLevel?: string;
  sportsDiscipline?: string;

  targetForce?: string;
  heightCm: number;
  weightKg: number;
  chestNormalCm: number;
  chestExpandedCm: number;
  current1600mTime?: string;
  currentBeamPullups?: number;
  visionStatus?: string;
  bodyTattoo?: string;

  hasCriminalRecord?: string;
  criminalRecordDetails?: string;
  hasAttendedPastRally?: string;
  pastRallyDetails?: string;
  hasMedicalCondition?: string;
  medicalHistoryDetails?: string;
  characterCertificateAvailable?: boolean;
  standToOathConsent?: boolean;
  noSubstanceAbuseConsent?: boolean;
  mediaConsent?: boolean;
}

@Injectable()
export class AdmissionsService {
  constructor(private readonly db: DbService) {}

  getAllApplications(status?: string) {
    const students = this.db.getStudents();
    if (status) {
      return students.filter(s => s.admissionStatus === status.toUpperCase());
    }
    return students;
  }

  getApplicationById(id: string) {
    const student = this.db.findStudentById(id);
    if (!student) {
      throw new NotFoundException(`Cadet with dossier/ID "${id}" not found`);
    }
    return student;
  }

  createApplication(dto: CreateAdmissionDto) {
    // 1. Validate mandatory fields
    if (!dto.fullName || !dto.fatherName || !dto.phone || !dto.dob || !dto.aadhaarNumber) {
      throw new BadRequestException('Mandatory fields missing: Full Name, Father’s Name, DOB, Phone, Aadhaar');
    }

    const cleanAadhaar = dto.aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      throw new BadRequestException('Aadhaar must be a valid 12-digit UIDAI number');
    }

    // 2. Validate Physical Standard Test measurements
    const normal = Number(dto.chestNormalCm);
    const expanded = Number(dto.chestExpandedCm);
    const expansion = expanded - normal;

    if (isNaN(normal) || isNaN(expanded) || normal <= 0 || expanded <= 0) {
      throw new BadRequestException('Valid chest normal and expanded measurements are required');
    }

    // Generate unique Army Cadet Dossier ID
    const dossierNumber = `AIM-CADET-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCadet: StudentProfileEntity = {
      id: `cadet-${Date.now()}`,
      dossierNumber,
      fullName: dto.fullName.trim(),
      fatherName: dto.fatherName.trim(),
      motherName: dto.motherName?.trim() || '',
      dob: dto.dob,
      gender: dto.gender || 'Male',
      maritalStatus: dto.maritalStatus || 'Unmarried',
      aadhaarNumber: `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
      phone: dto.phone.trim(),
      emergencyPhone: dto.emergencyPhone?.trim() || dto.phone.trim(),
      domicileDistrict: dto.domicileDistrict || 'Purulia',
      policeStation: dto.policeStation?.trim() || 'Purulia Sadar',
      villageTown: dto.villageTown?.trim() || 'Purulia',
      postOffice: dto.postOffice?.trim() || '',
      pinCode: dto.pinCode?.trim() || '723101',
      casteCategory: dto.casteCategory || 'General',
      passportPhoto: dto.passportPhoto || '',

      highestEducation: dto.highestEducation || '10th Matriculation',
      matricBoard: dto.matricBoard || dto.tenthBoard || 'WBBSE',
      matricRollNumber: dto.matricRollNumber?.trim() || dto.tenthRollNumber?.trim(),
      matricPassingYear: dto.matricPassingYear || dto.tenthPassingYear,
      matricAggregatePercent: dto.matricAggregatePercent ? Number(dto.matricAggregatePercent) : dto.tenthPercentage ? Number(dto.tenthPercentage) : undefined,
      scienceMathPercent: dto.scienceMathPercent ? Number(dto.scienceMathPercent) : undefined,

      tenthBoard: dto.tenthBoard || dto.matricBoard || 'WBBSE',
      tenthStream: dto.tenthStream || 'General',
      tenthSpecialization: dto.tenthSpecialization || '',
      tenthPassingYear: dto.tenthPassingYear || dto.matricPassingYear,
      tenthRollNumber: dto.tenthRollNumber || dto.matricRollNumber,
      tenthMarksObtained: dto.tenthMarksObtained ? Number(dto.tenthMarksObtained) : undefined,
      tenthFullMarks: dto.tenthFullMarks ? Number(dto.tenthFullMarks) : undefined,
      tenthPercentage: dto.tenthPercentage ? Number(dto.tenthPercentage) : undefined,

      hasTwelfth: dto.hasTwelfth ?? false,
      twelfthBoard: dto.twelfthBoard,
      twelfthStream: dto.twelfthStream,
      twelfthSpecialization: dto.twelfthSpecialization,
      twelfthPassingYear: dto.twelfthPassingYear,
      twelfthRollNumber: dto.twelfthRollNumber,
      twelfthMarksObtained: dto.twelfthMarksObtained ? Number(dto.twelfthMarksObtained) : undefined,
      twelfthFullMarks: dto.twelfthFullMarks ? Number(dto.twelfthFullMarks) : undefined,
      twelfthPercentage: dto.twelfthPercentage ? Number(dto.twelfthPercentage) : undefined,

      hasGraduation: dto.hasGraduation ?? false,
      gradUniversity: dto.gradUniversity,
      gradStream: dto.gradStream,
      gradSpecialization: dto.gradSpecialization,
      gradPassingYear: dto.gradPassingYear,
      gradRollNumber: dto.gradRollNumber,
      gradMarksObtained: dto.gradMarksObtained ? Number(dto.gradMarksObtained) : undefined,
      gradFullMarks: dto.gradFullMarks ? Number(dto.gradFullMarks) : undefined,
      gradPercentage: dto.gradPercentage ? Number(dto.gradPercentage) : undefined,

      hasPostGraduation: dto.hasPostGraduation ?? false,
      pgUniversity: dto.pgUniversity,
      pgStream: dto.pgStream,
      pgSpecialization: dto.pgSpecialization,
      pgPassingYear: dto.pgPassingYear,
      pgRollNumber: dto.pgRollNumber,
      pgMarksObtained: dto.pgMarksObtained ? Number(dto.pgMarksObtained) : undefined,
      pgFullMarks: dto.pgFullMarks ? Number(dto.pgFullMarks) : undefined,
      pgPercentage: dto.pgPercentage ? Number(dto.pgPercentage) : undefined,

      nccCertificate: dto.nccCertificate || 'None',
      sportsLevel: dto.sportsLevel || 'None',
      sportsDiscipline: dto.sportsDiscipline?.trim(),

      targetForce: dto.targetForce || 'Indian Army Agniveer GD',
      heightCm: Number(dto.heightCm),
      weightKg: Number(dto.weightKg),
      chestNormalCm: normal,
      chestExpandedCm: expanded,
      chestExpansionCm: expansion,
      current1600mTime: dto.current1600mTime || 'Not Tested',
      currentBeamPullups: dto.currentBeamPullups ? Number(dto.currentBeamPullups) : undefined,
      visionStatus: dto.visionStatus || 'Normal 6/6 (No Spectacles)',
      bodyTattoo: dto.bodyTattoo || 'No Permanent Tattoos',
      bloodGroup: dto.bloodGroup || 'B+',
      birthMarks: dto.birthMarks?.trim() || '',
      tattooDetails: dto.tattooDetails?.trim() || '',
      physicalMentalIssues: dto.physicalMentalIssues?.trim() || '',

      hasCriminalRecord: dto.hasCriminalRecord || 'NO',
      criminalRecordDetails: dto.criminalRecordDetails || '',
      hasAttendedPastRally: dto.hasAttendedPastRally || 'NO',
      pastRallyDetails: dto.pastRallyDetails || '',
      hasMedicalCondition: dto.hasMedicalCondition || 'NO',
      medicalHistoryDetails: dto.medicalHistoryDetails || '',
      characterCertificateAvailable: dto.characterCertificateAvailable ?? true,
      standToOathConsent: dto.standToOathConsent ?? true,
      noSubstanceAbuseConsent: dto.noSubstanceAbuseConsent ?? true,
      mediaConsent: dto.mediaConsent ?? true,

      admissionStatus: 'PENDING',
      joinedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = this.db.createStudent(newCadet);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'ENLISTMENT_DOSSIER_SUBMITTED',
      entity: 'StudentProfile',
      entityId: saved.id,
      details: `New cadet enlistment submitted for ${saved.fullName} (${saved.dossierNumber}). Target: ${saved.targetForce}. Chest expansion: ${expansion}cm.`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Enlistment application successfully recorded into AIM Regimental Roster',
      dossierNumber: saved.dossierNumber,
      cadet: saved
    };
  }

  updateStatus(id: string, status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED', batchId?: string) {
    const student = this.db.findStudentById(id);
    if (!student) {
      throw new NotFoundException(`Cadet with ID ${id} not found`);
    }

    const updates: Partial<StudentProfileEntity> = {
      admissionStatus: status
    };

    if (batchId) {
      updates.batchId = batchId;
    }

    if (status === 'APPROVED' && !student.rollNumber) {
      updates.rollNumber = `AIM-CADET-${Math.floor(100 + Math.random() * 900)}`;
    }

    const updated = this.db.updateStudent(id, updates);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: `CADET_STATUS_${status}`,
      entity: 'StudentProfile',
      entityId: id,
      details: `Cadet status changed to ${status}${batchId ? ` and assigned to batch ${batchId}` : ''}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: `Cadet status updated to ${status}`,
      cadet: updated
    };
  }
}
