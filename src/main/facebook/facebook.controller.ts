import { Controller, Get, Query } from '@nestjs/common';
import { FacebookService } from './facebook.service';

@Controller('auth/facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Get()
  getFacebookLoginUrl() {
    return this.facebookService.getFacebookLoginUrl();
  }

  @Get('/callback')
  async handleFacebookCallback(@Query('code') code: string) {
    console.log(code, 'code received from Facebook');
    return this.facebookService.exchangeCodeForToken(code);
  }
}
