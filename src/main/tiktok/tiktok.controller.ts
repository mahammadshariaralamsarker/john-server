import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TiktokService } from './tiktok.service';

@Controller('auth/tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const tokenResponse = await this.tiktokService.getAccessToken(code);

      res.cookie('tiktok_access_token', tokenResponse.access_token, {
        httpOnly: true,
        secure: true,
      });

      await this.tiktokService.getUserInfo(tokenResponse.access_token);

      // res.cookie('tiktok_access_token', data.access_token, {
      //   httpOnly: true,
      //   secure: true,
      // });

      // Optionally: redirect to frontend with user info
      res.redirect(`http://localhost:3001`);
    } catch (err) {
      console.error(err);
      throw new HttpException('Callback failed', HttpStatus.BAD_REQUEST);
    }
  }
}
