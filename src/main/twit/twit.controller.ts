import { Controller, Post, Body } from '@nestjs/common';
import { TweetService } from './twit.service';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  postTweet(@Body() body: { text: string; accessToken: string }) {
    return this.tweetService.postTweet(body.accessToken, body.text);
  }
}
