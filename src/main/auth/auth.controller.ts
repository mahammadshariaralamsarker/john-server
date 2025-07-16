import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth/twitter')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  redirectToTwitter(@Res() res: Response) {
    const url = this.authService.getTwitterAuthUrl();
    res.redirect(url);
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    return await this.authService.exchangeCodeForToken(code);
  }
}
