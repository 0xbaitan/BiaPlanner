import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

import { IProduct } from "@biaplanner/shared";

export type ProductsTableProps = {
  data: IProduct[];
};

const GENERAL_DETAILS_VIEW_DEF: TabbedViewDef<IProduct> = {
  viewKey: "general-details",
  viewTitle: "General Details",
  columnAccessorKeys: ["product", "category", "scope"],
  default: true,

  columnDefs: [
    {
      header: "Product",
      accessorFn: (row) => row.name,
      accessorKey: "product",
    },
    {
      header: "Category",
      accessorFn: (row) => row.productClassification?.classificationName ?? "N/A",
      accessorKey: "category",
    },
    {
      header: "Scope",
      accessorFn: (row) => row.user?.username ?? "All",
      accessorKey: "scope",
    },
  ],
};

export const productsTableConfig: TabbedViewsTableWithoutDataProps<IProduct> = {
  views: [GENERAL_DETAILS_VIEW_DEF],
  showSerialNumber: true,
};

export default function ProductsTable(props: ProductsTableProps) {
  const { data } = props;
  return <TabbedViewsTable<IProduct> {...productsTableConfig} data={data} />;
}
