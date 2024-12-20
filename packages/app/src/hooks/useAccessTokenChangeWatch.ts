import useAuthenticationState from "@/features/authentication/hooks/useAuthenticationState";
import { useEffect } from "react";

export default function useAccessTokenChangeWatch(asyncFunction: () => Promise<void> | void) {
  const { accessTokenObject } = useAuthenticationState();

  useEffect(() => {
    Promise.resolve(asyncFunction())
      .then(() => {
        console.log("Access token changed");
      })
      .catch((error) => {
        console.error("Failed to execute async function", error);
      });
  }, [accessTokenObject, asyncFunction]);
}
