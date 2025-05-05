import { IPermissionGroup, WriteMealPlanPermissionDtoSchema, WritePantryPermissionDtoSchema, WritePermissionDtoSchema, WritePermissionGroupDtoSchema, WriteShoppingListPermissionDtoSchema } from "./Permission";

import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IUser } from "./User";
import { z } from "zod";

export interface IRole extends IBaseEntity {
  name: string;
  description: string;
  permissions: IPermissionGroup;
  users?: IUser[];
}

export const WriteRoleDtoSchema = z.object({
  name: z.string().min(1, "Role name must be at least one character long").max(255, "Role name must be between 1 and 255 characters"),
  description: z.string().optional().nullable(),
  permissions: WritePermissionGroupDtoSchema,
});

export type IWriteRoleDto = z.infer<typeof WriteRoleDtoSchema>;

export const ViewOnlyRoleValue: IPermissionGroup = {
  brand: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  recipe: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  shoppingList: WriteShoppingListPermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  pantry: WritePantryPermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  mealPlan: WriteMealPlanPermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  recipeTag: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  productCategory: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  cuisine: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
  product: WritePermissionDtoSchema.parse({ viewItem: true, editItem: false, deleteItem: false, createItem: false, viewList: true }),
};

export enum RolesSortBy {
  NAME_A_TO_Z = "NAME_A_TO_Z",
  NAME_Z_TO_A = "NAME_Z_TO_A",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export const QueryRoleDtoSchema = FilterParamsSchema.extend({
  sortBy: z.nativeEnum(RolesSortBy).optional(),
});

export type IQueryRoleDto = z.infer<typeof QueryRoleDtoSchema>;
