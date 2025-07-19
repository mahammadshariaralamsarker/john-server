import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'saifulislam106915@gmail.com',
    description: 'The email address used to receive the OTP',
  })
  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The 6-digit OTP sent to the user email',
  })
  @IsNotEmpty({ message: 'OTP is required' })
  @IsString({ message: 'OTP must be a string' })
  otp: string;
}
