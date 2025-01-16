import { ToastContentProps } from "react-toastify";
import useToast from "@/hooks/useToast";

export type LoadingToastProps = Partial<ToastContentProps> & {
  message?: string;
};

export default function LoadingToast(props: LoadingToastProps) {
  const { message } = props;
  return (
    <div>
      <p>{message || "Loading!"}</p>
    </div>
  );
}

export function useLoadingToast(props?: LoadingToastProps) {
  return useToast((defaultProps) => <LoadingToast {...defaultProps} {...props} />, "default");
}
