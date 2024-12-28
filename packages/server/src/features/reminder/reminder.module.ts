import { EmailModule } from './email/email.module';
import { Module } from '@nestjs/common';
import { ReminderEntity } from './reminder.entity';
import { ReminderService } from './reminder.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([ReminderEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [ReminderService],
  exports: [EmailModule, TypeOrmModule],
})
export class ReminderModule {}
