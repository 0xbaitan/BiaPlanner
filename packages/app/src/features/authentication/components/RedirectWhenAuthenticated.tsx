import { Suspense, useEffect } from "react";
import { useIsAuthenticated, useSetAcessTokenObject } from "../hooks/useAuthenticationState";

import { IRefreshJWTObject } from "@biaplanner/shared";
import { useNavigate } from "react-router-dom";
import { useRefreshTokenMutation } from "@/apis/AuthenticationApi";
import useSessionStorageState from "use-session-storage-state";

export default function RedirectWhenAuthenticated({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const setAcessTokenObject = useSetAcessTokenObject();
  const [refreshAccessToken, { isLoading }] = useRefreshTokenMutation();
  const [refreshTokenObj] = useSessionStorageState<IRefreshJWTObject>("refreshTokenObj");
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        viewTransition: true,
      });
    } else {
      refreshAccessToken(process.env.NODE_ENV === "development" ? refreshTokenObj : undefined).then(({ data }) => {
        if (data) {
          setAcessTokenObject(data);
          navigate("/", {
            viewTransition: false,
          });
        } else {
          navigate("/login", {
            viewTransition: false,
          });
        }
      });
    }
  }, [isAuthenticated, refreshAccessToken, setAcessTokenObject, navigate]);

  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
