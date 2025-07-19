import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import * as qs from 'querystring';
@Injectable()
export class TiktokService {
  private readonly clientKey = 'sbawtbqug63mru0371';
  private readonly clientSecret = 'hsyZepE0fRpcTD4yG6FV4mi7FfqQGsnk';
  private readonly redirectUri =
    'https://7e3ad3e41453.ngrok-free.app/auth/tiktok/callback';
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
    try {
      const accessToken =
        'act.IB5KjgoxsyQShqmVmoHHyp0nmgJD9tmYX2UuDLpEqKY8cAP0FAl3KJUJEiHY!4507.va';

      const videoPath = path.join(
        process.cwd(),
        'public',
        'uploads',
        'video.mp4',
      );

      console.log({ videoPath });
      const videoStat = fs.statSync(videoPath);
      const videoSize = videoStat.size;

      const chunkSize = videoSize;
      const totalChunkCount = Math.ceil(videoSize / chunkSize);
      const payload = {
        post_info: {
          title: 'this will be a funny #cat video on your @tiktok #fyp',
          privacy_level: 'SELF_ONLY',
          brand_content_toggle: false,
          brand_organic_toggle: false,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
          chunk_size: videoSize,
          total_chunk_count: totalChunkCount,
        },
      };

      const response = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/video/init/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('TikTok API error:', error.response.data);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
}
