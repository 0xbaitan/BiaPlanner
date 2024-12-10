import Button from "react-bootstrap/esm/Button";
import { IRefreshJWTObject } from "@biaplanner/shared";
import { useLogoutUserMutation } from "@/apis/AuthenticationApi";
import useSessionStorageState from "use-session-storage-state";

export default function LogoutButton() {
  const [logoutUser] = useLogoutUserMutation();
  const [, setRefreshTokenObj] = useSessionStorageState<IRefreshJWTObject>("refreshTokenObj");
  return (
    <Button
      onClick={async () => {
        await logoutUser().unwrap();
        if (process.env.NODE_ENV === "development") {
          setRefreshTokenObj(undefined);
        }
        window.location.reload();
      }}
    >
      Logout
    </Button>
  );
}
