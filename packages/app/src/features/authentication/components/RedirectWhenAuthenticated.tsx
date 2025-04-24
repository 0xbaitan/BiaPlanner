import { Suspense, useEffect } from "react";

import { useAuthenticationHookCallbacks } from "../hooks";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";
import { useNavigate } from "react-router-dom";

export default function RedirectWhenAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthenticationState();
  const { navigateToLoginPage, navigateToHomePage } = useAuthenticationHookCallbacks();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigateToHomePage();
    } else {
      navigateToLoginPage();
    }
  }, [isAuthenticated, navigate, navigateToHomePage, navigateToLoginPage]);

  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
