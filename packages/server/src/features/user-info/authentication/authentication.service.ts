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
import dayjs from 'dayjs';

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
    const expiryTime = dayjs()
      .add(
        convertDurationStringToMilli(AuthenticationCacheTTLs.ACCESS_TOKEN),
        'ms',
      )
      .toISOString();
    return {
      accessToken: token,
      ...dto,
      expiryTime,
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
    const expiryTime = dayjs()
      .add(
        convertDurationStringToMilli(AuthenticationCacheTTLs.REFRESH_TOKEN),
        'ms',
      )
      .toISOString();
    return {
      refreshToken: token,
      ...dto,
      expiryTime,
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

  async blacklistToken(username: string, token: string, ttl?: number) {
    const calculatedTttl =
      ttl ??
      convertDurationStringToMilli(AuthenticationCacheTTLs.REFRESH_TOKEN);
    const expiresIn = dayjs().add(calculatedTttl, 'ms').toISOString();
    console.log('blacklisting token', { username, token, expiresIn });
    const payload = { username, token, expiresIn };
    this.cacheService.setValue<typeof payload>(
      `${AuthenticationCacheIndices.BLACKLIST_TOKEN}_${username}_${token}`,
      payload,
      calculatedTttl,
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

  private async blackListAccessTokenIfExisting(username: string) {
    if (await this.doesAccessTokenExist(username)) {
      const accessTokenObj = await this.retrieveAccessToken(username);
      await this.blacklistToken(username, accessTokenObj.accessToken);
      await this.removeAccessToken(username);
    }
  }

  private async blackListRefreshTokenIfExisting(username: string) {
    if (await this.doesRefreshTokenExist(username)) {
      const refreshTokenObj = await this.retrieveRefreshToken(username);
      const { expiryTime } = refreshTokenObj;
      let ttl: number | undefined;
      if (expiryTime) {
        ttl = dayjs(expiryTime).diff(dayjs(), 'ms');
      }
      await this.blacklistToken(username, refreshTokenObj.refreshToken, ttl);
      await this.removeRefreshToken(username);
    }
  }

  async loginUser(dto: IUser): Promise<IAccessJWTObject> {
    await this.blackListAccessTokenIfExisting(dto.username);
    await this.blackListRefreshTokenIfExisting(dto.username);

    const accessTokenObj = await this.createAccessToken(dto);
    const refreshTokenObj = await this.createRefreshToken(dto, accessTokenObj);

    await this.storeAccessToken(accessTokenObj);
    await this.storeRefreshToken(refreshTokenObj);

    return accessTokenObj;
  }

  async logoutUser(username: string) {
    await this.blackListAccessTokenIfExisting(username);
    await this.blackListRefreshTokenIfExisting(username);
  }
}
