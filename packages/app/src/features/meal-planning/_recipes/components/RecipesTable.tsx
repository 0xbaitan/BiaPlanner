import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IRecipe } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteRecipeMutation } from "@/apis/RecipeApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type RecipeTableProps = {
  data: IRecipe[];
};

export default function RecipesTable(props: RecipeTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteRecipe, { isSuccess, isError, isLoading }] = useDeleteRecipeMutation();

  const { setItem } = useDefaultStatusToast<IRecipe>({
    isSuccess,
    isError,
    isLoading,
    idPrefix: "recipes",
    idSelector: (entity) => entity.id,
    toastProps: {
      autoClose: 5000,
    },
    action: Action.DELETE,
    entityIdentifier: (entity) => entity.title,
  });

  const { notify: notifyDeletion } = useDeletionToast<IRecipe>({
    identifierSelector: (entity) => entity.title,
    onConfirm: async (item) => {
      setItem(item);
      await deleteRecipe(item.id);
    },
  });

  return (
    <TabbedViewsTable<IRecipe>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["title", "rec"],
          default: true,

          columnDefs: [
            {
              header: "Recipe Title",
              accessorFn: (row) => row.title,
              accessorKey: "title",
            },
            {
              header: "Recipes Tags",
              accessorFn: (row) => row.tags?.map((tag) => tag.name).join(", ") ?? "N/A",
              accessorKey: "recipeTags",
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
