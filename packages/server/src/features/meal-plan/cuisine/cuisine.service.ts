import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CuisineEntity } from './cuisine.entity';
import { Repository } from 'typeorm';
import { ICuisine, IWriteCuisineDto } from '@biaplanner/shared';

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

  async create(dto: IWriteCuisineDto): Promise<ICuisine> {
    const cuisine = this.cuisineRepository.create(dto);
    return this.cuisineRepository.save(cuisine);
  }

  async update(id: string, dto: IWriteCuisineDto): Promise<ICuisine> {
    const cuisine = await this.cuisineRepository.update(id, dto);
    if (!cuisine.affected) {
      new BadRequestException('Cuisine not found');
    }
    return this.cuisineRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    const cuisine = await this.findById(id);
    await this.cuisineRepository.softDelete(cuisine.id);
  }
}
