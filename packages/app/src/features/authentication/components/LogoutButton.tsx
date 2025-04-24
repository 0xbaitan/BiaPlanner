import Button from "react-bootstrap/esm/Button";
import { useAuthenticationActions } from "../reducers/AuthenticationReducer";
import { useLogoutUserMutation } from "@/apis/AuthenticationApi";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [logoutUser] = useLogoutUserMutation();

  const { setAuthenticationState } = useAuthenticationActions();
  const navigate = useNavigate();
  return (
    <Button
      onClick={async () => {
        await logoutUser();
        setAuthenticationState(undefined, undefined, undefined);
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
}
