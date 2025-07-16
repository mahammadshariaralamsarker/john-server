import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TweetService {
  constructor(private http: HttpService) {}

  async postTweet(token: string, text: string) {
    const url = 'https://api.twitter.com/2/tweets';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = { text };

    const res = await firstValueFrom(this.http.post(url, body, { headers }));
    return res.data;
  }
}
