import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { TikTokController } from './tiktok.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TikTokController],
  providers: [TiktokService],
})
export class TiktokModule {}
