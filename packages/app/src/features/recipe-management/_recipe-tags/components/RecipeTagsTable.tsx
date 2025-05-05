import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IRecipeTagExtended } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useContainsNecessaryPermission } from "@/features/authentication/hooks/useContainsNecessaryPermission";
import { useDeleteRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type RecipeTagsTableProps = {
  data: IRecipeTagExtended[];
};

export default function RecipeTagsTable(props: RecipeTagsTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteRecipeTag, { isSuccess, isError, isLoading }] = useDeleteRecipeTagMutation();
  const containsNecessaryPermission = useContainsNecessaryPermission();
  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-recipe-tag",
    successMessage: "Recipe tag deleted successfully",
    errorMessage: "Failed to delete recipe tag",
    loadingMessage: "Deleting recipe tag...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IRecipeTagExtended>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
        await deleteRecipeTag(item.id);
      }
    },
  });

  return (
    <TabbedViewsTable<IRecipeTagExtended>
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
          label: "Edit Tag",
          type: "edit",
          hideConditionally: () =>
            !containsNecessaryPermission({
              area: "recipeTag",
              key: "editItem",
            }),
          onClick: (row) => {
            if (!row.id) return;
            navigate(fillParametersInPath(RoutePaths.RECIPE_TAGS_EDIT, { id: row.id }));
          },
        },

        {
          icon: FaTrashAlt,
          label: "Delete Tag",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
          hideConditionally: () =>
            !containsNecessaryPermission({
              area: "recipeTag",
              key: "deleteItem",
            }),
        },
      ]}
    />
  );
}
