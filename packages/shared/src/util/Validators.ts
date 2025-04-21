import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function isStringArray(value: any): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((item) => typeof item === "string");
}

export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined";
}

@ValidatorConstraint({ name: "customStringArray", async: false })
export class IsStringArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return isStringArray(value);
  }

  defaultMessage(args: ValidationArguments) {
    return "($value) is not a string array!";
  }
}
