import { Suspense, useEffect } from "react";

import { useAuthenticationHookCallbacks } from "../hooks";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthenticationState();
  const { navigateToLoginPage } = useAuthenticationHookCallbacks();
  useEffect(() => {
    if (!isAuthenticated) {
      navigateToLoginPage();
    }
  }, [isAuthenticated, navigateToLoginPage]);

  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
