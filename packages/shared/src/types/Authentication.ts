interface ICommonJWTObject {
  id?: number;
  username: string;
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
  ACCESS_TOKEN = "15m",
  REFRESH_TOKEN = "3d",
}
