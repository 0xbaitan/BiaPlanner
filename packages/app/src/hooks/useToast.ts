import "react-toastify/dist/ReactToastify.css";

import { ToastContent, ToastOptions, TypeOptions, toast } from "react-toastify";
import { useCallback, useState } from "react";

export default function useToast(defaultContent: ToastContent, type: TypeOptions, options?: ToastOptions) {
  const [pauseNotification, setPauseNotificationStatus] = useState(false);
  const notify = useCallback(
    (content?: ToastContent) => {
      if (pauseNotification) {
        return;
      }
      toast(content ?? defaultContent, {
        type,
        ...options,
      });
    },
    [defaultContent, type, options, pauseNotification]
  );

  return { notify, setPauseNotificationStatus };
}
