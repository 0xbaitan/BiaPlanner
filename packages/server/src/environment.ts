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
}
