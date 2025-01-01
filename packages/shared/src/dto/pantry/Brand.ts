import { ICreateBrandDto, IUpdateBrandDto } from "../../types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto implements ICreateBrandDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({
    message: "Name is required",
  })
  name: string;
}

export class UpdateBrandDto implements IUpdateBrandDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string | undefined;
}
