import { PantryItem } from "../pantry";
import { PickType } from "@nestjs/mapped-types";
import { User } from "../User";

export enum ReminderMedium {
  SMS = "SMS",
  EMAIL = "EMAIL",
}

export enum ReminderStatus {
  SENT = "SENT",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}
export class Reminder {
  id?: number;
  pantryItemId?: number;
  pantryItem?: PantryItem;
  reminderDate?: string;
  medium?: ReminderMedium;
  status?: ReminderStatus;
}

export class CreateReminderDto extends PickType(Reminder, ["pantryItemId", "reminderDate", "medium", "status"]) {}

export class UpdateReminderDto extends PickType(Reminder, ["reminderDate", "medium", "status"]) {}

export class DeleteReminderDto extends PickType(Reminder, ["id"]) {}

export interface IReminder extends Reminder {}
export interface ICreateReminderDto extends CreateReminderDto {}
export interface IUpdateReminderDto extends UpdateReminderDto {}
export interface IDeleteReminderDto extends DeleteReminderDto {}
