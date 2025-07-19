import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { HttpModule } from '@nestjs/axios';
import { TikTokController } from './tiktok.controller';

@Module({
  imports: [HttpModule],
  controllers: [TikTokController],
  providers: [TiktokService],
})
export class TiktokModule {}
