import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { TiktokService } from './tiktok.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('auth/tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TiktokService) {}
  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokenResponse = await this.tiktokService.getAccessToken(code);
      const redirectUrl = `http://localhost:3001/?accessToken=${tokenResponse.access_token}&refreshToken=${tokenResponse.refresh_token}`;

      const accessToken = tokenResponse.access_token;
      const userInfo = await this.tiktokService.getUserInfo(accessToken);
      console.log(userInfo);
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
    }
  }

  // @Post('publish')
  // @UseInterceptors(FileInterceptor('video'))
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Direct post to TikTok with video file' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       video: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //       description: {
  //         type: 'string',
  //         example: 'this is demo description',
  //       },
  //       accessToken: {
  //         type: 'string',
  //         example:
  //           'act.IB5KjgoxsyQShqmVmoHHyp0nmgJD9tmYX2UuDLpEqKY8cAP0FAl3KJUJEiHY!4507.va',
  //       },
  //     },
  //   },
  // })
  @Get('initVideo')
  @ApiOperation({ summary: 'Initialize TikTok Video Upload' })
  async initVideo() {
    const videoInitResponse = await this.tiktokService.videoInit();
    console.log(videoInitResponse);
  }
}
