import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { IQueryShoppingListResultsDto, IShoppingList } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { FaPencil } from "react-icons/fa6";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useNavigate } from "react-router-dom";

export type ShoppingListTableProps = {
  data: IShoppingList[];
};
export default function ShoppingListTable(props: ShoppingListTableProps) {
  const navigate = useNavigate();

  return (
    <TabbedViewsTable<IShoppingList>
      data={props.data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["title", "plannedDate"],
          default: true,
          columnDefs: [
            {
              header: "Shopping List Title",
              accessorFn: (row) => row.title,
              accessorKey: "title",
            },
            {
              header: "Planned Date",
              accessorFn: (row) => (row.plannedDate ? new Date(row.plannedDate).toLocaleDateString() : "N/A"),
              accessorKey: "plannedDate",
            },
          ],
        },
      ]}
      actions={[
        {
          type: "edit",
          label: "Edit shopping list",
          icon: FaPencil,
          onClick(row) {
            navigate(fillParametersInPath(RoutePaths.SHOPPING_LISTS_EDIT, { id: row.id }));
          },
        },
        {
          type: "delete",
          label: "Delete shopping list",
          icon: FaTrash,
          onClick(row) {
            console.log("Delete action triggered for row:", row);
          },
        },
        {
          type: "other",
          label: "Mark as done",
          icon: FaShoppingCart,
          onClick(row) {
            if (row.isShoppingComplete) {
              return;
            }

            navigate(fillParametersInPath(RoutePaths.SHOPPING_LISTS_MARK_DONE, { id: row.id }));
          },
        },
      ]}
    />
  );
}
