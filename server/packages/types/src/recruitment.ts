import { ForceType } from './roles';

export enum RecruitmentStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface RecruitmentBulletin {
  id: string;
  forceType: ForceType;
  title: string;
  department: string;
  postName: string;
  vacanciesCount?: number;
  notificationDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  physicalExamDate?: string;
  officialNotificationUrl: string;
  status: RecruitmentStatus;
  eligibilityAgeMin: number;
  eligibilityAgeMax: number;
  eligibilityQualification: string;
  heightRequirementCm: number;
  chestRequirementCm?: number;
  runningRequirementSummary: string;
}
