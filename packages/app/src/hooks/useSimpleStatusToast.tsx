import useToast from "./useToast";

export default function useSimpleStatusToast() {
  const { notify, setPauseNotificationStatus } = useToast("Loading...", "info", {
    autoClose: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
  });

  const showToast = () => {
    setPauseNotificationStatus(false);
    notify();
  };

  const hideToast = () => {
    setPauseNotificationStatus(true);
  };

  return { showToast, hideToast };
}
