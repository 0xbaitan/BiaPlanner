import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { ICuisine } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteCuisineMutation } from "@/apis/CuisinesApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type CuisinesTableProps = {
  data: ICuisine[];
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

  const { notify: notifyDeletion } = useDeletionToast<ICuisine>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteCuisine(item.id);
    },
  });

  return (
    <TabbedViewsTable<ICuisine>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["category", "recipeCount"],
          default: true,

          columnDefs: [
            {
              header: "Cuisine Name",
              accessorFn: (row) => row.name,
              accessorKey: "category",
            },
            {
              header: "Recipes Count",
              accessorFn: (row) => row.recipes?.length ?? 0,
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
        },

        {
          icon: FaTrashAlt,
          label: "Delete Cuisine",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
