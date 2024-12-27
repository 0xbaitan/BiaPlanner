import { Environment } from 'src/environment';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { Inject } from '@nestjs/common';
import { ITokenPayload, IUser } from '@biaplanner/shared';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Environment.getJWTSecret(),
    });
  }

  async validate(payload: ITokenPayload): Promise<IUser> {
    const user = await this.userService.readUser({
      id: payload.sub,
    });
    return user;
  }
}
