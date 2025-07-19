import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';
import * as FormData from 'form-data';
import { Readable } from 'stream';
@Injectable()
export class TiktokService {
  private readonly clientKey = 'sbawtbqug63mru0371';
  private readonly clientSecret = 'hsyZepE0fRpcTD4yG6FV4mi7FfqQGsnk';
  private readonly redirectUri =
    'https://c8d2bd9b655e.ngrok-free.app/auth/tiktok/callback';
  private readonly accessToken =
    'rft.xLvaKH5Vs9j7mvmhKrFt3mM1gJCsQEG6sO9DBCfKNB2IAYxl7ZR8P3lQ7eg5!4525.va';
  async getAccessToken(code: string) {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';
    const body = qs.stringify({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });
    try {
      const res = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  // post a video on the tiktok

  async getUserInfo(accessToken: string) {
    const url =
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name';

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch TikTok user info',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async videoInit() {
    const payload = {
      post_info: {
        title: 'This is a test video #tiktok',
        privacy_level: 'PUBLIC',
        disable_duet: false,
        disable_comment: true,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: 50000123,
        chunk_size: 10000000,
        total_chunk_count: 1,
      },
    };

    try {
      const response = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/video/init/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
