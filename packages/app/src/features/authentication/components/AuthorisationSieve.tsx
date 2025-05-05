import NotFoundPage from "@/pages/404Page";
import { PermissionAreaAndKey } from "@biaplanner/shared";
import React from "react";
import { useContainsNecessaryPermission } from "../hooks/useContainsNecessaryPermission";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export enum AuthorisationSieveType {
  REDIRECT_TO_404 = "REDIRECT_TO_404",
  NULLIFY = "NULLIFY",
}

export type AuthorisationSieveProps = {
  permissionIndex?: PermissionAreaAndKey[] | PermissionAreaAndKey;
  type?: AuthorisationSieveType;
  children: React.ReactNode;
};

export default function AuthorisationSieve(props: AuthorisationSieveProps) {
  const { permissionIndex: index, type, children } = props;

  const containsNecessaryPermission = useContainsNecessaryPermission();
  const navigate = useNavigate();

  const permissionPresent = useMemo(() => {
    if (!index) {
      return true;
    }

    if (Array.isArray(index)) {
      return index.every((i) => {
        return containsNecessaryPermission(i);
      });
    }

    return containsNecessaryPermission(index);
  }, [index, containsNecessaryPermission]);

  if (!index || !type) {
    return <>{children}</>;
  }

  if (!permissionPresent) {
    switch (type) {
      case AuthorisationSieveType.REDIRECT_TO_404:
        navigate("/404");
        return <NotFoundPage />;
      case AuthorisationSieveType.NULLIFY:
      default:
        return null;
    }
  }

  return <>{children}</>;
}
