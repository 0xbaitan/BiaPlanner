import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import { IConcreteRecipe } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export type MealPlanTableProps = {
  data: IConcreteRecipe[];
};

export default function MealPlanTable(props: MealPlanTableProps) {
  const { data } = props;
  const navigate = useNavigate();

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
            navigate(`./update/${row.id}`);
          },
        },
        {
          icon: FaTrashAlt,
          label: "Delete Meal Plan",
          type: "delete",
          onClick: (row) => {
            console.log(`Delete meal plan with ID: ${row.id}`);
          },
        },
      ]}
      showSerialNumber={true}
    />
  );
}
