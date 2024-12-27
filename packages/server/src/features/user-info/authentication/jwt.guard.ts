import {
  AuthenticationErrorCodes,
  IRefreshJWTObject,
  ITokenPayload,
} from '@biaplanner/shared';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { CAN_EVADE_JWT_GUARD_KEY } from './evade-jwt-guard.decorator';
import CustomAuthenticationError from 'src/errors/CustomAuthenticationError';
import { Environment } from 'src/environment';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Util } from 'src/util';

/**
 * Used AI to understand how I can use global guards in my application with exceptions for routes
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(AuthenticationService)
    private readonly authService: AuthenticationService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canEvadeJWT = this.reflector.get<boolean>(
      CAN_EVADE_JWT_GUARD_KEY,
      context.getHandler(),
    );
    if (canEvadeJWT) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;

    const accessToken = Util.extractTokenFromHeader(request);

    await this.authService.validateAccessToken(accessToken);

    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
