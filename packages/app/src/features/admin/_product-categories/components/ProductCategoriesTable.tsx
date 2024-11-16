import { IProduct, IProductCategory } from "@biaplanner/shared";
import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

export type ProductCategoriesTableProps = {
  data: IProductCategory[];
};

const GENERAL_DETAILS_VIEW_DEF: TabbedViewDef<IProductCategory> = {
  viewKey: "general-details",
  viewTitle: "General Details",
  columnAccessorKeys: ["category", "productCount"],
  default: true,

  columnDefs: [
    {
      header: "Category Name",
      accessorFn: (row) => row.name,
      accessorKey: "category",
    },
    {
      header: "Product Count",
      accessorFn: (row) => row.products?.length ?? 0,
      accessorKey: "productCount",
    },
  ],
};

export const productCategoriesTableConfig: TabbedViewsTableWithoutDataProps<IProductCategory> = {
  views: [GENERAL_DETAILS_VIEW_DEF],
  showSerialNumber: true,
};

export default function ProductCategoriesTable(props: ProductCategoriesTableProps) {
  const { data } = props;
  return <TabbedViewsTable<IProductCategory> {...productCategoriesTableConfig} data={data} />;
}
