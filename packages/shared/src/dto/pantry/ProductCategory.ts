import { ICreateProductCategoryDto, IUpdateProductCategoryDto } from "../../types";

export class CreateProductCategoryDto implements ICreateProductCategoryDto {
  name: string;
}

export class UpdateProductCategoryDto implements IUpdateProductCategoryDto {
  name?: string | undefined;
}
