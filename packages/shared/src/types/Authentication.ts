interface ICommonJWTObject {
  id?: number;
  username: string;
  expiryTime?: string;
}

export interface IAccessJWTObject extends ICommonJWTObject {
  accessToken: string;
}

export interface IRefreshJWTObject extends ICommonJWTObject {
  refreshToken: string;
}

export interface ITokenPayload {
  sub: number;
  username: string;
  accessToken?: string;
}

export enum AuthenticationCacheIndices {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  BLACKLIST_TOKEN = "blacklist_token",
}

export enum AuthenticationCacheTTLs {
  ACCESS_TOKEN = "90m",
  REFRESH_TOKEN = "3d",
}

export enum AuthenticationErrorCodes {
  NO_ACCESS_TOKEN = "No access token provided",
  NO_REFRESH_TOKEN = "No refresh token provided",
  INVALID_OR_EXPIRED_ACCESS_TOKEN = "Invalid or expired access token",
  INVALID_OR_EXPIRED_REFRESH_TOKEN = "Invalid or expired refresh token",
  BLACKLISTED_ACCESS_TOKEN = "Blacklisted access token",
  BLACKLISTED_REFRESH_TOKEN = "Blacklisted refresh token",
  UNKNOWN_ERROR = "Unknown error",
  NEITHER_ACCESS_NOR_REFRESH_TOKEN_PROVIDED = "Neither access nor refresh token provided",
}
