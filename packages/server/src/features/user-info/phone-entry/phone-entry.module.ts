import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PhoneEntryController } from './phone-entry.controller';
import { PhoneEntryService } from './phone-entry.service';
import { PhoneEntryEntity } from './phone-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneEntryEntity])],
  controllers: [PhoneEntryController],
  providers: [PhoneEntryService],
  exports: [PhoneEntryService, TypeOrmModule],
})
export class PhoneEntryModule {}
