import {
  MAILER_OPTIONS,
  MailerModule,
  MailerOptions,
  MailerService,
} from '@nestjs-modules/mailer';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { Environment } from '../../../environment';
import { Module } from '@nestjs/common';
import PantryItemModule from '@/features/pantry/pantry-item/pantry-item.module';
import { RecipeModule } from '@/features/meal-plan/recipe/recipe.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const [smtpUser, smptPassword] = Environment.getSMTPGmailCredentials();

        const options: MailerOptions = {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: smtpUser,
              pass: smptPassword,
            },
          },
          defaults: {
            from: `"BiaPlanner" <${smtpUser}>`,
          },
        };

        return options;
      },
    }),
    PantryItemModule,
    RecipeModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
