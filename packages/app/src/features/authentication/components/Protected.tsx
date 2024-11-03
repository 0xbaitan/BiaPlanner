import { Route, RouteProps, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useIsAuthenticated, useSetAcessTokenObject } from "../hooks/useAuthenticationState";

import { IRefreshJWTObject } from "@biaplanner/shared";
import { useRefreshTokenMutation } from "@/apis/AuthenticationApi";
import useSessionStorageState from "use-session-storage-state";

export default function Protected({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const setAcessTokenObject = useSetAcessTokenObject();
  const [refreshAccessToken, { isLoading }] = useRefreshTokenMutation();
  const [refreshTokenObj] = useSessionStorageState<IRefreshJWTObject>("refreshTokenObj");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      refreshAccessToken(process.env.NODE_ENV === "development" ? refreshTokenObj : undefined).then(({ data }) => {
        if (data) {
          setAcessTokenObject(data);
        } else {
          navigate("/login", {
            viewTransition: true,
          });
        }
      });
    }
  }, [isAuthenticated, refreshAccessToken, setAcessTokenObject, navigate, refreshTokenObj]);

  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
