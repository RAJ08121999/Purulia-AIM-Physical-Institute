import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from './db.service';
import { WarCryStoryEntity, WarCryStoryComment, WarCryActivityStats } from '../models';

export interface CreateWarCryDto {
  authorId: string;
  authorName: string;
  authorRole: 'USTAD' | 'CADET';
  authorPhoto?: string;
  authorCadre?: string;
  tag?: string;
  tagLabel?: string;
  caption: string;
  mediaUrl?: string;
  activityStats?: WarCryActivityStats;
  isPermanentHonour?: boolean;
  selectedForce?: string;
  beltNo?: string;
  regimentOrDistrict?: string;
  selectionYear?: string;
  timing1600m?: string;
  villageTown?: string;
}

export interface AddCommentDto {
  authorName: string;
  authorRole?: 'USTAD' | 'CADET' | 'COMMUNITY';
  authorAvatar?: string;
  text: string;
}

export interface VerifyHonourDto {
  approved: boolean;
  remarks?: string;
  verifiedBy?: string;
}

@Injectable()
export class WarCryService {
  constructor(private readonly db: DbService) {}

  getAllStories() {
    return this.db.getWarCryStories();
  }

  getStoryById(id: string) {
    const story = this.db.findWarCryStoryById(id);
    if (!story) {
      throw new NotFoundException(`War Cry story with ID "${id}" not found`);
    }
    return story;
  }

  createStory(dto: CreateWarCryDto) {
    if (!dto.caption || !dto.caption.trim()) {
      throw new BadRequestException('Story caption or War Cry quote is required');
    }
    if (!dto.authorName || !dto.authorName.trim()) {
      throw new BadRequestException('Author name is required');
    }

    const now = Date.now();
    const isHonour = Boolean(dto.isPermanentHonour);

    const newStory: WarCryStoryEntity = {
      id: `warcry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      authorId: dto.authorId || `author-${Date.now()}`,
      authorName: dto.authorName.trim(),
      authorRole: dto.authorRole || 'CADET',
      authorPhoto: dto.authorPhoto || '',
      authorCadre: dto.authorCadre || 'AIM Drill Squad',
      tag: dto.tag || (isHonour ? 'SUCCESS_STORY' : 'WAR_CRY'),
      tagLabel: dto.tagLabel || (isHonour ? '🎖️ Roll of Honour Candidate' : '🔥 Ground War Cry'),
      caption: dto.caption.trim(),
      mediaUrl: dto.mediaUrl || '',
      createdAt: new Date().toISOString(),
      expiresAt: isHonour
        ? new Date(now + 10 * 365 * 24 * 3600 * 1000).toISOString()
        : new Date(now + 24 * 3600 * 1000).toISOString(), // exactly 24 hours
      likesCount: 0,
      likedBy: [],
      comments: [],
      isPermanentHonour: false,
      honourStatus: isHonour ? 'PENDING' : 'NONE',
      selectedForce: dto.selectedForce || '',
      beltNo: dto.beltNo || '',
      regimentOrDistrict: dto.regimentOrDistrict || '',
      selectionYear: dto.selectionYear || new Date().getFullYear().toString(),
      timing1600m: dto.timing1600m || '',
      villageTown: dto.villageTown || '',
      activityStats: dto.activityStats
    };

    const saved = this.db.createWarCryStory(newStory);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: isHonour ? 'HONOUR_STORY_SUBMITTED' : 'WAR_CRY_STORY_POSTED',
      entity: 'WarCryStory',
      entityId: saved.id,
      details: `${saved.authorName} (${saved.authorRole}) posted ${saved.tagLabel}: "${saved.caption.slice(0, 50)}..."`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: isHonour
        ? 'Success story submitted for Ustad verification and Roll of Honour induction!'
        : 'War Cry story broadcasted live for 24 hours!',
      story: saved
    };
  }

  toggleLike(id: string, clientToken?: string) {
    const updated = this.db.likeWarCryStory(id, clientToken);
    if (!updated) {
      throw new NotFoundException(`War Cry story "${id}" not found`);
    }
    return {
      success: true,
      likesCount: updated.likesCount,
      likedBy: updated.likedBy
    };
  }

  addComment(id: string, dto: AddCommentDto) {
    if (!dto.text || !dto.text.trim()) {
      throw new BadRequestException('Comment text cannot be empty');
    }
    if (!dto.authorName || !dto.authorName.trim()) {
      throw new BadRequestException('Author name required for regimental comments');
    }

    const comment: WarCryStoryComment = {
      id: `comm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      authorName: dto.authorName.trim(),
      authorRole: dto.authorRole || 'CADET',
      authorAvatar: dto.authorAvatar || '',
      text: dto.text.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = this.db.addWarCryComment(id, comment);
    if (!updated) {
      throw new NotFoundException(`War Cry story "${id}" not found`);
    }

    return {
      success: true,
      comment,
      totalComments: updated.comments.length
    };
  }

  getPendingHonourQueue() {
    return this.db.getPendingHonourStories();
  }

  verifyHonourStory(id: string, dto: VerifyHonourDto) {
    const updated = this.db.verifyHonourStory(
      id,
      dto.approved,
      dto.remarks,
      dto.verifiedBy || 'Havaldar Anup Kumar Mahato'
    );
    if (!updated) {
      throw new NotFoundException(`Honour story "${id}" not found`);
    }

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: dto.approved ? 'HONOUR_STORY_APPROVED' : 'HONOUR_STORY_REJECTED',
      entity: 'WarCryStory',
      entityId: id,
      details: `Ustad verified success story of ${updated.authorName}. Status: ${updated.honourStatus}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: dto.approved
        ? `Verified! Cadet ${updated.authorName} is now permanently inducted into the Roll of Honour.`
        : `Story reviewed and rejected with remarks: ${dto.remarks || 'None'}`,
      story: updated
    };
  }

  getApprovedHonourList() {
    return this.db.getApprovedHonourStories();
  }
}
