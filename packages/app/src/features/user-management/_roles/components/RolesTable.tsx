import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IRole } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteRoleMutation } from "@/apis/RolesApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type RolesTableProps = {
  data: IRole[];
};

export default function RolesTable(props: RolesTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteRole, { isSuccess, isError, isLoading }] = useDeleteRoleMutation();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-role",
    successMessage: "Role deleted successfully",
    errorMessage: "Failed to delete role",
    loadingMessage: "Deleting role...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IRole>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteRole(item.id);
    },
  });

  return (
    <TabbedViewsTable<IRole>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["name", "description"],
          default: true,

          columnDefs: [
            {
              header: "Role Name",
              accessorFn: (row) => row.name,
              accessorKey: "name",
            },
            {
              header: "Description",
              accessorFn: (row) => row.description ?? "No description",
              accessorKey: "description",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Edit Role",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.ROLES_EDIT, { id: row.id }));
          },
        },

        {
          icon: FaTrashAlt,
          label: "Delete Role",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
