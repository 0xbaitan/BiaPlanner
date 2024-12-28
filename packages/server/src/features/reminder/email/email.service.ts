import {
  DailyReminderLog,
  DailyReminderLogEntry,
  IUser,
} from '@biaplanner/shared';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import PantryItemService from 'src/features/pantry/pantry-item/pantry-item.service';

@Injectable()
export class EmailService {
  constructor(@Inject(MailerService) private mailerService: MailerService) {}

  async testSendEmail(user: IUser) {
    if (!user.email) {
      throw new Error('User does not have an email');
    }

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Test email',
      text: 'This is a test email',
    });

    console.log('Email sent');
  }

  async createReminderMailOptions(
    entries: DailyReminderLogEntry[],
  ): Promise<ISendMailOptions> {
    const lines = entries
      .map((entry) => {
        return `${entry.pantryItem.product.name} - ${entry.pantryItem.quantity} expires in ${entry.numberOfDaysToExpiry} days on ${dayjs(entry.pantryItem.expiryDate).format('YYYY-MM-DD')}`;
      })
      .join('\n');
    return {
      to: entries[0].pantryItem.createdBy.email,
      subject: 'Daily reminder',
      text: lines,
    };
  }
  async sendDailyReminderEmails(log: DailyReminderLog) {
    const emailIds = Object.keys(log);
    const statuses = await Promise.all(
      emailIds.map(async (emailId) => {
        const entries = log[emailId];
        const mailOptions = await this.createReminderMailOptions(entries);
        return this.mailerService.sendMail(mailOptions);
      }),
    );

    return statuses;
  }
}
