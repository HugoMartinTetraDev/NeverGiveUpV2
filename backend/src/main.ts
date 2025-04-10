import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AppLoggerService } from './common/services';

// Gestionnaire global des erreurs non captées
const globalLogger = new AppLoggerService('GlobalErrorHandler', { 
  logToFile: true,
  logLevels: ['error', 'warn', 'log']
});

process.on('unhandledRejection', (reason, promise) => {
  globalLogger.error(`Rejet de promesse non géré: ${reason}`, undefined, 'UnhandledRejection');
  // Ne pas terminer le processus pour garder l'application en vie
});

process.on('uncaughtException', (error) => {
  globalLogger.error(`Exception non captée: ${error.message}`, error.stack, 'UncaughtException');
  // Ne pas terminer le processus en production pour maintenir le service
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

async function bootstrap() {
  try {
    // Créer un service de journalisation personnalisé
    const logger = new AppLoggerService('NestApplication', { 
      logToFile: true,
      logLevels: ['error', 'warn', 'log']
    });
    
    // Utiliser le logger personnalisé lors de la création de l'application
    const app = await NestFactory.create(AppModule, {
      logger: logger
    });
    
    // Global exception filter avec notre logger
    app.useGlobalFilters(new GlobalExceptionFilter());
    
    // Global timeout interceptor (30 secondes)
    app.useGlobalInterceptors(new TimeoutInterceptor(30000));
    
    // Enable validation pipe for all routes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, 
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Enable CORS with specific options
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      exposedHeaders: ['X-Total-Count']
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('PopEat API')
      .setDescription('API for food delivery platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Start the server with port availability check
    const port = process.env.PORT || 3000;
    try {
      await app.listen(port);
      console.log(`Application is running on: ${await app.getUrl()}`);
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
        process.exit(1);
      }
      throw err;
    }
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}
bootstrap();
