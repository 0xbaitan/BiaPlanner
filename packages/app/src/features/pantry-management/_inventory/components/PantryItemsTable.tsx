import { FaPencil, FaTrash } from "react-icons/fa6";

import { IPantryItem } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";

export type PantryItemsTableProps = {
  data: IPantryItem[];
};

export default function PantryItemsTable(props: PantryItemsTableProps) {
  return (
    <TabbedViewsTable<IPantryItem>
      data={props.data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["productName", "quantity", "expiryDate"],
          columnDefs: [
            {
              header: "Product Name",
              accessorFn: (row) => row.product?.name || "N/A",
              accessorKey: "productName",
            },
            {
              header: "Quantity",
              accessorFn: (row) => row.quantity,
              accessorKey: "quantity",
            },
            {
              header: "Expiry Date",
              accessorFn: (row) => (row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : "N/A"),
              accessorKey: "expiryDate",
            },
          ],
        },
      ]}
      actions={[
        {
          type: "edit",
          label: "Edit Pantry Item",
          icon: FaPencil,
          onClick(row) {
            console.log("Edit action triggered for row:", row);
          },
        },
        {
          type: "delete",
          label: "Delete Pantry Item",
          icon: FaTrash,
          onClick(row) {
            console.log("Delete action triggered for row:", row);
          },
        },
      ]}
    />
  );
}
