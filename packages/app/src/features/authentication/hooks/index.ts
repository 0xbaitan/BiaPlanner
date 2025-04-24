import { useLocation, useNavigate } from "react-router-dom";

import { RoutePaths } from "@/Routes";

export * from "./useValidationErrors";

export function useAuthenticationHookCallbacks() {
  const navigateToLoginPage = useNavigateToLoginPage();
  const navigateToHomePage = useNavigateToHomePage();
  const navigateToRegisterPage = useNavigateToRegisterPage();
  return {
    navigateToLoginPage,
    navigateToHomePage,
    navigateToRegisterPage,
  };
}
export function useNavigateToLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToLoginPage = () => {
    navigate(RoutePaths.LOGIN, {
      state: {
        from: location.pathname,
      },
      replace: true,
    });
  };
  return navigateToLoginPage;
}

export function useNavigateToHomePage() {
  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate(RoutePaths.MEAL_PLANS, {
      replace: true,
    });
  };
  return navigateToHomePage;
}
export function useNavigateToRegisterPage() {
  const navigate = useNavigate();
  const navigateToRegisterPage = () => {
    navigate(RoutePaths.SIGNUP, {
      replace: true,
    });
  };
  return navigateToRegisterPage;
}
