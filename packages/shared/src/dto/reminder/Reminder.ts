import { ICreateReminderDto, IUpdateReminderDto, ReminderMedium, ReminderStatus } from "../../types";

export class CreateReminderDto implements ICreateReminderDto {
  pantryItemId: string;
  reminderDate: string;
  medium: ReminderMedium;
  status: ReminderStatus;
}

export class UpdateReminderDto implements IUpdateReminderDto {
  medium?: ReminderMedium | undefined;
  reminderDate?: string | undefined;
  status?: ReminderStatus | undefined;
}
