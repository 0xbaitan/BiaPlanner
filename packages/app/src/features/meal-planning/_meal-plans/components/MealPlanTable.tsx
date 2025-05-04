import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IConcreteRecipe } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
import { useDeleteConcreteRecipeMutation } from "@/apis/ConcreteRecipeApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type MealPlanTableProps = {
  data: IConcreteRecipe[];
};

export default function MealPlanTable(props: MealPlanTableProps) {
  const { data } = props;
  const navigate = useNavigate();
  const [deleteConcreteRecipe, { isLoading: isDeleting, isError: isDeleteError, isSuccess: isDeleteSuccess }] = useDeleteConcreteRecipeMutation();

  const { notify: notifyAfterDeletion } = useSimpleStatusToast({
    successMessage: "Meal plan deleted successfully",
    errorMessage: "Failed to delete meal plan",
    loadingMessage: "Deleting meal plan...",
    isLoading: isDeleting,
    isError: isDeleteError,

    isSuccess: isDeleteSuccess,
    idPrefix: "meal-plan-deletion",
  });

  const { notify: notifyOnDelete } = useDeletionToast<IConcreteRecipe>({
    identifierSelector: (item) => item?.recipe?.title ?? "this meal plan",
    onConfirm: async (item) => {
      notifyAfterDeletion();
      await deleteConcreteRecipe(item.id);
    },
  });

  return (
    <TabbedViewsTable<IConcreteRecipe>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["recipeTitle", "mealType", "planDate"],
          columnDefs: [
            {
              header: "Recipe Title",
              accessorFn: (row) => row.recipe?.title ?? "N/A",
              accessorKey: "recipeTitle",
            },
            {
              header: "Meal Type",
              accessorFn: (row) => {
                const mealType = row.mealType;
                return mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : "N/A";
              },
              accessorKey: "mealType",
            },
            {
              header: "Plan Date",
              accessorFn: (row) => (row.planDate ? dayjs(row.planDate).format("DD/MM/YYYY") : "N/A"),
              accessorKey: "planDate",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Update Meal Plan",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.MEAL_PLANS_EDIT, { id: row.id }));
          },
        },
        {
          icon: FaTrashAlt,
          label: "Delete Meal Plan",
          type: "delete",
          onClick: (row) => {
            notifyOnDelete(row);
          },
        },
      ]}
      showSerialNumber={true}
    />
  );
}
