import { EmailModule } from './email/email.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmailModule],
  exports: [EmailModule],
})
export class ReminderModule {}
