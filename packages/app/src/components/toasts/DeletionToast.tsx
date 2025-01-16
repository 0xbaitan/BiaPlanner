import { ToastContentProps } from "react-toastify";
import { toast } from "react-toastify";
import { useCallback } from "react";

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
    <div>
      <p>{message || `Are you sure you want to delete ${identifierSelector(item)}?`}</p>
      <button onClick={() => onConfirm(item)} className="btn btn-danger">
        Yes
      </button>
      <button
        onClick={() => {
          closeToast?.();
          onCancel?.(item);
        }}
        className="btn btn-secondary"
      >
        No
      </button>
    </div>
  );
}

export function useDeletionToast<T>(props: Omit<DeletionToastProps<T>, "item">) {
  const notify = useCallback(
    (item: T) => {
      if (toast.isActive("deletion-toast")) {
        toast.update("deletion-toast", {
          render: () => <DeletionToast {...props} item={item} />,
        });
      } else {
        toast(() => <DeletionToast {...props} item={item} />, {
          ...props.toastProps,
          type: "warning",
          autoClose: 30 * 1000,
          toastId: "deletion-toast",
        });
      }
    },
    [props]
  );
  return {
    notify,
  };
}
