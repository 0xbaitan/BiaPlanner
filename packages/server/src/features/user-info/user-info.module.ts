import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PhoneEntryModule } from './phone-entry/phone-entry.module';

@Module({
  imports: [UserModule, PhoneEntryModule],
})
export class UserInfoModule {}
