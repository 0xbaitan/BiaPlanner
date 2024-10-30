import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { Environment } from 'src/environment';
import { ITokenPayload } from '@biaplanner/shared';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Util } from 'src/util';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthenticationService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = Util.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    let username: string;
    try {
      const payload = await this.jwtService.verifyAsync<ITokenPayload>(token, {
        secret: Environment.getJWTSecret(),
      });
      username = payload.username;
      console.log('payload', payload);
      request.user = payload;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const isBlacklisted = await this.authService.isTokenBlacklisted(
      username,
      token,
    );

    if (isBlacklisted) {
      throw new HttpException(
        'Token blacklisted, try logging in to create a new token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
