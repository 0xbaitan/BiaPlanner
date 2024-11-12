import { Exclude, Expose } from "class-transformer";
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsStrongPassword, Matches, MaxLength, Min, MinLength } from "class-validator";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { PantryItem, Product } from "./pantry";

import { ApiProperty } from "@nestjs/swagger";
import { PhoneEntry } from "./PhoneDirectory";

export class User {
  @IsNumberString()
  @IsOptional()
  @Min(1, {
    message: "ID must be a positive number",
  })
  @ApiProperty()
  id?: number;

  @IsString({
    message: "First name must be a string",
  })
  @MinLength(1, {
    message: "First name is required",
  })
  @MaxLength(255, {
    message: "First name must be at most 255 characters long",
  })
  @Matches(/^[a-zA-Z]([a-zA-Z][.\s]?)+$/, {
    // Begins with a letter, followed by a sequence of letter and optional space or period
    message: "First name must be a valid name",
  })
  @ApiProperty()
  firstName: string;

  @IsString({
    message: "Last name must be a string",
  })
  @MinLength(1, {
    message: "Last name is required",
  })
  @MaxLength(255, {
    message: "Last name must be at most 255 characters long",
  })
  @Matches(/^[a-zA-Z]([a-zA-Z][.\s]?)+$/, {
    // Begins with a letter, followed by a sequence of letter and optional space or period
    message: "First name must be a valid name",
  })
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString({
    message: "Username must be a string",
  })
  @MinLength(3, {
    message: "Username must be at least 3 characters long",
  })
  @MaxLength(20, {
    message: "Username must be at most 20 characters long",
  })
  @Matches(/^[a-zA-Z][a-zA-Z0-9._-]{1,18}$/, {
    message: "Username must start with a letter",
  })
  @ApiProperty()
  username: string;

  @IsDateString()
  @ApiProperty()
  dateOfBirth: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  phoneEntries?: PhoneEntry[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  pantryItems?: PantryItem[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  products?: Product[];
}

export class CreateRequestUserDto extends OmitType(User, ["id", "phoneEntries"]) {}

export class ReadRequestUserDto extends PartialType(PickType(User, ["id", "username", "email"])) {}

export class UpdateRequestUserDto extends PartialType(User) {}

export class DeleteRequestUserDto extends PickType(User, ["id"]) {}

export class SanitisedUser extends User {
  @Exclude()
  declare password: string;
}

export class LoginRequestUserDto extends PickType(User, ["id", "password"]) {
  @ApiProperty()
  @IsString({
    message: "Login must be an email or username",
  })
  @IsNotEmpty({
    message: "Login is required",
  })
  login: string;
}

export interface IUser extends User {}

export interface ICreateRequestUserDto extends CreateRequestUserDto {}

export interface IReadRequestUserDto extends ReadRequestUserDto {}

export interface IUpdateRequestUserDto extends UpdateRequestUserDto {}

export interface IDeleteRequestUserDto extends DeleteRequestUserDto {}

export interface ILoginRequestUserDto extends LoginRequestUserDto {}

export interface ISanitisedUser extends SanitisedUser {}
