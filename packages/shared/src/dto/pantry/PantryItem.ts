import { ICreatePantryItemDto, IUpdatePantryItemDto } from "../../types";
import { IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";

export class CreatePantryItemDto implements ICreatePantryItemDto {
  @IsNotEmpty({
    message: "Product ID is required",
  })
  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: "Product ID must be a number string",
    }
  )
  productId: string;

  @IsNotEmpty({
    message: "Quantity is required",
  })
  @IsNumber(
    {
      maxDecimalPlaces: 0,
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "Quantity must be a whole number that is not NaN or Infinity",
    }
  )
  quantity: number;

  @IsOptional()
  @IsDateString(
    {
      strict: true,
    },
    {
      message: "Expiry date must be a valid date string",
    }
  )
  expiryDate?: string | undefined;

  @IsOptional()
  @IsDateString(
    {
      strict: true,
    },
    {
      message: "Best before date must be a valid date string",
    }
  )
  bestBeforeDate?: string | undefined;

  @IsOptional()
  @IsDateString(
    {
      strict: true,
    },
    {
      message: "Opened date must be a valid date string",
    }
  )
  openedDate?: string | undefined;

  @IsOptional()
  @IsDateString(
    {
      strict: true,
    },
    {
      message: "Manufactured date must be a valid date string",
    }
  )
  manufacturedDate?: string | undefined;
}

export class UpdatePantryItemDto implements IUpdatePantryItemDto {
  bestBeforeDate?: string | undefined;
  openedDate?: string | undefined;
  expiryDate?: string | undefined;
  isExpired?: boolean | undefined;
  manufacturedDate?: string | undefined;
  quantity?: number | undefined;
}
