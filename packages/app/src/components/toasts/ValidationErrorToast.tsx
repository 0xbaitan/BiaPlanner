import { FieldErrors } from "react-hook-form";
import { IWriteShoppingListDto } from "@biaplanner/shared";
import { ZodSchema } from "zod";
import { useCallback } from "react";
import { useErrorToast } from "./ErrorToast";

function ValidationErrorToastContent<T extends ZodSchema>(props: { errors: FieldErrors<T> }) {
  const { errors } = props;

  const errorMessages = Object.values(errors).map((error) => {
    return error?.message;
  });

  return (
    <p>
      You have the following errors in the form:
      <ul>
        {errorMessages.map((error, index) => (
          <li key={index}>{error?.toString()}</li>
        ))}
      </ul>
      Please correct them and try again.
    </p>
  );
}

export default function useValidationErrorToast<T extends ZodSchema>() {
  const { notify: notifyError } = useErrorToast();

  const onSubmitError = useCallback(
    (errors: FieldErrors<T>) => {
      const errorMessages = Object.values(errors).map((error) => {
        return error?.message;
      });

      if (errorMessages.length > 0) {
        notifyError(<ValidationErrorToastContent errors={errors} />);
      }
    },
    [notifyError]
  );

  return {
    onSubmitError,
  };
}
