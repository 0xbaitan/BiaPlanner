import { DifficultyLevels, Time } from "../units";
import { IBaseEntity, IReadEntityDto, ReadEntityDtoSchema } from "../BaseEntity";
import { IFile, ImageTypeExtendedListSchema } from "../File";
import { IRecipeDirection, RecipeDirectionSchema } from "./RecipeDirection";
import { IRecipeIngredient, IWriteRecipeIngredientDto } from "./RecipeIngredient";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Validate } from "class-validator";
import { IsStringArrayConstraint, toBoolean, toNumber, toString, toStringArray, transform, trimString } from "../../util";
import { SegmentedTime, SegmentedTimeSchema } from "../TimeMeasurement";
import { Transform, Type } from "class-transformer";
import { file, zfd } from "zod-form-data";

import { DeepPartial } from "utility-types";
import { ICuisine } from "./Cuisine";
import { IRecipeTag } from "./RecipeTag";
import { PaginateQuery } from "../PaginateExtended";
import { WriteRecipeIngredientDtoSchema } from "./RecipeIngredient";
import { createZodDto } from "nestjs-zod";
import z from "zod";

export interface IRecipe extends IBaseEntity {
  title: string;
  description?: string;
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
  directions?: IRecipeDirection[];
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

export const WriteRecipeValidationSchema = zfd.formData({
  title: zfd.text(z.string()),
  description: zfd.text(z.string().optional().nullable()),

  ingredients: zfd.repeatable(z.array(zfd.json(WriteRecipeIngredientDtoSchema)).min(1, { message: "At least one ingredient is required" })),

  difficultyLevel: zfd.text(z.string()),
  cuisine: zfd.json(z.object({ id: z.coerce.string() })),

  cookingTime: zfd.json(SegmentedTimeSchema).optional().nullable(),
  prepTime: zfd.json(SegmentedTimeSchema).optional().nullable(),

  tags: zfd.repeatable(z.array(zfd.json(z.object({ id: z.coerce.string() }))).min(1, { message: "At least one tag is required" })),

  file: zfd.file(z.instanceof(File).refine((file) => file.size > 0, "File required")).optional(),

  directions: zfd.repeatable(z.array(zfd.json(RecipeDirectionSchema)).min(1, { message: "At least one direction is required" })),
});

export type IWriteRecipeDto = z.infer<typeof WriteRecipeValidationSchema>;

export class WriteRecipeDto extends createZodDto(WriteRecipeValidationSchema) {}

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
