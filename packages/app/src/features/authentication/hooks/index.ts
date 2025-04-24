import { useLocation, useNavigate } from "react-router-dom";

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
    navigate("/auth/login", {
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
    navigate("/", {
      replace: true,
    });
  };
  return navigateToHomePage;
}
export function useNavigateToRegisterPage() {
  const navigate = useNavigate();
  const navigateToRegisterPage = () => {
    navigate("/auth/register", {
      replace: true,
    });
  };
  return navigateToRegisterPage;
}
