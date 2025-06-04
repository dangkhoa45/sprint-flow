import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import { AppModule } from './app.module';

const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:8005',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(
    session({
      secret: process.env.APP_SECRET ?? '',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600,
      }),
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('RESTful APIs build with NestJS for Car Store System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(8005);
}

bootstrap();
