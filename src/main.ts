import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('John Server')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'bearer',
      },
      'access-token',
    )
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  documentFactory.paths = Object.fromEntries(
    Object.entries(documentFactory.paths).map(([path, ops]) => [
      path,
      Object.fromEntries(
        Object.entries(ops).map(([method, op]) => [
          method,
          {
            ...op,
            security: [{ 'access-token': [] }],
          },
        ]),
      ),
    ]),
  );

  SwaggerModule.setup('api', app, documentFactory);
  const filePath = join(
    process.cwd(),
    'public',
    'tiktok-tiktok6uSq1aUWlNCiLUmkkNgl8AYHUo9x0RCW.txt',
  );
  app.useStaticAssets(filePath);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
