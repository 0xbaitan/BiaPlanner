import { ICreateUserDto, ILoginUserDto, IUpdateUserDto } from "../types";

export class CreateUserDto implements ICreateUserDto {
  dateOfBirth: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export class UpdateUserDto implements IUpdateUserDto {
  dateOfBirth?: string | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  username?: string | undefined;
}

export class LoginUserDto implements ILoginUserDto {
  login: string;
  password: string;
}
