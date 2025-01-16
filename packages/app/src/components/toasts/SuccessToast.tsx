import { ToastContentProps } from "react-toastify";
import useToast from "@/hooks/useToast";

export type SuccessToastProps = Partial<ToastContentProps> & {
  message?: string;
};

export default function SuccessToast(props: SuccessToastProps) {
  const { message } = props;
  return (
    <div>
      <p>{message || "Success!"}</p>
    </div>
  );
}

export function useSuccessToast(props?: SuccessToastProps) {
  return useToast((defaultProps) => <SuccessToast {...defaultProps} {...props} />, "success");
}
