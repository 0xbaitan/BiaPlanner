import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:3000', 'http://app:3000'],
      methods: 'GET, POST, PUT, DELETE',  // Allowed methods
      allowedHeaders: '*'
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
