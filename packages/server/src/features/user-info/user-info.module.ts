import { AuthenticationModule } from './authentication/authentication.module';
import { Module } from '@nestjs/common';
import { PhoneEntryModule } from './phone-entry/phone-entry.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PhoneEntryModule, AuthenticationModule],
  exports: [UserModule, PhoneEntryModule, AuthenticationModule],
})
export class UserInfoModule {}
