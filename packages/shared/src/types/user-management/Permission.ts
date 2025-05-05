import { z } from "zod";

export interface IPermission {
  viewItem: boolean;
  editItem: boolean;
  deleteItem: boolean;
  createItem: boolean;
  viewList: boolean;
}

export interface IRecipePermission extends IPermission {}

export interface IShoppingListPermission extends IPermission {
  markShoppingAsDone: boolean;
}

export interface IBrandPermission extends IPermission {}

export interface IPantryPermission extends IPermission {
  consumeItem: boolean;
  discardItem: boolean;
}

export interface IMealPlanPermission extends IPermission {
  markCookingAsDone: boolean;
}

export interface IRecipeTagPermission extends IPermission {}

export interface IProductCategoryPermission extends IPermission {}

export interface ICuisinePermission extends IPermission {}

export interface IProductCategoryPermission extends IPermission {}

export interface IPermissionGroup {
  recipe: IRecipePermission;
  shoppingList: IShoppingListPermission;
  brand: IBrandPermission;
  pantry: IPantryPermission;
  mealPlan: IMealPlanPermission;
  recipeTag: IRecipeTagPermission;
  productCategory: IProductCategoryPermission;
  cuisine: ICuisinePermission;
  product: IPermission;
}

export const WritePermissionDtoSchema = z.object({
  viewItem: z.boolean().default(false),
  editItem: z.boolean().default(false),
  deleteItem: z.boolean().default(false),
  createItem: z.boolean().default(false),
  viewList: z.boolean().default(false),
});

export const WriteShoppingListPermissionDtoSchema = WritePermissionDtoSchema.extend({
  markShoppingAsDone: z.boolean().default(false),
});

export const WritePantryPermissionDtoSchema = WritePermissionDtoSchema.extend({
  consumeItem: z.boolean().default(false),
  discardItem: z.boolean().default(false),
});
export const WriteMealPlanPermissionDtoSchema = WritePermissionDtoSchema.extend({
  markCookingAsDone: z.boolean().default(false),
});

export const WritePermissionGroupDtoSchema = z.object({
  recipe: WritePermissionDtoSchema,
  shoppingList: WriteShoppingListPermissionDtoSchema,
  brand: WritePermissionDtoSchema,
  pantry: WritePantryPermissionDtoSchema,
  mealPlan: WriteMealPlanPermissionDtoSchema,
  recipeTag: WritePermissionDtoSchema,
  productCategory: WritePermissionDtoSchema,
  cuisine: WritePermissionDtoSchema,
  product: WritePermissionDtoSchema,
});

export type IWritePermissionGroupDto = z.infer<typeof WritePermissionGroupDtoSchema>;
