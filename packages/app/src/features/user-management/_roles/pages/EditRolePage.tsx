import { useGetRoleQuery, useUpdateRoleMutation } from "@/apis/RolesApi";
import { useNavigate, useParams } from "react-router-dom";

import RolesForm from "../components/RolesForm";
import { RoutePaths } from "@/Routes";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditRolePage() {
  const { id } = useParams();
  const { data: role } = useGetRoleQuery(String(id));
  const [updateRole, { isSuccess: isUpdateSuccess, isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateRoleMutation();
  const navigate = useNavigate();
  const { notify } = useSimpleStatusToast({
    idPrefix: "update-role",
    successMessage: "Role updated successfully",
    errorMessage: "Failed to update role",
    loadingMessage: "Updating role...",
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    isLoading: isUpdateLoading,
    onSuccess: () => {
      console.log("Role updated successfully");
      navigate(RoutePaths.ROLES);
    },
  });

  if (!role) return <div>Could not find role</div>;

  return (
    <RolesForm
      type="update"
      initialValue={role}
      onSubmit={async (dto) => {
        notify();
        await updateRole({ id: String(role?.id), dto });
      }}
      disableSubmit={isUpdateLoading}
    />
  );
}
