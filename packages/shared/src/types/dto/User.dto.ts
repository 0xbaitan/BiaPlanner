import { User } from "../User";

export interface UserDto extends User {
  dateOfBirth: string;
}
