import { Controller, Post, Body, Get } from '@nestjs/common';
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

  @Get('me')
  getProfile() {
    return {
      authenticated: true,
      message: 'AIM Tactical Authentication System operational'
    };
  }
}
