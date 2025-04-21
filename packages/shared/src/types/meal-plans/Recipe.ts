import { DifficultyLevels, Time } from "../units";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, Validate } from "class-validator";

import { DeepPartial } from "utility-types";
import { IBaseEntity } from "../BaseEntity";
import { ICuisine } from "./Cuisine";
import { IRecipeIngredient } from "./RecipeIngredient";
import { IRecipeTag } from "./RecipeTag";
import { IsStringArrayConstraint } from "../../util";
import { PaginateQuery } from "../PaginateExtended";
import { SegmentedTime } from "../TimeMeasurement";
import z from "zod";

export interface IRecipe extends IBaseEntity {
  title: string;
  description?: string;
  instructions: string;
  ingredients: IRecipeIngredient[];
  difficultyLevel: DifficultyLevels;
  cuisineId: string;
  cuisine: ICuisine;
  cookingTime?: SegmentedTime;
  prepTime?: SegmentedTime;
  defaultNumberOfServings?: [number, number];

  notes?: string;
  source?: string;
  tags?: IRecipeTag[];
}

export interface ICreateRecipeDto extends Omit<IRecipe, "id" | "createdAt" | "updatedAt" | "deletedAt" | "ingredients" | "tags" | "cuisine"> {
  ingredients: DeepPartial<IRecipeIngredient>[];
  newTags?: Pick<IRecipeTag, "name">[];
  tags?: Pick<IRecipeTag, "id">[];
}

export interface IUpdateRecipeDto extends Partial<ICreateRecipeDto>, Pick<IRecipe, "id"> {}

export class CreateRecipeDto implements ICreateRecipeDto {
  ingredients: DeepPartial<IRecipeIngredient>[];
  newTags?: Pick<IRecipeTag, "name">[] | undefined;
  tags?: Pick<IRecipeTag, "id">[] | undefined;
  title: string;
  description?: string | undefined;
  instructions: string;
  difficultyLevel: DifficultyLevels;
  cuisineId: string;
  cookingTime: SegmentedTime;
  prepTime: SegmentedTime;

  defaultNumberOfServings?: [number, number];
  notes?: string | undefined;
  source?: string | undefined;
}

export class UpdateRecipeDto implements IUpdateRecipeDto {
  id: string;
  title?: string | undefined;
  description?: string | undefined;
  instructions?: string | undefined;
  difficultyLevel?: DifficultyLevels | undefined;
  cuisineId?: string | undefined;
  ingredients?: DeepPartial<IRecipeIngredient>[] | undefined;
  tags?: Pick<IRecipeTag, "id">[] | undefined;
  newTags?: Pick<IRecipeTag, "name">[] | undefined;
  cookingTime?: SegmentedTime | undefined;
  prepTime?: SegmentedTime | undefined;
  defaultNumberOfServings?: [number, number] | undefined;
  notes?: string | undefined;
  source?: string | undefined;
}

export interface IQueryRecipeDto extends Pick<PaginateQuery, "page" | "limit" | "search"> {
  allergensExclude?: string[];
  difficultyLevel?: string[];
  recipeTags?: string[];
  ownRecipes?: boolean;
  favouritesOnly?: boolean;
  useWhatIhave?: boolean;
  cuisines?: string[];
}

export class QueryRecipeDto implements IQueryRecipeDto {
  @IsOptional()
  @Validate(IsStringArrayConstraint)
  allergensExclude?: string[] | undefined;

  @IsOptional()
  @Validate(IsStringArrayConstraint)
  difficultyLevel?: string[] | undefined;

  @IsOptional()
  @Validate(IsStringArrayConstraint)
  recipeTags?: string[] | undefined;

  @IsOptional()
  @IsBoolean()
  ownRecipes?: boolean | undefined;

  @IsOptional()
  @IsBoolean()
  favouritesOnly?: boolean | undefined;

  @IsOptional()
  @IsBoolean()
  useWhatIhave?: boolean | undefined;
  cuisines?: string[] | undefined;

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  page?: number | undefined;

  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  limit?: number | undefined;

  @IsOptional()
  @IsString()
  search?: string | undefined;
}
