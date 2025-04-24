import { useLocation, useNavigate } from "react-router-dom";

import { RoutePaths } from "@/Routes";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";

export * from "./useValidationErrors";

export function useAuthenticationHookCallbacks() {
  const navigateToLoginPage = useNavigateToLoginPage();
  const navigateToHomePage = useNavigateToHomePage();
  const navigateToRegisterPage = useNavigateToRegisterPage();
  const isAdminLoggedIn = useIsAdminLoggedIn();
  return {
    navigateToLoginPage,
    navigateToHomePage,
    navigateToRegisterPage,
    isAdminLoggedIn,
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

export function useIsAdminLoggedIn() {
  const { user } = useAuthenticationState();
  return user?.isAdmin;
}
