import { IUser } from '@biaplanner/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import PantryItemService from 'src/features/pantry/pantry-item/pantry-item.service';

@Injectable()
export class EmailService {
  constructor(
    @Inject(MailerService) private mailerService: MailerService,
    @Inject(PantryItemService) private pantryItemService: PantryItemService,
  ) {}

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

  private async findPantryItemsNearingExpiration(numberOfDays: number) {}
}
