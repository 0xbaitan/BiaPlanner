import Button from "react-bootstrap/esm/Button";
import { CgLogOut } from "react-icons/cg";
import { useAuthenticationActions } from "../reducers/AuthenticationReducer";
import { useLogoutUserMutation } from "@/apis/AuthenticationApi";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [logoutUser] = useLogoutUserMutation();

  const { setAuthenticationState } = useAuthenticationActions();
  const navigate = useNavigate();
  return (
    <Button
      className="btn-logout_btn w-100"
      onClick={async () => {
        await logoutUser();
        setAuthenticationState(undefined, undefined, undefined);
        navigate("/login");
      }}
    >
      <CgLogOut size={20} className="me-2" />
      Logout
    </Button>
  );
}
