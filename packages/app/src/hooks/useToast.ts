import "react-toastify/dist/ReactToastify.css";

import { ToastContent, ToastOptions, TypeOptions, toast } from "react-toastify";
import { useCallback, useState } from "react";

export default function useToast(content: ToastContent, type: TypeOptions, options?: ToastOptions) {
  const [pauseNotification, setPauseNotificationStatus] = useState(false);
  const notify = useCallback(() => {
    if (pauseNotification) {
      return;
    }
    toast(content, {
      type,
      ...options,
    });
  }, [content, type, options, pauseNotification]);

  return { notify, setPauseNotificationStatus };
}
