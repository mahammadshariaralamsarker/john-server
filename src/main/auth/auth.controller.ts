import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from './dto/create-auth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadToCloudinary } from 'src/util/common/cloudinary/cloudinary';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const updloadedImages = await uploadToCloudinary(images[0]);
    return this.authService.create(createUserDto, updloadedImages?.secure_url);
  }
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
  // @Get('login')
  // redirectToTwitter(@Res() res: Response) {
  //   const url = this.authService.getTwitterAuthUrl();
  //   res.redirect(url);
  // }

  // @Get('callback')
  // async handleCallback(@Query('code') code: string) {
  //   return await this.authService.exchangeCodeForToken(code);
  // }
}
