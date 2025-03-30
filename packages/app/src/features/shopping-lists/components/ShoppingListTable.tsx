import TabbedViewsTable, { TabbedViewsTableProps } from "@/components/tables/TabbedViewsTable";

import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { IShoppingList } from "@biaplanner/shared";

export type ShoppingListTableProps = {
  data: IShoppingList[];
};
export default function ShoppingListTable(props: ShoppingListTableProps) {
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
              accessorFn: (row) => row.plannedDate,
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
            console.log("Edit action triggered for row:", row);
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
      ]}
    />
  );
}
