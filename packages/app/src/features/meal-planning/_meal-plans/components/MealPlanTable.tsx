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
          columnAccessorKeys: ["name", "description"],
          columnDefs: [
            {
              header: "Recipe title",
              accessorFn: (row) => row.recipe.title,
            },
            {
              header: "Meal Type",
              accessorFn: (row) => row.mealType,
            },
            {
              header: "Plan Date",
              accessorFn: (row) => row.planDate ?? dayjs().format("DD/MM/YYYY"),
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
          onClick: (row) => {},
        },
      ]}
      showSerialNumber={true}
    />
  );
}
