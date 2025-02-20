import { IPantryItem } from "@biaplanner/shared";
import { TabbedViewDef } from "@/components/tables/TabbedViewsTable";

export const QUANTITY_AND_MEASUREMENTS_VIEW_DEF: TabbedViewDef<IPantryItem> = {
  viewKey: "quantity-and-measurements",
  viewTitle: "Quantity & Measurements",
  columnAccessorKeys: ["quantity", "totalMeasurements", "availableMeasurements", "reservedMeasurements", "consumedMeasurements"],
  default: true,
  columnDefs: [
    {
      header: "Quantity",
      accessorFn: (row) => row.quantity,
      accessorKey: "quantity",
    },
    {
      header: "Total Measurement",
      accessorFn: (row) => (row.totalMeasurements?.magnitude && row.totalMeasurements?.unit ? `${row.totalMeasurements?.magnitude} ${row.totalMeasurements?.unit}` : "N/A"),
      accessorKey: "totalMeasurements",
    },
    {
      header: "Available Measurement",
      accessorFn: (row) => (row.availableMeasurements?.magnitude && row.availableMeasurements.unit ? `${row.availableMeasurements?.magnitude} ${row.availableMeasurements?.unit}` : "N/A"),
      accessorKey: "availableMeasurements",
    },
    {
      header: "Reserved Measurement",
      accessorFn: (row) => (row.reservedMeasurements?.magnitude && row.reservedMeasurements.unit ? `${row.reservedMeasurements?.magnitude} ${row.reservedMeasurements?.unit}` : "N/A"),
      accessorKey: "reservedMeasurements",
    },
    {
      header: "Consumed Measurement",
      accessorFn: (row) => (row.consumedMeasurements?.magnitude && row.consumedMeasurements.unit ? `${row.consumedMeasurements?.magnitude} ${row.consumedMeasurements?.unit}` : "N/A"),
      accessorKey: "consumedMeasurements",
    },
  ],
};
