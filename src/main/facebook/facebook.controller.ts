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

      // Redirect user to frontend with token
      res.redirect(`http://localhost:3001?token=${accessToken}`);
    } catch (error) {
      console.error('Error in Facebook callback:', error);
      res.redirect(`http://localhost:3001?error=auth_failed`);
    }
  }
}
