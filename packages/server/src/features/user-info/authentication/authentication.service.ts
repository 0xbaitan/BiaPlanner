import {
  AuthenticationCacheIndices,
  AuthenticationCacheTTLs,
  IAccessJWTObject,
  ICreateRequestUserDto,
  ILoginRequestUserDto,
  IRefreshJWTObject,
  ITokenPayload,
  IUser,
  convertDurationStringToMilli,
} from '@biaplanner/shared';

import { CacheService } from '../../cache/cache.service';
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
    private cacheService: CacheService,
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

  async createAccessToken(
    dto: Pick<IUser, 'id' | 'username'>,
  ): Promise<IAccessJWTObject> {
    const payload = { username: dto.username, sub: dto.id };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: AuthenticationCacheTTLs.ACCESS_TOKEN,
    });
    return {
      accessToken: token,
      ...dto,
    };
  }

  async createRefreshToken(
    dto: Pick<IUser, 'id' | 'username'>,
    obj: IAccessJWTObject,
  ): Promise<IRefreshJWTObject> {
    const payload = {
      username: dto.username,
      sub: dto.id,
      accessToken: obj.accessToken,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: AuthenticationCacheTTLs.REFRESH_TOKEN,
    });
    return {
      refreshToken: token,
      ...dto,
    };
  }

  computeAuthenticationCacheKey(
    index: Omit<
      AuthenticationCacheIndices,
      AuthenticationCacheIndices.BLACKLIST_TOKEN
    >,
    username: string,
  ) {
    return `${index}_${username}`;
  }

  async storeRefreshToken(obj: IRefreshJWTObject) {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.REFRESH_TOKEN,
      obj.username,
    );
    this.cacheService.setValue<IRefreshJWTObject>(
      key,
      obj,
      convertDurationStringToMilli(AuthenticationCacheTTLs.REFRESH_TOKEN),
    );
  }

  async storeAccessToken(obj: IAccessJWTObject) {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.ACCESS_TOKEN,
      obj.username,
    );
    this.cacheService.setValue<IAccessJWTObject>(
      key,
      obj,
      convertDurationStringToMilli(AuthenticationCacheTTLs.ACCESS_TOKEN),
    );
  }

  async retrieveRefreshToken(
    username: string,
  ): Promise<IRefreshJWTObject | undefined> {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.REFRESH_TOKEN,
      username,
    );
    return this.cacheService.getValue<IRefreshJWTObject | undefined>(key);
  }
  async retrieveAccessToken(
    username: string,
  ): Promise<IAccessJWTObject | undefined> {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.ACCESS_TOKEN,
      username,
    );
    return this.cacheService.getValue<IAccessJWTObject | undefined>(key);
  }

  async removeRefreshToken(username: string) {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.REFRESH_TOKEN,
      username,
    );
    await this.cacheService.deleteValue(key);
  }

  async removeAccessToken(username: string) {
    const key = this.computeAuthenticationCacheKey(
      AuthenticationCacheIndices.ACCESS_TOKEN,
      username,
    );
    await this.cacheService.deleteValue(key);
  }

  async blacklistToken(username: string, token: string) {
    this.cacheService.setValue<string>(
      `${AuthenticationCacheIndices.BLACKLIST_TOKEN}_${username}_${token}`,
      token,
      convertDurationStringToMilli(AuthenticationCacheTTLs.REFRESH_TOKEN),
    );
  }

  async isTokenBlacklisted(username: string, token: string): Promise<boolean> {
    const tokenKey = `${AuthenticationCacheIndices.BLACKLIST_TOKEN}_${username}_${token}`;
    const blacklistedToken = await this.cacheService.getValue<
      string | undefined
    >(tokenKey);

    return !!blacklistedToken;
  }

  async doesRefreshTokenExist(username: string): Promise<boolean> {
    const token = await this.retrieveRefreshToken(username);
    return !!token;
  }

  async doesAccessTokenExist(username: string): Promise<boolean> {
    const token = await this.retrieveAccessToken(username);
    return !!token;
  }

  async loginUser(dto: IUser): Promise<IAccessJWTObject> {
    if (this.doesAccessTokenExist(dto.username)) {
      const accessTokenObj = await this.retrieveAccessToken(dto.username);
      await this.blacklistToken(dto.username, accessTokenObj.accessToken);
      await this.removeAccessToken(dto.username);
    }

    if (this.doesRefreshTokenExist(dto.username)) {
      const refreshTokenObj = await this.retrieveRefreshToken(dto.username);
      await this.blacklistToken(dto.username, refreshTokenObj.refreshToken);
      await this.removeRefreshToken(dto.username);
    }

    const accessTokenObj = await this.createAccessToken(dto);
    const refreshTokenObj = await this.createRefreshToken(dto, accessTokenObj);

    await this.storeAccessToken(accessTokenObj);
    await this.storeRefreshToken(refreshTokenObj);

    return accessTokenObj;
  }

  async logoutUser(username: string, token: string) {
    await this.blacklistToken(username, token);

    if (this.doesAccessTokenExist(username)) {
      const accessTokenObj = await this.retrieveAccessToken(username);
      await this.blacklistToken(username, accessTokenObj.accessToken);
      await this.removeAccessToken(username);
    }

    if (this.doesRefreshTokenExist(username)) {
      const refreshTokenObj = await this.retrieveRefreshToken(username);
      await this.blacklistToken(username, refreshTokenObj.refreshToken);
      await this.removeRefreshToken(username);
    }
  }
}
