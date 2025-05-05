import { AuthenticationModule } from './authentication/authentication.module';
import { Module } from '@nestjs/common';
import { PhoneEntryModule } from './phone-entry/phone-entry.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, PhoneEntryModule, AuthenticationModule, RoleModule],
  exports: [],
})
export class UserInfoModule {}
