import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { ICuisine, ICuisineExtended } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useContainsNecessaryPermission } from "@/features/authentication/hooks/useContainsNecessaryPermission";
import { useDeleteCuisineMutation } from "@/apis/CuisinesApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type CuisinesTableProps = {
  data: ICuisineExtended[];
};

export default function CuisinesTable(props: CuisinesTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteCuisine, { isSuccess, isError, isLoading }] = useDeleteCuisineMutation();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-cuisine",
    successMessage: "Cuisine deleted successfully",
    errorMessage: "Failed to delete cuisine",
    loadingMessage: "Deleting cuisine...",
    isSuccess,
    isError,
    isLoading,
  });

  const containsNecessaryPermissions = useContainsNecessaryPermission();

  const { notify: notifyDeletion } = useDeletionToast<ICuisineExtended>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteCuisine(item.id);
    },
  });

  return (
    <TabbedViewsTable<ICuisineExtended>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["category", "description", "recipeCount"],
          default: true,

          columnDefs: [
            {
              header: "Cuisine Name",
              accessorFn: (row) => row.name,
              accessorKey: "category",
            },
            {
              header: "Cuisine Description",
              accessorFn: (row) => row.description,
              accessorKey: "description",
            },
            {
              header: "Recipes Count",
              accessorFn: (row) => row.recipeCount ?? 0,
              accessorKey: "recipeCount",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Edit Cuisine",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.CUISINES_EDIT, { id: row.id }));
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "cuisine", key: "editItem" }),
        },

        {
          icon: FaTrashAlt,
          label: "Delete Cuisine",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "cuisine", key: "deleteItem" }),
        },
      ]}
    />
  );
}
