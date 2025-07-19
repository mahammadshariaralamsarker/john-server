import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ApiResponse } from 'src/util/common/apiresponse/apiresponse';
import { RequestOtpDto } from './dto/requestOtp.dto';
import { MailService } from 'src/util/common/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto'
import { VerifyOtpDto } from './dto/verify-otp.dto';
@Injectable()
export class AuthService {
  constructor(
    // private http: HttpService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
    return ApiResponse.success(token, 'User Logged in successfully');
  }


  async requestOtp(email:string) {
    const user = await this.prisma.user.findUnique({ where: { email} });
    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const hashedOtp = (crypto as any).createHash ('sha256').update(otp).digest('hex');

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otp.create({
      data: {
        userId: user.id,
        otp: hashedOtp,
        expiresAt,
      },
    });

    await this.mailService.sendMail(user.email, otp);

    return ApiResponse.success(null, 'OTP sent successfully');
  }

   async verifyOtp(dto: VerifyOtpDto) {
     const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const hashedOtp = crypto.createHash('sha256').update(dto.otp).digest('hex');

    const otpEntry = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        otp: hashedOtp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpEntry) throw new BadRequestException('Invalid or expired OTP');

    return ApiResponse.success(null, 'OTP verified successfully');
  }

   async resetPassword(dto: ResetPasswordDto) {
     const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    // const hashedOtp = crypto.createHash('sha256').update(dto.otp).digest('hex');

    const otpEntry = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        // otp: hashedOtp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpEntry) throw new BadRequestException('Invalid or expired OTP');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });
  
    await this.prisma.otp.delete({
      where: { id: otpEntry.id },
    });

    return ApiResponse.success(null, 'Password reset successfully');
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
