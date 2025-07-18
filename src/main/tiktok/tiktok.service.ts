import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';

@Injectable()
export class TiktokService {
  private readonly clientKey = 'sbawtbqug63mru0371';
  private readonly clientSecret = 'hsyZepE0fRpcTD4yG6FV4mi7FfqQGsnk';
  private readonly redirectUri =
    'https://c4b64c54c504.ngrok-free.app/auth/tiktok/callback';

  async getAccessToken(code: string) {
    const url = 'https://open.tiktokapis.com/v2/oauth/token';
    // console.log(code, 'code');
    const body = qs.stringify({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      // code_verifier: codeVerifier,
    });

    try {
      const res = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log(res);

      return res.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Failed to get access token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const res = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Failed to fetch user info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
