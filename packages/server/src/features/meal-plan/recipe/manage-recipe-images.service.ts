import { FileEntity } from '@/features/files/file.entity';
import { IFile, IRecipe } from '@biaplanner/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { FilesService } from '@/features/files/files.service';
import { RecipeService } from './recipe.service';

@Injectable()
export class ManageRecipeImagesService {
  private static readonly SUBDIR = 'recipe-images';

  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<IRecipe>,
    @Inject(FilesService) private readonly filesService: FilesService,
  ) {}
  public async manageRecipeCoverImage(
    recipeId: string,
    file?: Express.Multer.File,
  ): Promise<IFile | null> {
    const recipe = await this.recipeRepository.findOne({
      where: {
        id: recipeId,
      },
      relations: {
        coverImage: true,
      },
    });
    if (!recipe) {
      throw new BadRequestException('Recipe not found');
    }

    let fileMetaData: IFile | null = null;

    try {
      if (!file && !recipe.coverImage) {
        fileMetaData = null;
      } else if (file && !recipe.coverImage) {
        fileMetaData = await this.filesService.registerNewFile(
          file,
          ManageRecipeImagesService.SUBDIR,
        );
      } else if (file && recipe.coverImage) {
        fileMetaData = await this.filesService.overrideExistingFile(
          recipe.coverImage.id,
          file,
          ManageRecipeImagesService.SUBDIR,
        );
      } else if (!file && recipe.coverImage) {
        await this.filesService.unregisterExistingFile(recipe.coverImage.id);
        fileMetaData = null;
      }
    } catch (error) {
      console.error('Error managing recipe cover image:', error);
      throw new BadRequestException(
        'Error managing recipe cover image' + error.message,
        error.stack,
      );
    }

    if (fileMetaData) {
      await this.recipeRepository
        .createQueryBuilder()
        .relation(RecipeEntity, 'coverImage')
        .of(recipeId)
        .set(fileMetaData.id);
    } else {
      await this.recipeRepository
        .createQueryBuilder()
        .relation(RecipeEntity, 'coverImage')
        .of(recipeId)
        .set(null);
    }

    if (file) {
      this.filesService.deleteFileFromTemp(file);
    }
    return fileMetaData;
  }
}
