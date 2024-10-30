import dotenv from 'dotenv';

export class Environment {
  static {
    dotenv.config();
  }

  public static getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }
    return secret;
  }

  public static getRedistHostAndPort(): [string, number] {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = Number(process.env.REDIS_PORT);

    if (!redisHost || redisHost.trim().length === 0) {
      throw new Error('REDIS_HOST is not set');
    }

    if (!redisPort || isNaN(redisPort)) {
      throw new Error('REDIS_PORT is not set');
    }

    return [redisHost, redisPort];
  }
}
