import { FaCheckCircle, FaExclamationTriangle, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useDeleteConcreteRecipeMutation, useMarkConcreteRecipeAsCookedMutation } from "@/apis/ConcreteRecipeApi";

import { IConcreteRecipe } from "@biaplanner/shared";
import { PiCookingPotFill } from "react-icons/pi";
import Pill from "@/components/Pill";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
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
  const [markCookingDone, { isLoading: isMarkingCookingDone, isError: isMarkingCookingDoneError, isSuccess: isMarkingCookingDoneSuccess }] = useMarkConcreteRecipeAsCookedMutation();

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

  const { notify: notifyAfterMarkingCookingDone } = useSimpleStatusToast({
    successMessage: "Cooking marked as done successfully",
    errorMessage: "Failed to mark cooking as done",
    loadingMessage: "Marking cooking as done...",
    isLoading: isMarkingCookingDone,
    isError: isMarkingCookingDoneError,
    isSuccess: isMarkingCookingDoneSuccess,
    idPrefix: "meal-plan-mark-cooking-done",
  });

  return (
    <TabbedViewsTable<IConcreteRecipe>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["recipeTitle", "mealType", "planDate", "status"],
          columnDefs: [
            {
              header: "Recipe Title",
              accessorFn: (row) => row.recipe?.title ?? "N/A",
              accessorKey: "recipeTitle",
            },
            {
              header: "Fulfilment Status",
              cell: (info) => {
                const isSufficient = info.row.original.isSufficient;
                return (
                  <Pill status={isSufficient ? "success" : "warning"}>
                    {isSufficient ? (
                      <>
                        <FaCheckCircle />
                        &nbsp; Sufficient
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle />
                        &nbsp; Insufficient
                      </>
                    )}
                  </Pill>
                );
              },
              accessorKey: "status",
            },

            {
              header: "Cooking Status",
              cell: (info) => {
                const isCooked = info.row.original.isCooked;
                return (
                  <Pill status={isCooked ? "success" : "warning"}>
                    {isCooked ? (
                      <>
                        <PiCookingPotFill />
                        &nbsp; Cooked
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle />
                        &nbsp; Not Cooked
                      </>
                    )}
                  </Pill>
                );
              },
              accessorKey: "cookingStatus",
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
          icon: FaCheckCircle,
          label: "Mark Cooking Done",
          type: "edit",
          hideConditionally: (row) => row.isCooked || !row.isSufficient,
          onClick: async (row) => {
            notifyAfterMarkingCookingDone();
            await markCookingDone(row.id);
          },
        },
        {
          icon: FaPencilAlt,
          label: "Update Meal Plan",
          type: "edit",
          hideConditionally: (row) => row.isCooked ?? false,
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
