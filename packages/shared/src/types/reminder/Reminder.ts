import { IBaseEntity } from "../BaseEntity";
import { IPantryItem } from "../pantry";

export enum ReminderMedium {
  SMS = "SMS",
  EMAIL = "EMAIL",
}

export enum ReminderStatus {
  SENT = "SENT",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export interface IReminder extends IBaseEntity {
  pantryItemId: string;
  pantryItem?: IPantryItem;
  reminderDate: string;
  medium: ReminderMedium;
  status: ReminderStatus;
}

export interface ICreateReminderDto {
  pantryItemId: string;
  reminderDate: string;
  medium: ReminderMedium;
  status: ReminderStatus;
}

export interface IUpdateReminderDto {
  reminderDate?: string;
  medium?: ReminderMedium;
  status?: ReminderStatus;
}
