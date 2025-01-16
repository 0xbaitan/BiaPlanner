import "react-toastify/dist/ReactToastify.css";

import { ToastContent, ToastOptions, TypeOptions, toast } from "react-toastify";

import { useCallback } from "react";

export default function useToast(content: ToastContent, type: TypeOptions, options?: ToastOptions) {
  const notify = useCallback(() => {
    toast(content, {
      type,
      ...options,
    });
  }, [content, type, options]);

  return { notify };
}
