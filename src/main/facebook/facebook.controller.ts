import { Controller, Get, Query, Res } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { Response } from 'express';

@Controller('auth/facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Get()
  getFacebookLoginUrl() {
    return this.facebookService.getFacebookLoginUrl();
  }

  @Get('/callback')
  async handleFacebookCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    try {
      const { accessToken } =
        await this.facebookService.exchangeCodeForToken(code);

      res
        .cookie('facebookToken', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .redirect(`http://localhost:3001`);
    } catch (error) {
      console.error('Error in Facebook callback:', error);
      res.redirect(`http://localhost:3001?error=auth_failed`);
    }
  }
}
