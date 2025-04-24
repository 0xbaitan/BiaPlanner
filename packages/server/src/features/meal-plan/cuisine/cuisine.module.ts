import { CuisineController } from './cuisine.controller';
import { CuisineEntity } from './cuisine.entity';
import { CuisineService } from './cuisine.service';
import { Module } from '@nestjs/common';
import { QueryCuisineController } from './query-cuisine.controller';
import { QueryCuisineService } from './query-cuisine.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CuisineEntity])],
  controllers: [CuisineController, QueryCuisineController],
  providers: [CuisineService, QueryCuisineService],
})
export class CuisineModule {}
