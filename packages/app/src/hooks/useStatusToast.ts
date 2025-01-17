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

export type StatusToastProps<T> = DeepPartial<ToastContentProps> & {
  item: T;
  idSelector: (item: T) => string;
  idPrefix: string;
  contentCreator: (item: T, status: Status) => React.ReactNode;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
};

export default function useStatusToast<T>(props: Omit<StatusToastProps<T>, "item">) {
  const { idPrefix, contentCreator, isSuccess, isError, isLoading, idSelector } = props;
  const [item, setItem] = useState<T | null>(null);
  console.log(props);
  const notify = useCallback(() => {
    if (!item) {
      return;
    }
    const toastId = `${idPrefix}-${idSelector(item)}`;
    const status: Status = isSuccess ? Status.SUCCESS : isError ? Status.ERROR : isLoading ? Status.LOADING : Status.DEFAULT;
    if (status === Status.DEFAULT) {
      toast.dismiss(toastId);
      return;
    }
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        ...props,
        autoClose: props.toastProps?.autoClose,
        render: contentCreator(item, status),
        type: status === Status.LOADING ? "default" : status,
      });
    } else {
      toast(contentCreator(item, status), {
        ...props,
        autoClose: props.toastProps?.autoClose,
        toastId,
        type: status === Status.LOADING ? "default" : status,
      });
    }
  }, [contentCreator, idPrefix, idSelector, isError, isLoading, isSuccess, item, props]);

  useEffect(() => {
    if (isSuccess || isError || isLoading) {
      notify();
    }
    console.log("useStatusToast", { isSuccess, isError, isLoading });
  }, [isError, isLoading, isSuccess, notify]);

  return { notify, setItem };
}
