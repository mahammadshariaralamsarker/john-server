import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ApiResponse } from 'src/util/common/apiresponse/apiresponse';
@Injectable()
export class AuthService {
  constructor(
    // private http: HttpService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto, image: string) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        image,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ApiResponse.error('You Are Not Registered');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return ApiResponse.error('Your Password is wrong!!');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return ApiResponse.success({
      accessToken: token,
      message: 'User Logged in successfully',
    });
  }
  // getTwitterAuthUrl(): string {
  //   const clientId = process.env.TWITTER_CLIENT_ID;
  //   const redirectUri = process.env.TWITTER_REDIRECT_URI;
  //   const scope = 'tweet.read tweet.write users.read offline.access';

  //   return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=random_state&code_challenge=challenge&code_challenge_method=plain`;
  // }

  // async exchangeCodeForToken(code: string) {
  //   const url = 'https://api.twitter.com/2/oauth2/token';
  //   const body = {
  //     code,
  //     grant_type: 'authorization_code',
  //     client_id: process.env.TWITTER_CLIENT_ID,
  //     redirect_uri: process.env.TWITTER_REDIRECT_URI,
  //     code_verifier: 'challenge',
  //   };

  //   const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  //   const res = await firstValueFrom(
  //     this.http.post(url, qs.stringify(body), { headers }),
  //   );

  //   return res.data;
  // }
}
