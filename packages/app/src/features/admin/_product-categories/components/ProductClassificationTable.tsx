import { IProduct, IProductClassification } from "@biaplanner/shared";
import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

export type ProductClassificationTableProps = {
  data: IProductClassification[];
};

const GENERAL_DETAILS_VIEW_DEF: TabbedViewDef<IProductClassification> = {
  viewKey: "general-details",
  viewTitle: "General Details",
  columnAccessorKeys: ["category", "productCount"],
  default: true,

  columnDefs: [
    {
      header: "Category Name",
      accessorFn: (row) => row.classificationName,
      accessorKey: "category",
    },
    {
      header: "Product Count",
      accessorFn: (row) => row.products?.length ?? 0,
      accessorKey: "productCount",
    },
  ],
};

export const productClassificationTableConfig: TabbedViewsTableWithoutDataProps<IProductClassification> = {
  views: [GENERAL_DETAILS_VIEW_DEF],
  showSerialNumber: true,
};

export default function ProductClassificationTable(props: ProductClassificationTableProps) {
  const { data } = props;
  return <TabbedViewsTable<IProductClassification> {...productClassificationTableConfig} data={data} />;
}
