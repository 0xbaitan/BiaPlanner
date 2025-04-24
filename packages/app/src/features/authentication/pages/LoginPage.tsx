import LoginForm from "../components/LoginForm";
import { useAuthenticationHookCallbacks } from "../hooks";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";
import { useEffect } from "react";

export default function LoginPage() {
  const { navigateToHomePage } = useAuthenticationHookCallbacks();
  const { isAuthenticated } = useAuthenticationState();
  useEffect(() => {
    if (isAuthenticated) {
      navigateToHomePage();
    }
  }, [isAuthenticated, navigateToHomePage]);
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
