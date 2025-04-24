import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IRecipeTag } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteRecipeTagMutation } from "@/apis/RecipeTagsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type RecipeTagsTableProps = {
  data: IRecipeTag[];
};

export default function RecipeTagsTable(props: RecipeTagsTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteRecipeTag, { isSuccess, isError, isLoading }] = useDeleteRecipeTagMutation();

  const { setItem } = useDefaultStatusToast<IRecipeTag>({
    isSuccess,
    isError,
    isLoading,
    idPrefix: "recipe-tag",
    idSelector: (entity) => entity.id,
    toastProps: {
      autoClose: 5000,
    },
    action: Action.DELETE,
    entityIdentifier: (entity) => entity.name,
  });

  const { notify: notifyDeletion } = useDeletionToast<IRecipeTag>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      setItem(item);
      await deleteRecipeTag(item.id);
    },
  });

  return (
    <TabbedViewsTable<IRecipeTag>
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
              accessorFn: (row) => row.recipes?.length ?? 0,
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
