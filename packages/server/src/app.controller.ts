import { Controller, Req, Res, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CreateRequestUserDto,
  IAccessJWTObject,
  ISanitisedUser,
  LoginRequestUserDto,
  SanitisedUser,
} from '@biaplanner/shared';
import { LocalGuard } from './features/user-info/authentication/local.guard';
import { AuthenticationService } from './features/user-info/authentication/authentication.service';

import { EvadeJWTGuard } from './features/user-info/authentication/evade-jwt-guard.decorator';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
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
    @Body() _dto: LoginRequestUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAccessJWTObject> {
    const { accessTokenObj, refreshTokenObj } =
      await this.authService.loginUser(req.user);
    res.cookie('refreshToken', refreshTokenObj.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? 'biaplanner.com' : 'localhost',
    });
    return accessTokenObj;
  }

  @Post('/auth/logout')
  async logoutUser(@Req() req: any): Promise<void> {
    const username = req.user.username;
    return await this.authService.logoutUser(username);
  }
  @EvadeJWTGuard()
  @Post('/auth/register')
  async registerUser(
    @Body() dto: CreateRequestUserDto,
  ): Promise<ISanitisedUser> {
    const user = await this.authService.registerUser(dto);
    return plainToInstance(SanitisedUser, user);
  }
}
