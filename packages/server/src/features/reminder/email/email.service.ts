import { IUser } from '@biaplanner/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

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
}
