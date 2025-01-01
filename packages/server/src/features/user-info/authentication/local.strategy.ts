import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILoginUserDto, IUser } from '@biaplanner/shared';

import { AuthenticationService } from './authentication.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string): Promise<IUser> {
    const dto: ILoginUserDto = {
      login,
      password,
    };
    const user = await this.authenticationService.validateUser(dto);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
