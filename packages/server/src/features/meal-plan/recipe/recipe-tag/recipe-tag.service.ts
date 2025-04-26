import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTagEntity } from './recipe-tag.entity';
import { Repository } from 'typeorm';
import { IRecipeTag, IWriteRecipeTagDto } from '@biaplanner/shared';

@Injectable()
export class RecipeTagService {
  constructor(
    @InjectRepository(RecipeTagEntity)
    private recipeTagRepository: Repository<RecipeTagEntity>,
  ) {}

  async findAll(): Promise<IRecipeTag[]> {
    return this.recipeTagRepository.find();
  }

  async findOne(id: string): Promise<IRecipeTag> {
    return this.recipeTagRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        recipes: true,
      },
    });
  }

  async create(dto: IWriteRecipeTagDto): Promise<IRecipeTag> {
    const recipeTag = this.recipeTagRepository.create(dto);
    return this.recipeTagRepository.save(recipeTag);
  }

  async update(id: string, dto: IWriteRecipeTagDto): Promise<IRecipeTag> {
    const result = await this.recipeTagRepository.update(id, dto);
    if (!result.affected) {
      throw new BadRequestException('Recipe tag not found');
    }
    const recipeTag = await this.findOne(id);
    return recipeTag;
  }

  async delete(id: string): Promise<void> {
    await this.recipeTagRepository.softDelete(id);
  }
}
