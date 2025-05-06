import { RecipeSuggestionsService } from '@/features/meal-plan/recipe/suggestions.recipe.service';
import { ComputeExpiryDatesService } from '@/features/pantry/pantry-item/compute-expiry-dates.service';
import {
  DailyReminderLog,
  DailyReminderLogEntry,
  IUser,
} from '@biaplanner/shared';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { SentMessageInfo } from 'nodemailer';
import PantryItemService from 'src/features/pantry/pantry-item/pantry-item.service';

@Injectable()
export class EmailService {
  constructor(
    @Inject(MailerService) private mailerService: MailerService,
    @Inject(RecipeSuggestionsService)
    private recipeSuggestionsService: RecipeSuggestionsService,
    @Inject(ComputeExpiryDatesService)
    private computeExpiryDatesService: ComputeExpiryDatesService,
  ) {}

  async createPantryStatusEmaiLHTML(user: IUser): Promise<string> {
    const pantryItems = await this.computeExpiryDatesService.findExpiringItems(
      user.id,
      5,
    );
    const recipeSuggestions =
      await this.recipeSuggestionsService.computeRecipeSuggestions(user.id, 5);

    const pantryItemHtml = pantryItems
      .map((item) => {
        return `<li>${item.product.name} - ${item.quantity} expires in ${dayjs(item.expiryDate).diff(dayjs(), 'days')} days on ${dayjs(item.expiryDate).format('YYYY-MM-DD')}</li>`;
      })
      .join('');

    const recipeHtml = recipeSuggestions
      .map((recipeSuggestion) => {
        return `<li>${recipeSuggestion.recipe.title} - ${recipeSuggestion.recipe.ingredients
          .map((ingredient) => {
            return `${ingredient.title} - ${ingredient.measurement?.magnitude} ${ingredient.measurement?.unit}`;
          })
          .join(', ')}</li>`;
      })
      .join('');

    return `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
  }
          h1 {
            color: #333;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            background: #fff;
            margin: 5px 0;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <h1>Pantry Status</h1>
        <h2>Expiring Items</h2>
        <ul>
          ${pantryItemHtml}
        </ul>
        <h2>Recipe Suggestions</h2>
        <ul>
          ${recipeHtml}
        </ul>
      </body>
    </html>
  `;
  }
  async testSendEmail(user: IUser) {
    if (!user.email) {
      throw new Error('User does not have an email');
    }

    const html = await this.createPantryStatusEmaiLHTML(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Today's Pantry Status",
      html: html,
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
      emailIds.map(async (emailId): Promise<SentMessageInfo> => {
        const entries = log[emailId];
        const mailOptions = await this.createReminderMailOptions(entries);
        return this.mailerService.sendMail(mailOptions);
      }),
    );

    return statuses;
  }
}
