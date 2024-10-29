import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://app:3000'],
    methods: 'GET, POST, PUT, DELETE', // Allowed methods
    allowedHeaders: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });
        return new HttpException(result, HttpStatus.BAD_REQUEST);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
