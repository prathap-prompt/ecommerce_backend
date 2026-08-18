import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all_exception.filter';
import { TransformInterceptor} from './common/interceptors/transform.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws if extra properties are sent
      transform: true, // enables the @Type() decorators you used in ProductQueryDto
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
   const config = new DocumentBuilder()
  .setTitle('E-commerce API')
  .setDescription('Backend API for catalog, cart, and orders')
  .setVersion('1.0')
  .addBearerAuth() // enables the "Authorize" button for JWT tokens
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

  const requestedPort = Number(process.env.PORT) || 3000;
  const port = await startServer(app, requestedPort);
  console.log(`Application is running on: http://localhost:${port}`);
}

async function startServer(app: any, port: number): Promise<number> {
  try {
    await app.listen(port);
    return port;
  } catch (error: any) {
    if (error?.code === 'EADDRINUSE' && port < 4000) {
      console.warn(`Port ${port} is busy, trying ${port + 1}...`);
      return startServer(app, port + 1);
    }
    throw error;
  }
  
}

bootstrap();
