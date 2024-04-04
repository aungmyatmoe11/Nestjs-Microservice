import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from './users/schemas/user.schema';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Get('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user
  }
}
