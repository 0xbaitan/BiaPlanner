import { DifficultyLevels, Time } from "../units";
import { IBaseEntity, IReadEntityDto, ReadEntityDtoSchema } from "../BaseEntity";
import { IRecipeIngredient, IWriteRecipeIngredientDto } from "./RecipeIngredient";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Validate } from "class-validator";
import { IsStringArrayConstraint, toBoolean, toNumber, toString, toStringArray, transform, trimString } from "../../util";
import { SegmentedTime, SegmentedTimeSchema } from "../TimeMeasurement";
import { Transform, Type } from "class-transformer";

import { DeepPartial } from "utility-types";
import { ICuisine } from "./Cuisine";
import { IFile } from "../File";
import { IRecipeTag } from "./RecipeTag";
import { PaginateQuery } from "../PaginateExtended";
import { WriteRecipeIngredientDtoSchema } from "./RecipeIngredient";
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
  coverImage?: IFile;
  coverImageId?: string;
  notes?: string;
  source?: string;
  tags?: IRecipeTag[];
}

export enum RecipeSortBy {
  RECIPE_TITLE_A_TO_Z = "RECIPE_TITLE_A_TO_Z",
  RECIPE_TITLE_Z_TO_A = "RECIPE_TITLE_Z_TO_A",
  RECIPE_MOST_TIME_CONSUMING = "RECIPE_MOST_TIME_CONSUMING",
  RECIPE_LEAST_TIME_CONSUMING = "RECIPE_LEAST_TIME_CONSUMING",
  RECIPE_INCREASING_DIFFICULTY_LEVEL = "RECIPE_INCREASING_DIFFICULTY_LEVEL",
  RECIPE_DECREASING_DIFFICULTY_LEVEL = "RECIPE_DECREASING_DIFFICULTY_LEVEL",
  RECIPE_MOST_RELEVANT_TO_PANTRY = "RECIPE_MOST_RELEVANT_TO_PANTRY",
  DEFAULT = "DEFAULT",
}

export interface IQueryRecipeDto extends Pick<PaginateQuery, "page" | "limit" | "search"> {
  allergenIdsExclude?: string[];
  difficultyLevel?: string[];
  recipeTagIds?: string[];
  ownRecipes?: boolean;
  favouritesOnly?: boolean;
  useWhatIhave?: boolean;
  cuisineIds?: string[];
  sortBy?: RecipeSortBy;
}

export const WriteRecipeValidationSchema = z.object({
  title: z.string({
    required_error: "Recipe title is required",
    invalid_type_error: "Recipe title must be composed of characters",
  }),
  description: z.string().optional(),
  instructions: z.string({
    required_error: "Recipe instructions are required",
    invalid_type_error: "Recipe instructions must be composed of characters",
  }),
  ingredients: z.array(WriteRecipeIngredientDtoSchema).min(1, {
    message: "Recipe must have at least one ingredient",
  }),
  difficultyLevel: z.nativeEnum(DifficultyLevels).optional(),
  cuisine: ReadEntityDtoSchema.required(),
  cookingTime: SegmentedTimeSchema.optional(),
  prepTime: SegmentedTimeSchema.optional(),
  tags: z
    .array(ReadEntityDtoSchema, {
      required_error: "Recipe tags are required",
    })
    .min(1, {
      message: "Recipe must have at least one tag",
    }),
  fileId: z.string().optional(),
});

export type IWriteRecipeDto = z.infer<typeof WriteRecipeValidationSchema>;

export class WriteRecipeDto implements IWriteRecipeDto {
  title: string;
  description?: string;
  instructions: string;
  ingredients: IWriteRecipeIngredientDto[];
  difficultyLevel: DifficultyLevels;
  cuisine: IReadEntityDto;
  cookingTime?: SegmentedTime;
  prepTime?: SegmentedTime;
  tags: IReadEntityDto[];
  fileId?: string;
}

export type WriteRecipeFormattedErrors = z.inferFormattedError<typeof WriteRecipeValidationSchema>;

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

  @Transform((params) => transform(params, toString))
  @IsOptional()
  @IsEnum(RecipeSortBy)
  sortBy?: RecipeSortBy | undefined;
}
