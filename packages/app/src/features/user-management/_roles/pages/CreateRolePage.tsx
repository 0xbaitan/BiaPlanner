import RolesForm from "../components/RolesForm";
import { RoutePaths } from "@/Routes";
import { useCreateRoleMutation } from "@/apis/RolesApi";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function CreateRolePage() {
  const [createRole, { isLoading, isSuccess, isError }] = useCreateRoleMutation();
  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "create-role",
    successMessage: "Role created successfully",
    errorMessage: "Failed to create role",
    loadingMessage: "Creating role...",
    isSuccess,
    isError,
    isLoading,
    onSuccess: () => {
      console.log("Role created successfully");
      navigate(RoutePaths.ROLES);
    },
  });

  return (
    <RolesForm
      type="create"
      onSubmit={async (dto) => {
        notify();
        await createRole(dto);
      }}
    />
  );
}
