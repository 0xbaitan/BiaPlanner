import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useIsAuthenticated } from "../hooks/useAuthenticationState";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
