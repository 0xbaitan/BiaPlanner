import "../styles/DeletionToast.scss";

import { Alert, Button } from "react-bootstrap";

import { FaExclamationTriangle } from "react-icons/fa";
import React from "react";
import { ToastContentProps } from "react-toastify";
import { toast } from "react-toastify";

export type DeletionToastProps<T> = Partial<ToastContentProps> & {
  item: T;
  message?: string;
  identifierSelector: (item: T) => string;
  onConfirm: (item: T) => Promise<void>;
  onCancel?: (item: T) => void;
};

export default function DeletionToast<T>(props: DeletionToastProps<T>) {
  const { item, message, identifierSelector, onConfirm, onCancel, closeToast } = props;

  return (
    <div className="bp-deletion-toast">
      <div className="bp-deletion-toast__header">
        <h5 className="bp-deletion-toast__title">
          <FaExclamationTriangle className="bp-deletion-toast__icon" />
          Warning
        </h5>
      </div>
      <div className="bp-deletion-toast__body">
        <p>{message || `Are you sure you want to delete ${identifierSelector(item)}?`}</p>
      </div>
      <div className="bp-deletion-toast__footer">
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            onConfirm(item);
            closeToast?.();
          }}
        >
          Yes, delete
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            closeToast?.();
            onCancel?.(item);
          }}
        >
          No, cancel
        </Button>
      </div>
    </div>
  );
}

export function useDeletionToast<T>(props: Omit<DeletionToastProps<T>, "item">) {
  const notify = React.useCallback(
    (item: T) => {
      if (toast.isActive("deletion-toast")) {
        toast.update("deletion-toast", {
          render: () => (
            <DeletionToast
              {...props}
              item={item}
              closeToast={() => {
                toast.dismiss("deletion-toast");
              }}
            />
          ),
        });
      } else {
        toast(
          () => (
            <DeletionToast
              {...props}
              item={item}
              closeToast={() => {
                toast.dismiss("deletion-toast");
              }}
            />
          ),
          {
            ...props.toastProps,
            type: "warning",
            autoClose: 30 * 1000,
            toastId: "deletion-toast",
            icon: false,

            className: "bp-deletion-toast__container",
            progressClassName: "bp-deletion-toast__progress",
            closeOnClick: false,
          }
        );
      }
    },
    [props]
  );

  React.useEffect(() => {
    return () => {
      toast.dismiss("deletion-toast");
    };
  }, []);

  return {
    notify,
  };
}
