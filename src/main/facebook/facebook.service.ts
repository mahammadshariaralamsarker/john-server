import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookService {
  constructor(private readonly httpService: HttpService) {}

  getFacebookLoginUrl() {
    const clientId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FB_REDIRECT_URI;
    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,business_management,pages_manage_posts,pages_manage_engagement,pages_read_engagement,pages_manage_metadata,pages_read_user_content`;

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

  // postToPage(post: string, pageId: string, accessToken: string) {
  //   console.log(post);
  // }
}
