import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuisineEntity } from './cuisine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CuisineService {
  constructor(
    @InjectRepository(CuisineEntity)
    private cuisineRepository: Repository<CuisineEntity>,
  ) {}

  async findAll(): Promise<CuisineEntity[]> {
    return this.cuisineRepository.find();
  }
}
