import { EmailModule } from './email/email.module';
import { Module } from '@nestjs/common';
import { ReminderEntity } from './reminder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([ReminderEntity])],
  exports: [EmailModule, TypeOrmModule],
})
export class ReminderModule {}
