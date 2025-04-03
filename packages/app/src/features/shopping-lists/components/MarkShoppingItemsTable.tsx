import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { IShoppingItem } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { getImagePath } from "@/util/imageFunctions";

export type MarkShoppingItemsTableProps = {
  data: IShoppingItem[];
};
export default function MarkShoppingItemsTable(props: MarkShoppingItemsTableProps) {
  const { data } = props;
  return (
    <TabbedViewsTable<IShoppingItem>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["product", "plannedDate"],
          default: true,
          columnDefs: [
            {
              header: "Product",
              cell: (cell) => {
                const product = cell.row.original.product;
                return (
                  <div>
                    <img src={getImagePath(product?.cover)} alt={product?.name} style={{ width: 50, height: 50 }} />
                    <span>{product?.name}</span>
                    <span>{product?.measurement.magnitude}</span>
                    <span>{product?.measurement.unit}</span>
                  </div>
                );
              },

              accessorKey: "product",
            },
            {
              header: "Quantity",
              accessorFn: (row) => row.quantity,
              accessorKey: "quantity",
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
