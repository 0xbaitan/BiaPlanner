import { ICreateUserDto, ILoginUserDto, IUpdateUserDto } from "../types";

export class CreateUserDto implements ICreateUserDto {
  dateOfBirth: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  isAdmin?: boolean | undefined;
}

export class UpdateUserDto implements IUpdateUserDto {
  dateOfBirth?: string | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  username?: string | undefined;
  isAdmin?: boolean | undefined;
}

export class LoginUserDto implements ILoginUserDto {
  login: string;
  password: string;
}
