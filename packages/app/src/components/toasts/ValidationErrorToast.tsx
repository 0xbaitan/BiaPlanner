import { FieldErrors } from "react-hook-form";
import { ZodSchema } from "zod";
import { useCallback } from "react";
import { useErrorToast } from "./ErrorToast";

function ValidationErrorToastContent<T extends ZodSchema>(props: { errors: FieldErrors<T> }) {
  const { errors } = props;
  console.log("ValidationErrorToastContent", { errors });
  const errorMessages = Object.entries(errors).map(([key, error]) => {
    if (error?.message) {
      return `${key}: ${error.message}`;
    }
    if (error?.types) {
      return Object.values(error.types).join(", ");
    }
    return null;
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
