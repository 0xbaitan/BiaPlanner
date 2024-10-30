import 'reflect-metadata';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/ormconfig';
import { modules } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    }),

    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
