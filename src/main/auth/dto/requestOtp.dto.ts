import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RequestOtpDto {
  @ApiProperty({
    example: 'saifulislam106915@gmail.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;
}
