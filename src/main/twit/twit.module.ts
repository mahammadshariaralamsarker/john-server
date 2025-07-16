import { Module } from '@nestjs/common';
import { TweetController } from './twit.controller';
import { TweetService } from './twit.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TwitModule {}
