import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";
import { IRecipeIngredient } from "../meal-plans";

export interface IProductCategory extends IBaseEntity {
  name: string;
  products?: IProduct[];
  recipeIngredients?: IRecipeIngredient[];
  isAllergen?: boolean;
}

export interface ICreateProductCategoryDto {
  name: string;
  isAllergen?: boolean;
}

export interface IUpdateProductCategoryDto extends Partial<ICreateProductCategoryDto>, Pick<IProductCategory, "id"> {}

export class CreateProductCategoryDto implements ICreateProductCategoryDto {
  name: string;
  isAllergen?: boolean | undefined;
}

export class UpdateProductCategoryDto implements IUpdateProductCategoryDto {
  id: string;
  name?: string | undefined;
  isAllergen?: boolean | undefined;
}
