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

// https://www.tiktok.com/v2/auth/authorize?client_key=sbawtbqug63mru0371&response_type=code&scope=user.info.basic,video.upload,video.list&redirect_uri=https%3A%2F%2Fjohn-server.onrender.com%2Fauth%2Ftiktok%2Fcallback&state=3bef09e4-bef5-44af-b4ec-a593d156ef88&code_challenge=qu_JuXSkR3_7fHpKIUbQ85dY7eHW6b5fZkfBKCIbQDk&code_challenge_method=S256&error=invalid_scope&error_type=scope
