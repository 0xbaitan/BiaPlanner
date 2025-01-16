import { redirect, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/esm/Button";
import { ToastContentProps } from "react-toastify";
import useToast from "@/hooks/useToast";

export type SuccessWithRedirectToastProps = Partial<ToastContentProps> & {
  redirectUrl?: string;
  message?: string;
  redirectButtonText?: string;
};
export default function SuccessWithRedirectToast(props: SuccessWithRedirectToastProps) {
  const { redirectUrl, message, redirectButtonText } = props;
  const navigate = useNavigate();

  return (
    <div>
      <p>{message || "Success!"}</p>
      <Button
        onClick={() => {
          navigate(redirectUrl || "./");
        }}
      >
        {redirectButtonText || "Go back"}
      </Button>
    </div>
  );
}

export function useSuccessWithRedirectToast(props?: SuccessWithRedirectToastProps) {
  return useToast((defaultProps) => <SuccessWithRedirectToast {...defaultProps} {...props} />, "success");
}
