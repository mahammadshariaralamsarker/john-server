import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './main/auth/auth.module';
import { TwitModule } from './main/twit/twit.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from './main/facebook/facebook.module';
import { TiktokModule } from './main/tiktok/tiktok.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TwitModule,
    HttpModule,
    FacebookModule,
    TiktokModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
