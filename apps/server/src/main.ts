import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import MongoStore from 'connect-mongo';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:8000',
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
  app.use(
    '/uploads/attachments',
    express.static(path.join(__dirname, 'uploads', 'attachments')),
  );

  const config = new DocumentBuilder()
    .setTitle('SprintFlow API')
    .setDescription(
      `
      RESTful APIs for SprintFlow Project Management System
      
      **Testing Headers:**
      - For authentication endpoints, you can use these headers:
        - x-user-agent: Browser user agent (auto-filled)
        - x-forwarded-for: Client IP address (auto-filled)
      
      **Authentication:**
      - Login to get access token
      - Use Bearer token for protected endpoints
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:8005', 'Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SprintFlow API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #1976d2; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 4px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });

  await app.listen(8005);
}

bootstrap().catch(err => {
  console.error('Error bootstrapping application:', err);
  process.exit(1);
});
