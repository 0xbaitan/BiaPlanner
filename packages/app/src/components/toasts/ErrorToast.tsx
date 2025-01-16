import { isFetchBaseQueryError, isSerializedError } from "@/util/checkTypes";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { ToastContentProps } from "react-toastify";
import useToast from "@/hooks/useToast";

export type ErrorToastProps = Partial<ToastContentProps> & {
  error?: FetchBaseQueryError | SerializedError | string;
};

export default function ErrorToast(props: ErrorToastProps) {
  const { error } = props;
  return <div>{isFetchBaseQueryError(error) ? <p>{(error.data as any)?.message || "Error!"}</p> : isSerializedError(error) ? <p>{error.message || "Error!"}</p> : <p>{error || "Error!"}</p>}</div>;
}

export function useErrorToast(props?: ErrorToastProps) {
  return useToast((defaultProps) => <ErrorToast {...defaultProps} {...props} />, "error");
}
