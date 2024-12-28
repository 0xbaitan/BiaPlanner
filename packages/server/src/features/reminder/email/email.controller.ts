import { Controller, Inject, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { User } from 'src/features/user-info/authentication/user.decorator';
import { IUser } from '@biaplanner/shared';

@Controller('/reminders/emails')
export class EmailController {
  constructor(@Inject(EmailService) private emailService: EmailService) {}

  @Post()
  async testEmailSending(@User() user: IUser) {
    console.log('Sending email');
    return this.emailService.testSendEmail(user);
  }
}
