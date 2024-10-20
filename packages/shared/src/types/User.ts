import { PhoneEntry } from "./PhoneDirectory";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneEntries?: PhoneEntry[];
}
