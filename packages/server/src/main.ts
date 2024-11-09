import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { AuthenticationExceptionFilter } from './features/errors/authentication-error.filter';
import { AuthenticationService } from './features/user-info/authentication/authentication.service';
import { JwtGuard } from './features/user-info/authentication/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ValidationExceptionFilter } from './features/errors/validation-error.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://app:3000'],
    methods: 'GET, POST, PUT, DELETE', // Allowed methods
    allowedHeaders: '*',
    credentials: true,
  });
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      excludeExtraneousValues: false,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new AuthenticationExceptionFilter(),
  );
  app.useGlobalGuards(new JwtGuard(app.get(AuthenticationService), reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
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
