import { Route, RouteProps, useNavigate } from "react-router-dom";

import { useIsAuthenticated } from "../hooks/useAuthenticationState";

export default function AuthenticatedRoute(props: RouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  return <Route {...props} />;
}
