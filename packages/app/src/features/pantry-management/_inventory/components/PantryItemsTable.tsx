import { FaPlateWheat, FaTrash } from "react-icons/fa6";

import { IPantryItem } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { usePantryItemsCrudListActions } from "../reducers/PantryItemsCrudListReducer";

export type PantryItemsTableProps = {
  data: IPantryItem[];
};

export default function PantryItemsTable(props: PantryItemsTableProps) {
  const { openConsumePantryItemModal } = usePantryItemsCrudListActions();
  return (
    <TabbedViewsTable<IPantryItem>
      data={props.data}
      leftPinnedAccessorKeys={["productName"]}
      showSerialNumber
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

        {
          viewKey: "measurement-details",
          viewTitle: "Measurements",
          columnAccessorKeys: ["totalMeasurements", "consumedMeasurements", "availableMeasurements", "reservedMeasurements"],
          columnDefs: [
            {
              header: "Total Measurements",
              accessorKey: "totalMeasurements",
              cell: (cell) => {
                const totalMeasurements = cell.row.original.totalMeasurements;
                if (!totalMeasurements || !totalMeasurements.unit || !totalMeasurements.magnitude) {
                  return <div>N/A</div>;
                }

                return (
                  <div>
                    {totalMeasurements.magnitude} {totalMeasurements.unit}
                  </div>
                );
              },
            },
            {
              header: "Consumed Measurements",
              accessorKey: "consumedMeasurements",
              cell: (cell) => {
                const consumedMeasurements = cell.row.original.consumedMeasurements;
                if (!consumedMeasurements || !consumedMeasurements.unit || !consumedMeasurements.magnitude) {
                  return <div>N/A</div>;
                }

                return (
                  <div>
                    {consumedMeasurements.magnitude} {consumedMeasurements.unit}
                  </div>
                );
              },
            },
            {
              header: "Available Measurements",
              accessorKey: "availableMeasurements",
              cell: (cell) => {
                const availableMeasurements = cell.row.original.availableMeasurements;
                if (!availableMeasurements || !availableMeasurements.unit || !availableMeasurements.magnitude) {
                  return <div>N/A</div>;
                }

                return (
                  <div>
                    {availableMeasurements.magnitude} {availableMeasurements.unit}
                  </div>
                );
              },
            },
            {
              header: "Reserved Measurements",
              accessorKey: "reservedMeasurements",
              cell: (cell) => {
                const reservedMeasurements = cell.row.original.reservedMeasurements;
                if (!reservedMeasurements || !reservedMeasurements.unit || !reservedMeasurements.magnitude) {
                  return <div>N/A</div>;
                }

                return (
                  <div>
                    {reservedMeasurements.magnitude} {reservedMeasurements.unit}
                  </div>
                );
              },
            },
          ],
        },
      ]}
      actions={[
        {
          type: "edit",
          label: "Consume Item",
          icon: FaPlateWheat,
          onClick(row) {
            console.log("Edit action triggered for row:", row);
            openConsumePantryItemModal(row.id);
          },
          hideConditionally: (row) => {
            return row.availableMeasurements?.magnitude === 0 || (row.isExpired ?? false);
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
