import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';

@Injectable()
export class TiktokService {
  private readonly clientKey = 'sbawtbqug63mru0371';
  private readonly clientSecret = 'hsyZepE0fRpcTD4yG6FV4mi7FfqQGsnk';
  private readonly redirectUri =
    'https://c8d2bd9b655e.ngrok-free.app/auth/tiktok/callback';

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

  // Get User Information from tiktok account
  // async getUserInfo(accessToken: string) {
  //   try {
  //     const res = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     return res.data;
  //   } catch (err) {
  //     throw new HttpException(
  //       err.response?.data || 'Failed to fetch user info',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // post a video on the tiktok

  async publishPost(
    video: Express.Multer.File,
    description: string,
    accessToken: string,
  ) {
    console.log({ video, description, accessToken });

    // const post_info = {
    //   title: 'this will be a funny #cat video on your @tiktok #fyp',
    //   privacy_level: 'MUTUAL_FOLLOW_FRIENDS',
    //   disable_duet: false,
    //   disable_comment: true,
    //   disable_stitch: false,
    //   video_cover_timestamp_ms: 1000,
    // };
    // const source_info = {
    //   source: 'FILE_UPLOAD',
    //   video_size: 50000123,
    //   chunk_size: 10000000,
    //   total_chunk_count: 5,
    // };
    try {
      const initResponse = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/video/init/',
        {
          post_info: {
            title: 'this is a #cat video',
            privacy_level: 'PUBLIC',
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: 50000123,
            chunk_size: 10000000,
            total_chunk_count: 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${'act.IB5KjgoxsyQShqmVmoHHyp0nmgJD9tmYX2UuDLpEqKY8cAP0FAl3KJUJEiHY!4507.va'}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log({ initResponse });
      // const form = new FormData();
      // form.append('video', video.buffer, {
      //   filename: video.originalname,
      //   contentType: video.mimetype,
      // });
      // form.append('description', description);
      // const response = await axios.post(
      //   'https://open.tiktokapis.com/v2/post/publish/',
      //   form,
      //   {
      //     headers: {
      //       ...form.getHeaders(),
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //     maxContentLength: Infinity,
      //     maxBodyLength: Infinity,
      //   },
      // );
      // return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'TikTok upload failed',
        error.response?.status || 500,
      );
    }
  }
}
