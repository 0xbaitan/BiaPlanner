import { Route, RouteProps, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useIsAuthenticated } from "../hooks/useAuthenticationState";

export default function Authenticated({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  console.log(isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        viewTransition: true,
      });
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
