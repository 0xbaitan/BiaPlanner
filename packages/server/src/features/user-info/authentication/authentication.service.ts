import {
  ICreateRequestUserDto,
  IJWTResponse,
  ILoginRequestUserDto,
  IUser,
} from '@biaplanner/shared';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';

/**
 * Boilerplate code referenced from: https://docs.nestjs.com/recipes/passport and modified
 */

const SALT_ROUNDS = 12;

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async registerUser(dto: ICreateRequestUserDto): Promise<IUser> {
    const hashedPassword = await this.hashPassword(dto.password);
    const newUser = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return newUser;
  }
  async validateUser(dto: ILoginRequestUserDto): Promise<IUser | null> {
    const user = await this.userService.readUser({
      username: dto.login,
      email: dto.login,
    });
    const isUserValid = await this.validatePassword(
      dto.password,
      user.password,
    );
    if (!isUserValid) {
      return null;
    }
    return user;
  }

  async loginUser(dto: IUser): Promise<IJWTResponse> {
    const payload = { username: dto.username, sub: dto.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
