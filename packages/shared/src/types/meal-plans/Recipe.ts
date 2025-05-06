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
import { FilterParamsSchema } from "../PaginateExtended";
import { ICuisine } from "./Cuisine";
import { IRecipeTag } from "./RecipeTag";
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

export const WriteRecipeValidationSchema = zfd.formData({
  title: zfd.text(z.string()),
  description: zfd.text(z.string().optional().nullable()),

  ingredients: zfd.repeatable(z.array(zfd.json(WriteRecipeIngredientDtoSchema)).min(1, { message: "At least one ingredient is required" })),

  difficultyLevel: zfd.text(z.string().min(1, { message: "Difficulty level is required" })),

  cuisine: zfd.json(z.object({ id: z.coerce.string().min(1, { message: "Cuisine is required" }) })),

  cookingTime: zfd.json(SegmentedTimeSchema).optional(),
  prepTime: zfd.json(SegmentedTimeSchema).optional(),
  source: zfd.text(z.string().optional().nullable()),
  tags: zfd.repeatable(z.array(zfd.json(z.object({ id: z.coerce.string() }))).min(1, { message: "At least one tag is required" })),

  file: zfd.file(z.instanceof(File).refine((file) => file.size > 0, "File required")).optional(),

  directions: zfd.repeatable(z.array(zfd.json(RecipeDirectionSchema)).min(1, { message: "At least one direction is required" })),
});

export type IWriteRecipeDto = z.infer<typeof WriteRecipeValidationSchema>;

export class WriteRecipeDto extends createZodDto(WriteRecipeValidationSchema) {}

export type WriteRecipeFormattedErrors = z.inferFormattedError<typeof WriteRecipeValidationSchema>;

export const QueryRecipeDtoSchema = FilterParamsSchema.extend({
  allergenIdsExclude: z.array(z.string()).optional(),
  difficultyLevel: z.array(z.string()).optional(),
  recipeTagIds: z.array(z.string()).optional(),
  ownRecipes: z.boolean().optional(),
  favouritesOnly: z.boolean().optional(),
  useWhatIhave: z.boolean().optional(),
  cuisineIds: z.array(z.string()).optional(),
  sortBy: z.nativeEnum(RecipeSortBy).optional(),
});

export type IQueryRecipeDto = z.infer<typeof QueryRecipeDtoSchema>;
