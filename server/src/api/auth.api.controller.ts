import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService, LoginDto } from '../services/auth.service';

@Controller('auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.validateAndLogin(dto);
  }

  @Get('me')
  getProfile() {
    return {
      authenticated: true,
      user: {
        role: 'SUPER_ADMIN',
        name: 'Havaldar Anup Kumar Mahato',
        institution: 'Purulia Aim Physical Institute'
      }
    };
  }
}
