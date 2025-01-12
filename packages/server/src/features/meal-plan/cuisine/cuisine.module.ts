import { CuisineController } from './cuisine.controller';
import { CuisineEntity } from './cuisine.entity';
import { CuisineService } from './cuisine.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CuisineEntity])],
  controllers: [CuisineController],
  providers: [CuisineService],
})
export class CuisineModule {}
