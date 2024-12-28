import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReminderEntity } from './reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  DailyReminderLog,
  ICreateReminderDto,
  IReminder,
  ReminderMedium,
  ReminderStatus,
} from '@biaplanner/shared';
import dayjs, { Dayjs } from 'dayjs';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(ReminderEntity)
    private reminderRepository: Repository<ReminderEntity>,
  ) {}

  async createReminder(dto: ICreateReminderDto): Promise<IReminder> {
    const reminder = this.reminderRepository.create(dto);
    return await this.reminderRepository.save(reminder);
  }

  async createDailyReminderLogForEmailReminders(): Promise<DailyReminderLog> {
    const today = dayjs();
    const emailReminders = await this.findPendingRemindersToSend(
      today,
      ReminderMedium.EMAIL,
    );
    const log: DailyReminderLog = {};
    emailReminders.forEach((reminder) => {
      const email = reminder.pantryItem.createdBy.email;
      if (!log[email]) {
        log[email] = [];
      }
      log[email].push({
        pantryItem: reminder.pantryItem,
        numberOfDaysToExpiry: dayjs(reminder.reminderDate).diff(today, 'days'),
        reminder: reminder,
        expiryDate: dayjs(reminder.pantryItem.expiryDate).format('YYYY-MM-DD'),
        user: reminder.pantryItem.createdBy,
      });
    });
    return log;
  }

  async findPendingRemindersToSend(
    time: Dayjs,
    medium?: ReminderMedium,
  ): Promise<IReminder[]> {
    const reminders = await this.reminderRepository.find({
      where: {
        reminderDate: LessThanOrEqual(time.toISOString()),
        medium: medium,
        status: ReminderStatus.PENDING,
      },
      relations: ['pantryItem', 'pantryItem.createdBy', 'pantryItem.product'],
    });
    return reminders;
  }
}
