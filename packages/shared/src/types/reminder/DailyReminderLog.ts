import { IPantryItem } from "../pantry";
import { IReminder } from "./Reminder";
import { IUser } from "../User";

export type DailyReminderLogEntry = {
  numberOfDaysToExpiry: number;
  expiryDate: string;
  pantryItem: IPantryItem;
  user: IUser;
  reminder: IReminder;
};

export type DailyReminderLog = {
  [key: string]: DailyReminderLogEntry[];
};
