import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TiktokService } from './tiktok.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { UploadTiktokVideoDto } from './dto/create-tiktok.dto';

@Controller('auth/tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TiktokService) {}
  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokenResponse = await this.tiktokService.getAccessToken(code);
      console.log(tokenResponse);
      const redirectUrl = `http://localhost:3001/?accessToken=${tokenResponse.access_token}&refreshToken=${tokenResponse.refresh_token}`;
      const accessToken = tokenResponse.access_token;
      const userInfo = await this.tiktokService.getUserInfo(accessToken);
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
    }
  }

  @Post('publish')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './public/uploads',
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload video to TikTok' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadTiktokVideoDto })
  async publishVideo(
    @UploadedFile() video: Express.Multer.File,
    @Body() body: UploadTiktokVideoDto,
  ) {
    if (!video || !video.filename) {
      throw new BadRequestException('No video file uploaded.');
    }

    return this.tiktokService.videoInit(video.filename, body.accessToken);
  }
}
