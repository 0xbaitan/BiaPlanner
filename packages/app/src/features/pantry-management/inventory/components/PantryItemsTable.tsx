import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import BootstrapTable from "react-bootstrap/Table";
import { IPantryItem } from "@biaplanner/shared";

export type PantryItemsTableProps = {
  data: IPantryItem[];
};

export default function PantryItemsTable(props: PantryItemsTableProps) {
  const { data } = props;
  const columnDefs: ColumnDef<IPantryItem>[] = [
    {
      accessorFn: (row) => row.brandedItemName,
      header: "Item Name",
    },
    {
      accessorFn: (row) => row.quantity,
      header: "Quantity",
    },
    {
      accessorFn: (row) => row.expiryDate,
      header: "Date of Expiry",
      enableHiding: true,
      cell: (cell) => (cell.getValue() ? new Date(cell.getValue() as string).toLocaleDateString() : "N/A"),
    },
  ];

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <BootstrapTable striped bordered hover>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </BootstrapTable>
  );
}
