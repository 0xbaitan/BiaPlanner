import { Controller, Req, Res, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AuthenticationErrorCodes,
  CreateUserDto,
  IAccessJWTObject,
  IRefreshJWTObject,
  isDevelopment,
  IUser,
} from '@biaplanner/shared';
import { LocalGuard } from './features/user-info/authentication/local.guard';
import { AuthenticationService } from './features/user-info/authentication/authentication.service';

import { EvadeJWTGuard } from './features/user-info/authentication/evade-jwt-guard.decorator';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Cookies } from './features/user-info/authentication/cookies.decorator';
import CustomAuthenticationError from './errors/CustomAuthenticationError';
import { User } from './features/user-info/authentication/user.decorator';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthenticationService,
  ) {}

  @EvadeJWTGuard()
  @UseGuards(LocalGuard)
  @Post('/auth/login')
  async loginUser(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @User() user: IUser,
  ): Promise<{
    accessTokenObj: IAccessJWTObject;
    refreshTokenObj: IRefreshJWTObject;
    user: IUser;
  }> {
    console.log('Logging in user:', user);
    const { accessTokenObj, refreshTokenObj } =
      await this.authService.loginUser(req.user);
    res.cookie('refreshToken', refreshTokenObj.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      domain:
        process.env.NODE_ENV === 'production' ? 'biaplanner.com' : 'localhost',
    });
    return { accessTokenObj, refreshTokenObj, user };
  }

  @Post('/auth/logout')
  async logoutUser(@Req() req: any): Promise<void> {
    const username = req.user.username;
    console.log('Logging out user:', username);
    return await this.authService.logoutUser(username);
  }
  @EvadeJWTGuard()
  @Post('/auth/register')
  async registerUser(@Body() dto: CreateUserDto): Promise<IUser> {
    const user = await this.authService.registerUser(dto);
    return user;
  }

  @EvadeJWTGuard()
  @Post('/auth/refresh')
  async refreshAccessToken(
    @Cookies('refreshToken') refreshToken?: string,
    @Body() dto?: IRefreshJWTObject,
  ): Promise<IAccessJWTObject> {
    if (isDevelopment() && dto) {
      return await this.authService.refreshAccessToken(dto.refreshToken);
    }
    if (!refreshToken) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.NO_REFRESH_TOKEN,
        'No refresh token provided',
      );
    }
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
