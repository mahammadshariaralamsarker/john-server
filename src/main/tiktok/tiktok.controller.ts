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
      const codeVerifier = req.query.code_verifier as string;
      if (!codeVerifier) {
        return res.status(400).send('Missing code_verifier');
      }

      const tokenResponse = await this.tiktokService.getAccessToken(
        code,
        codeVerifier,
      );

      res.cookie('tiktok_access_token', tokenResponse.access_token, {
        httpOnly: true,
        secure: true,
      });

      const userInfo = await this.tiktokService.getUserInfo(
        tokenResponse.access_token,
      );

      return res.status(200).json({ user: userInfo });
    } catch (err) {
      console.error(err);
      throw new HttpException('Callback failed', HttpStatus.BAD_REQUEST);
    }
  }
}
