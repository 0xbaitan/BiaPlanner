import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { IQueryRecipeTagItemDto, IRecipeTag } from "@biaplanner/shared";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type RecipeTagsTableProps = {
  data: IQueryRecipeTagItemDto[];
};

export default function RecipeTagsTable(props: RecipeTagsTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteRecipeTag, { isSuccess, isError, isLoading }] = useDeleteRecipeTagMutation();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-recipe-tag",
    successMessage: "Recipe tag deleted successfully",
    errorMessage: "Failed to delete recipe tag",
    loadingMessage: "Deleting recipe tag...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IQueryRecipeTagItemDto>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
        await deleteRecipeTag(item.id);
      }
    },
  });

  return (
    <TabbedViewsTable<IQueryRecipeTagItemDto>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["category", "recipeCount"],
          default: true,

          columnDefs: [
            {
              header: "Recipe Tag Name",
              accessorFn: (row) => row.name,
              accessorKey: "category",
            },
            {
              header: "Recipe Count",
              accessorFn: (row) => row.recipeCount,
              accessorKey: "recipe",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Edit Recipe Tag",
          type: "edit",
          onClick: (row) => {
            navigate(`./update/${row.id}`);
          },
        },

        {
          icon: FaTrashAlt,
          label: "Delete Receipe Tag",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
