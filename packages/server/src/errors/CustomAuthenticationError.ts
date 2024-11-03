import { AuthenticationErrorCodes } from '@biaplanner/shared';
import { UnauthorizedException } from '@nestjs/common';

export default class CustomAuthenticationError extends UnauthorizedException {
  private errorCode: AuthenticationErrorCodes;

  constructor(errorCode: AuthenticationErrorCodes, message?: string) {
    super({ errorCode, message });
    this.errorCode = errorCode;
    this.message = message;
  }

  getErrorCode() {
    return this.errorCode;
  }
}
