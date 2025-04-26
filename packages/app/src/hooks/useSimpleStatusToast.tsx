import { useCallback, useEffect, useState } from "react";

import { DeepPartial } from "react-hook-form";
import { ToastContentProps } from "react-toastify";
import { toast } from "react-toastify";

export enum Status {
  SUCCESS = "success",
  ERROR = "error",
  LOADING = "loading",
  DEFAULT = "default",
}

export type StatusToastProps = DeepPartial<ToastContentProps> & {
  idPrefix: string;
  successMessage: string;
  errorMessage: string;
  loadingMessage: string;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  onFailure?: () => void;
  onSuccess?: () => void;
};

export default function useSimpleStatusToast(props: StatusToastProps) {
  const { idPrefix, successMessage, errorMessage, loadingMessage, isSuccess, isError, isLoading, onFailure, onSuccess } = props;
  const [isActive, setIsActive] = useState(false);
  const notify = useCallback(() => {
    const toastId = `${idPrefix}`;
    setIsActive(true);
    const status: Status = isSuccess ? Status.SUCCESS : isError ? Status.ERROR : isLoading ? Status.LOADING : Status.DEFAULT;

    if (status === Status.DEFAULT) {
      toast.dismiss(toastId);
      return;
    }

    const message = status === Status.SUCCESS ? successMessage : status === Status.ERROR ? errorMessage : loadingMessage;

    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        ...props,
        autoClose: props.toastProps?.autoClose,
        render: message,
        type: status === Status.LOADING ? "default" : status,
      });
    } else {
      toast(message, {
        ...props,
        autoClose: props.toastProps?.autoClose,
        toastId,
        type: status === Status.LOADING ? "default" : status,
      });
    }
  }, [errorMessage, idPrefix, isError, isLoading, isSuccess, loadingMessage, props, successMessage]);

  useEffect(() => {
    if ((isSuccess || isError || isLoading) && isActive) {
      notify();
    }

    if (isSuccess || isError) {
      setIsActive(false);
    }

    if (isSuccess && onSuccess) {
      onSuccess();
    }

    if (isError && onFailure) {
      onFailure();
    }
  }, [idPrefix, isActive, isError, isLoading, isSuccess, notify, onFailure, onSuccess]);

  return { notify };
}
