import { IUser } from "./User";

export interface PhoneEntry {
  id?: number;
  countryCode: string;
  countryCallingCode: string;
  phoneNumber: string;
  isForWork?: boolean;
  isForHome?: boolean;
  isMobile?: boolean;
  isLandline?: boolean;
  user?: IUser;
}
