import { BadRequestException, HttpException } from '@nestjs/common';

import { IValidationError } from '@biaplanner/shared';

export default class CustomValidationError extends BadRequestException {
  private errors: IValidationError[];
  constructor(...payloads: IValidationError[]) {
    super({ payloads });
    this.errors = payloads;
  }

  getErrors() {
    return this.errors;
  }
}
