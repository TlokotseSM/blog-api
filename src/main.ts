import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'], // Cleaner logs
    bufferLogs: true, // Prevents log interruption during startup
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const environment = configService.get<string>('NODE_ENV') || 'development';

  // Global validation pipe (for class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
    })
  );

  // API prefix (optional)
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Swagger configuration
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Blog API')
      .setDescription('Complete blog post API with authentication')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Keep JWT between refreshes
      },
    });
  }

  await app.listen(port);

  const logger = new Logger('Main');
  logger.log(`🚀 Application running in ${environment} mode`);
  logger.log(`👉 REST API: http://localhost:${port}/api/v1`);
  logger.log(`📄 Swagger: http://localhost:${port}/api-docs`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Main');
  logger.error('Failed to start application', err.stack);
  process.exit(1);
});