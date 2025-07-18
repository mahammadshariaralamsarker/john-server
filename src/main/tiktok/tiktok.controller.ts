import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { TiktokService } from './tiktok.service';

@Controller('auth/tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const tokenResponse = await this.tiktokService.getAccessToken(code);

      const redirectUrl = `http://localhost:3001/?accessToken=${tokenResponse.access_token}&refreshToken=${tokenResponse.refresh_token}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
    }
  }
}
