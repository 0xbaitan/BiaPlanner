import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuisineEntity } from './cuisine.entity';
import { Repository } from 'typeorm';
import {
  ICreateCuisineDto,
  ICuisine,
  IUpdateCuisineDto,
} from '@biaplanner/shared';

@Injectable()
export class CuisineService {
  constructor(
    @InjectRepository(CuisineEntity)
    private cuisineRepository: Repository<CuisineEntity>,
  ) {}

  async findAll(): Promise<CuisineEntity[]> {
    return this.cuisineRepository.find();
  }

  async findById(id: string): Promise<ICuisine> {
    return this.cuisineRepository.findOneOrFail({
      where: { id },
    });
  }

  async create(dto: ICreateCuisineDto): Promise<ICuisine> {
    const cuisine = this.cuisineRepository.create(dto);
    return this.cuisineRepository.save(cuisine);
  }

  async update(id: string, dto: IUpdateCuisineDto): Promise<ICuisine> {
    const cuisine = await this.findById(id);
    const updatedCuisine = this.cuisineRepository.merge(cuisine, dto);
    return this.cuisineRepository.save(updatedCuisine);
  }

  async delete(id: string): Promise<void> {
    const cuisine = await this.findById(id);
    await this.cuisineRepository.softDelete(cuisine.id);
  }
}
