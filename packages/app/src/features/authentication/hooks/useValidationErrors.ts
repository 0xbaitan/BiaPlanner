import { IValidationError } from "@biaplanner/shared";

function isValidationError(error: unknown): error is IValidationError {
  const castedError = error as IValidationError;
  return castedError.property !== undefined && castedError.constraints !== undefined;
}

function areValidationErrors(errors: unknown): errors is IValidationError[] {
  console.log(errors);
  if (!Array.isArray(errors) || errors.length === 0) {
    return false;
  }

  return errors.every((e) => isValidationError(e));
}

export type UseValidationErrorsHookResponse = {
  validationErrors: IValidationError[];
  properties: string[];
  containsProperty: (property: string) => boolean;
  containsConstraint: (property: string, constraint: string) => boolean;
  getConstraints: (property: string) => string[] | null;
  getConstraint: (property: string, constraint: string) => string | null;
};
export default function useValidationErrors(isError: boolean, error: unknown): UseValidationErrorsHookResponse | undefined {
  if (!isError) {
    return undefined;
  }

  const { data } = error as any;

  if (!areValidationErrors(data)) {
    return undefined;
  }

  const validationErrors = data as IValidationError[];
  const properties = validationErrors.map((e) => e.property);

  const containsProperty = (property: string) => properties.includes(property);

  const getConstraints = (property: string) => {
    const error = validationErrors.find((e) => e.property === property);
    const constraints = error?.constraints;
    return constraints ? Object.keys(constraints) : null;
  };

  const containsConstraint = (property: string, constraint: string) => {
    const error = validationErrors.find((e) => e.property === property);
    const constraints = error?.constraints;
    if (!constraints) {
      return false;
    }
    return Object.keys(constraints).includes(constraint);
  };

  const getConstraint = (property: string, constraint: string) => {
    const error = validationErrors.find((e) => e.property === property);
    const constraints = error?.constraints;
    if (!constraints) {
      return null;
    }
    return constraints[constraint] ?? null;
  };

  return {
    validationErrors,
    properties,
    containsProperty,
    containsConstraint,
    getConstraints,
    getConstraint,
  };
}
