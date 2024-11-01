import { ValidationError } from "class-validator";

export interface IValidationError extends ValidationError {}

export interface IValidationErrorForDTO {
  validationErrors: IValidationError[];
}
