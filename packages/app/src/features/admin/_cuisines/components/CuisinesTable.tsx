import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { ICuisine } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteCuisineMutation } from "@/apis/CuisinesApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type CuisinesTableProps = {
  data: ICuisine[];
};

export default function CuisinesTable(props: CuisinesTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteCuisine, { isSuccess, isError, isLoading }] = useDeleteCuisineMutation();

  const { setItem } = useDefaultStatusToast<ICuisine>({
    isSuccess,
    isError,
    isLoading,
    idPrefix: "cuisines",
    idSelector: (entity) => entity.id,
    toastProps: {
      autoClose: 5000,
    },
    action: Action.DELETE,
    entityIdentifier: (entity) => entity.name,
  });

  const { notify: notifyDeletion } = useDeletionToast<ICuisine>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      setItem(item);
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
            navigate(`./update/${row.id}`);
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
