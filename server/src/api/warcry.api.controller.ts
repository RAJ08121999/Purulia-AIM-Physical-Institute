import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import {
  WarCryService,
  CreateWarCryDto,
  AddCommentDto,
  VerifyHonourDto
} from '../services/warcry.service';

@Controller('warcry')
export class WarCryApiController {
  constructor(private readonly warCryService: WarCryService) {}

  // 1. Get all active 24h War Cry stories & approved honour inductees (Public access)
  @Get('stories')
  getAllStories() {
    return this.warCryService.getAllStories();
  }

  // 2. Get specific story
  @Get('stories/:id')
  getStoryById(@Param('id') id: string) {
    return this.warCryService.getStoryById(id);
  }

  // 3. Post a new War Cry story (Cadets & Ustads)
  @Post('stories')
  createStory(@Body() dto: CreateWarCryDto) {
    return this.warCryService.createStory(dto);
  }

  // 4. Like / Salute a story (Anyone, including unregistered public visitors!)
  @Post('stories/:id/like')
  toggleLike(@Param('id') id: string, @Body('clientToken') clientToken?: string) {
    return this.warCryService.toggleLike(id, clientToken);
  }

  // 5. Comment on a story (Registered cadets & ustads)
  @Post('stories/:id/comment')
  addComment(@Param('id') id: string, @Body() dto: AddCommentDto) {
    return this.warCryService.addComment(id, dto);
  }

  // 6. Cadet/Ustad submits permanent success story for Roll of Honour induction
  @Post('honour/submit')
  submitHonourStory(@Body() dto: CreateWarCryDto) {
    return this.warCryService.createStory({
      ...dto,
      isPermanentHonour: true
    });
  }

  // 7. Ustad views pending success stories in verification queue
  @Get('honour/pending')
  getPendingHonourQueue() {
    return this.warCryService.getPendingHonourQueue();
  }

  // 8. Ustad verifies/approves story for permanent Roll of Honour inclusion
  @Patch('honour/:id/verify')
  verifyHonourStory(@Param('id') id: string, @Body() dto: VerifyHonourDto) {
    return this.warCryService.verifyHonourStory(id, dto);
  }

  // 9. Public gets all verified Roll of Honour stories
  @Get('honour')
  getApprovedHonourList() {
    return this.warCryService.getApprovedHonourList();
  }
}
