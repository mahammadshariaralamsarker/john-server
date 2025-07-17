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
    console.log(tokenData, userData);
    res.json({ tokenData, userData });
  }
}
