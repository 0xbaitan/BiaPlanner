import Button from "react-bootstrap/esm/Button";
import { useLogoutUserMutation } from "@/apis/AuthenticationApi";
import { useNavigate } from "react-router-dom";
import { useSetAcessTokenObject } from "../hooks/useAuthenticationState";

export default function LogoutButton() {
  const [logoutUser] = useLogoutUserMutation();

  const setAccessToken = useSetAcessTokenObject();
  const navigate = useNavigate();
  return (
    <Button
      onClick={async () => {
        await logoutUser();
        setAccessToken(null);
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
}
