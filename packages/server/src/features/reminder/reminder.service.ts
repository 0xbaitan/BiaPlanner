import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReminderEntity } from './reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  DailyReminderLog,
  ICreateReminderDto,
  IReminder,
  IUpdateReminderDto,
  ReminderMedium,
  ReminderStatus,
} from '@biaplanner/shared';
import dayjs, { Dayjs } from 'dayjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from './email/email.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(ReminderEntity)
    private reminderRepository: Repository<ReminderEntity>,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async testCron() {
    const dailyLog = await this.createDailyReminderLogForEmailReminders();
    await this.emailService.sendDailyReminderEmails(dailyLog);
    const sentReminders = Object.values(dailyLog)
      .flat()
      .map((entry) => entry.reminder);

    await Promise.all(
      sentReminders.map(async (reminder) => {
        return this.updateReminder(reminder.id, {
          status: ReminderStatus.SENT,
        });
      }),
    );

    console.log('Cron job ran');
  }

  async createReminder(dto: ICreateReminderDto): Promise<IReminder> {
    const reminder = this.reminderRepository.create(dto);
    return await this.reminderRepository.save(reminder);
  }

  async updateReminder(
    id: number,
    dto: IUpdateReminderDto,
  ): Promise<IReminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id: id },
    });
    if (!reminder) {
      throw new Error('Reminder not found');
    }
    const updatedReminder = this.reminderRepository.merge(reminder, dto);
    return await this.reminderRepository.save(updatedReminder);
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
        numberOfDaysToExpiry: dayjs(reminder.pantryItem.expiryDate).diff(
          today,
          'days',
        ),
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
