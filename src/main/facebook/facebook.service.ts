import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookService {
  constructor(private readonly httpService: HttpService) {}

  getFacebookLoginUrl() {
    const clientId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FB_REDIRECT_URI;
    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement`;

    return url;
  }

  async exchangeCodeForToken(code: string) {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FB_REDIRECT_URI;
    const url = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

    const response = await lastValueFrom(
      this.httpService.get<{ access_token: string }>(url),
    );
    const accessToken = response.data.access_token;

    // TODO: Store access token in DB (associated with user or page)

    return { accessToken };
  }
}

// https://4a7d20c4df90.ngrok-free.app/auth/facebook/callback?code=AQDrjkts-UCWQ5jRLq7Pt5FnZ5Qc4yNIM2TRBCUr4emSbN0XB15YwxAr5LwWWBxpln5CkzodSjqyIO5Cpk9DbrzpRqZUwQ9w2fRegbZF5bu9S8NL_L04sqXx5D5ktx84cOJBZxTAPoPoNI3VK893M2505DEMivIthO2kVOF_TAG7oh75GXbJIdUxoLu4n2hpOLPpXRWOKD-XqaYKXWlWez4yo7jcEY25ee9ZPfxb0gbHl9YQsHCbHbggzNz1YPFcUqKdYkN83T7kgzXvdLARamFF38YebFSylWdFvBzLhWM6O8Q3rJ6alRrJ4DS93fd9k1AUfMWzPSjkWnLYAgnA2EsOUz-YDHOuhVW0pbDDmMV0Sl6NQeaP7uwD6BW-X-_hyag#_=_
