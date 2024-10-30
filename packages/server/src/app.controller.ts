import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateRequestUserDto,
  IAccessJWTObject,
  IUser,
  LoginRequestUserDto,
} from '@biaplanner/shared';
import { LocalGuard } from './features/user-info/authentication/local.guard';
import { AuthenticationService } from './features/user-info/authentication/authentication.service';
import { JwtGuard } from './features/user-info/authentication/jwt.guard';
import { Request as ERequest } from 'express';
import { Util } from './util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthenticationService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('/auth/login')
  async loginUser(
    @Request() req: any,
    @Body() _dto: LoginRequestUserDto,
  ): Promise<IAccessJWTObject> {
    return this.authService.loginUser(req.user);
  }

  @UseGuards(JwtGuard)
  @Post('/auth/logout')
  async logoutUser(@Request() req: any): Promise<{ user: IUser }> {
    const username = req.user.username;
    const token = Util.extractTokenFromHeader(req);
    await this.authService.logoutUser(username, token);
    return { user: null };
  }

  @UseGuards(LocalGuard)
  @Post('/auth/register')
  async registerUser(
    @Body() dto: CreateRequestUserDto,
  ): Promise<{ user: IUser }> {
    const user = await this.authService.registerUser(dto);
    return { user };
  }

  @UseGuards(JwtGuard)
  @Get('/profile')
  getProfile(@Request() req: any): IUser {
    return req.user;
  }
}
