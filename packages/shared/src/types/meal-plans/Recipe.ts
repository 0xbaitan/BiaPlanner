import { DifficultyLevels, Time } from "../units";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, IsString, Validate } from "class-validator";
import { IsStringArrayConstraint, toBoolean, toNumber, toString, toStringArray, transform, trimString } from "../../util";
import { Transform, Type } from "class-transformer";

import { DeepPartial } from "utility-types";
import { IBaseEntity } from "../BaseEntity";
import { ICuisine } from "./Cuisine";
import { IRecipeIngredient } from "./RecipeIngredient";
import { IRecipeTag } from "./RecipeTag";
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
  allergenIdsExclude?: string[];
  difficultyLevel?: string[];
  recipeTagIds?: string[];
  ownRecipes?: boolean;
  favouritesOnly?: boolean;
  useWhatIhave?: boolean;
  cuisineIds?: string[];
}

export class QueryRecipeDto implements IQueryRecipeDto {
  @Transform((params) => transform(params, toStringArray))
  @IsOptional()
  @Validate(IsStringArrayConstraint)
  allergenIdsExclude?: string[] | undefined;
  @Transform((params) => transform(params, toStringArray))
  @IsOptional()
  @Validate(IsStringArrayConstraint)
  difficultyLevel?: string[] | undefined;

  @Transform((params) => transform(params, toStringArray))
  @IsOptional()
  @Validate(IsStringArrayConstraint)
  recipeTagIds?: string[] | undefined;

  @Transform((params) => transform(params, toBoolean))
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  ownRecipes?: boolean | undefined;

  @Transform((params) => transform(params, toBoolean))
  @IsOptional()
  @IsBoolean()
  favouritesOnly?: boolean | undefined;

  @Transform((params) => transform(params, toBoolean))
  @IsOptional()
  @IsBoolean()
  useWhatIhave?: boolean | undefined;

  @Transform((params) => transform(params, toStringArray))
  @IsOptional()
  @Validate(IsStringArrayConstraint)
  @Type(() => String)
  cuisineIds?: string[] | undefined;

  @Transform((params) => transform(params, toNumber))
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  page?: number | undefined;

  @Transform((params) => transform(params, toNumber))
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  limit?: number | undefined;

  @Transform((params) => trimString(transform(params, toString)))
  @IsOptional()
  @IsString()
  search?: string | undefined;
}
