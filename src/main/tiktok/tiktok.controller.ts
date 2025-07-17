// auth.controller.ts
import { Controller, Get, Query, Res, Inject } from '@nestjs/common';
import { Response } from 'express';
import { TiktokService } from './tiktok.service';

@Controller('auth/tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TiktokService) {}
  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    console.log('hello');
    const tokenData = await this.tiktokService.getAccessToken(code);
    const userData = await this.tiktokService.getUserInfo(
      tokenData.access_token,
    );
    res.cookie('tiktok_access_token', tokenData, {
      httpOnly: true,
      secure: true, // make false if using localhost in dev
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    return res.redirect('http://localhost:3001');
  }
}
