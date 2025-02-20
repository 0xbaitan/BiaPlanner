import { IPantryItem } from "@biaplanner/shared";
import { TabbedViewDef } from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";

export const BRAND_AND_CATEGORY_VIEW_DEF: TabbedViewDef<IPantryItem> = {
  viewKey: "brand-and-category",
  viewTitle: "Brand & Category",
  columnAccessorKeys: ["productName", "brand", "categories", "expiryDate"],
  default: true,

  columnDefs: [
    {
      header: "Product Name",
      accessorFn: (row) => row.product?.name ?? "N/A",
      accessorKey: "productName",
    },

    {
      header: "Brand",
      accessorFn: (row) => row.product?.brand?.name ?? "N/A",
      accessorKey: "brand",
    },

    {
      header: "Product Category",
      accessorFn: (row) => row.product?.productCategories?.map((category) => category.name).join(", ") ?? "N/A",
      accessorKey: "categories",
    },
    {
      header: "Expiry Date",
      accessorFn: (row) => (row.expiryDate ? dayjs(row.expiryDate).format("YYYY-MM-DD") : "N/A"),
      accessorKey: "expiryDate",
    },
  ],
};
