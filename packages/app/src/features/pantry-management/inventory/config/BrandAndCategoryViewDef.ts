import { IPantryItem } from "@biaplanner/shared";
import { TabbedViewDef } from "@/components/tables/TabbedViewsTable";

export const BRAND_AND_CATEGORY_VIEW_DEF: TabbedViewDef<IPantryItem> = {
  viewKey: "brand-and-category",
  viewTitle: "Brand & Category",
  columnAccessorKeys: ["brandedItemName", "brand", "product", "category"],
  default: true,

  columnDefs: [
    {
      header: "Branded Name",
      accessorFn: (row) => row.brandedItemName,
      accessorKey: "brandedItemName",
    },

    {
      header: "Brand",
      accessorFn: (row) => row.brand?.brandName ?? "N/A",
      accessorKey: "brand",
    },

    {
      header: "Product Name",
      accessorFn: (row) => row.product.name,
      accessorKey: "product",
    },

    {
      header: "Product Category",
      accessorFn: (row) => row.product.productClassification?.classificationName ?? "N/A",
      accessorKey: "category",
    },
  ],
};
