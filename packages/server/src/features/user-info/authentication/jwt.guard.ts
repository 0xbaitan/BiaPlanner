import {
  AuthenticationErrorCodes,
  IRefreshJWTObject,
  ITokenPayload,
} from '@biaplanner/shared';
import {
  ExecutionContext,
  HttpException,
  HttpStatus,
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
    const response = context.switchToHttp().getResponse() as Response;

    const accessToken = Util.extractTokenFromHeader(request);
    const refreshToken = request.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.NEITHER_ACCESS_NOR_REFRESH_TOKEN_PROVIDED,
        'Neither access nor refresh token provided',
      );
    }

    if (!accessToken && refreshToken) {
      const accessTokenObj =
        await this.authService.refreshAccessToken(refreshToken);
      response.header('X-New-Access-Token', JSON.stringify(accessTokenObj));
      request.headers['authorization'] = `Bearer ${accessTokenObj.accessToken}`;
      request.user = accessTokenObj;
      return true;
    }

    const accessTokenObj =
      await this.authService.validateAccessToken(accessToken);
    request.user = accessTokenObj;
    console.log(accessTokenObj);

    return true;
  }
}
