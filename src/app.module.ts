import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './main/auth/auth.module';
import { TwitModule } from './main/twit/twit.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiktokModule } from './tiktok/tiktok.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TwitModule,
    HttpModule,
    TiktokModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
