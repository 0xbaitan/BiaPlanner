import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { stringifySegmentedTime, sumSegementedTime } from "@/components/forms/SegmentedTimeInput";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { FaEye } from "react-icons/fa6";
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
      showSerialNumber
      leftPinnedAccessorKeys={["title"]}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["title", "recipeTags"],

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

        {
          viewKey: "time-taken-and-servings",
          viewTitle: "Time Taken & Servings",
          columnAccessorKeys: ["prepTime", "cookTime", "totalTime", "servings"],
          columnDefs: [
            {
              header: "Preparation Time",
              accessorFn: (row) => {
                let prepTime = row.prepTime ? stringifySegmentedTime(row.prepTime) : null;
                return prepTime;
              },
              accessorKey: "prepTime",
            },
            {
              header: "Cooking Time",
              accessorFn: (row) => {
                let cookTime = row.cookingTime ? stringifySegmentedTime(row.cookingTime) : null;
                return cookTime;
              },
              accessorKey: "cookTime",
            },
            {
              header: "Total Time",
              accessorFn: (row) => {
                const prepTime = row.prepTime ?? null;
                const cookTime = row.cookingTime ?? null;
                let totalTime: string | null = null;
                if (prepTime && cookTime) {
                  totalTime = stringifySegmentedTime(sumSegementedTime(prepTime, cookTime));
                } else if (prepTime) {
                  totalTime = stringifySegmentedTime(prepTime);
                } else if (cookTime) {
                  totalTime = stringifySegmentedTime(cookTime);
                }
                return totalTime;
              },
              accessorKey: "totalTime",
            },
            {
              header: "Servings",
              accessorFn: (row) => row.defaultNumberOfServings ?? null,
              accessorKey: "servings",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaEye,
          label: "View Recipe",
          type: "view",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.RECIPES_VIEW, { id: String(row.id) }));
          },
        },
        {
          icon: FaPencilAlt,
          label: "Edit Recipe",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.RECIPES_EDIT, { id: String(row.id) }));
          },
        },

        {
          icon: FaTrashAlt,
          label: "Delete Recipe",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
