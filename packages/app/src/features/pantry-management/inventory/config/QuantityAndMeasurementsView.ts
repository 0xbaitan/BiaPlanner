import { IPantryItem } from "@biaplanner/shared";
import { TabbedViewDef } from "@/components/tables/TabbedViewsTable";

export const QUANTITY_AND_MEASUREMENTS_VIEW_DEF: TabbedViewDef<IPantryItem> = {
  viewKey: "quantity-and-measurements",
  viewTitle: "Quantity & Measurements",
  columnAccessorKeys: ["quantity"],
  default: true,
  columnDefs: [
    {
      header: "Quantity",
      accessorFn: (row) => row.quantity,
      accessorKey: "quantity",
    },
  ],
};
