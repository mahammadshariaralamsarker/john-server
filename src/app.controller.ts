import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tiktokp6IiDsjbd96yG7CR65ki9bJ95BdnAthX.txt')
  serveVerification(@Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'tiktok-verification.txt');

    // Set headers to force download
    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="tiktok-verification.txt"',
    });

    return res.sendFile(filePath);
  }
}
