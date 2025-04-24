import LoginForm from "../components/LoginForm";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationState();
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
