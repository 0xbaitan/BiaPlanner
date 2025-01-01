import {
  AuthenticationCacheIndices,
  AuthenticationCacheTTLs,
  AuthenticationErrorCodes,
  IAccessJWTObject,
  ICreateUserDto,
  ILoginUserDto,
  IRefreshJWTObject,
  ITokenPayload,
  IUser,
  convertDurationStringToMilli,
} from '@biaplanner/shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CacheService } from '../../cache/cache.service';
import CustomAuthenticationError from 'src/errors/CustomAuthenticationError';
import CustomValidationError from 'src/errors/CustomValidationError';
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

  async registerUser(dto: ICreateUserDto): Promise<IUser> {
    const hashedPassword = await this.hashPassword(dto.password);
    const newUser = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return newUser;
  }
  async validateUser(dto: ILoginUserDto): Promise<IUser | null> {
    const user = await this.userService.verifyUserExists(dto.login);

    const isUserValid = await this.validatePassword(
      dto.password,
      user.password,
    );
    if (!isUserValid) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.UNKNOWN_ERROR,
        'Invalid credentials',
      );
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
      username: dto.username,
      id: dto.id,
      expiryTime,
    };
  }

  async validateAccessToken(token: string): Promise<IAccessJWTObject> {
    let obj: IAccessJWTObject;
    try {
      obj = await this.jwtService.verifyAsync<IAccessJWTObject>(token);
    } catch (error) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.INVALID_OR_EXPIRED_ACCESS_TOKEN,
        'Invalid or expired access token',
      );
    }
    const isBlacklisted = await this.isTokenBlacklisted(obj.username, token);
    if (isBlacklisted) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.BLACKLISTED_ACCESS_TOKEN,
        'Blacklisted access token',
      );
    }
    return obj;
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
      username: dto.username,
      id: dto.id,
      expiryTime,
    };
  }

  async validateRefreshToken(token: string): Promise<IRefreshJWTObject> {
    let obj: IRefreshJWTObject;
    try {
      obj = await this.jwtService.verifyAsync<IRefreshJWTObject>(token);
    } catch (error) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
        'Invalid or expired refresh token',
      );
    }
    const isBlacklisted = await this.isTokenBlacklisted(obj.username, token);
    console.log('isBlacklisted', isBlacklisted);
    if (isBlacklisted) {
      throw new CustomAuthenticationError(
        AuthenticationErrorCodes.BLACKLISTED_REFRESH_TOKEN,
        'Blacklisted refresh token',
      );
    }
    return obj;
  }

  async refreshAccessToken(refreshToken: string): Promise<IAccessJWTObject> {
    const refreshTokenObj = await this.validateRefreshToken(refreshToken);
    const existingAccessToken = await this.retrieveAccessToken(
      refreshTokenObj.username,
    );
    try {
      if (existingAccessToken) {
        await this.validateAccessToken(existingAccessToken.accessToken);
        return existingAccessToken;
      }
    } catch (error) {
      const accessTokenObj = await this.createAccessToken({
        id: refreshTokenObj.id,
        username: refreshTokenObj.username,
      });
      await this.blackListAccessTokenIfExisting(refreshTokenObj.username);
      await this.storeAccessToken(accessTokenObj);
      return accessTokenObj;
    }
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
      const { expiryTime } = accessTokenObj;
      let ttl: number | undefined;
      if (expiryTime) {
        ttl = dayjs(expiryTime).diff(dayjs(), 'ms');
      }
      await this.blacklistToken(username, accessTokenObj.accessToken, ttl);
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

  async loginUser(dto: IUser): Promise<{
    accessTokenObj: IAccessJWTObject;
    refreshTokenObj: IRefreshJWTObject;
  }> {
    await this.blackListAccessTokenIfExisting(dto.username);
    await this.blackListRefreshTokenIfExisting(dto.username);

    const accessTokenObj = await this.createAccessToken(dto);
    const refreshTokenObj = await this.createRefreshToken(dto, accessTokenObj);

    await this.storeAccessToken(accessTokenObj);
    await this.storeRefreshToken(refreshTokenObj);

    return { accessTokenObj, refreshTokenObj };
  }

  async logoutUser(username: string) {
    await this.blackListAccessTokenIfExisting(username);
    await this.blackListRefreshTokenIfExisting(username);
  }
}
