import { Module } from '@nestjs/common';
import { PhoneEntryController } from './phone-entry.controller';
import { PhoneEntryService } from './phone-entry.service';

@Module({
  controllers: [PhoneEntryController],
  providers: [PhoneEntryService]
})
export class PhoneEntryModule {}
