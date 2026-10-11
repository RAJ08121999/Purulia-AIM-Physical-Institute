import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { AuthService, LoginDto, RegisterTrainerDto } from '../services/auth.service';

@Controller('auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.validateAndLogin(dto);
  }

  @Post('register-trainer')
  registerTrainer(@Body() dto: RegisterTrainerDto) {
    return this.authService.registerTrainer(dto);
  }

  @Get('trainer-profile')
  getChiefTrainer() {
    return this.authService.getChiefInstructorProfile();
  }

  @Patch('trainer-profile')
  updateTrainer(@Body() dto: any) {
    return this.authService.updateTrainerProfile(dto);
  }

  @Get('me')
  getProfile() {
    return {
      authenticated: true,
      message: 'AIM Tactical Authentication System operational'
    };
  }
}
