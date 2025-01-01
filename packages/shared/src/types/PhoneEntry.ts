import { IBaseEntity } from "./BaseEntity";
import { IUser } from "./User";

export interface IPhoneEntry extends IBaseEntity {
  countryCode: string;
  countryCallingCode: string;
  phoneNumber: string;
  isForWork?: boolean;
  isForHome?: boolean;
  isMobile?: boolean;
  isLandline?: boolean;
  user?: IUser;
  userId?: string;
}
