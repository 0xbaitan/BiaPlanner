import 'reflect-metadata';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/ormconfig';
import { modules } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      keepConnectionAlive: true,
      logging: true,
      logger: 'simple-console',
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      cleanupAfterFailedHandle: true,
      cleanupAfterSuccessHandle: true,
      fileSystemStoragePath: 'uploads/',
    }),

    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
