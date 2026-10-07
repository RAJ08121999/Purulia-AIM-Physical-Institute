import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AIM-API-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security cookies
  app.use(cookieParser());

  // Strict CORS for web client
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  // Root landing response for browser checks
  app.use((req: any, res: any, next: any) => {
    if (req.path === '/' || req.url === '/') {
      return res.json({
        status: 'ok',
        message: 'Purulia Aim Physical Institute (AIM) Backend API is running',
        api: '/api/v1',
        health: '/api/v1/health',
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`AIM Modular API running on http://0.0.0.0:${port}/api/v1`);
}

bootstrap();
