import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthenticationService } from './authentication.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Environment } from 'src/environment';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

/**
 * Boilerplate code referenced from: https://docs.nestjs.com/recipes/passport and modified
 */
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: Environment.getJWTSecret(),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
