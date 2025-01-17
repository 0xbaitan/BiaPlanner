import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

import { IProduct } from "@biaplanner/shared";
import { useNavigate } from "react-router-dom";

export type ProductsTableProps = {
  data: IProduct[];
};

const GENERAL_DETAILS_VIEW_DEF: TabbedViewDef<IProduct> = {
  viewKey: "general-details",
  viewTitle: "General Details",
  columnAccessorKeys: ["product", "categories", "createdBy"],
  default: true,

  columnDefs: [
    {
      header: "Product",
      accessorFn: (row) => row.name,
      accessorKey: "product",
    },
    {
      header: "Categories",
      accessorFn: (row) => row.productCategories?.map((category) => category.name).join(", ") ?? "N/A",
      accessorKey: "categories",
    },
    // {
    //   header: "Created By",
    //   accessorFn: (row) => row.createdBy?.username ?? "N/A",
    //   accessorKey: "createdBy",
    // },
  ],
};

export const productsTableConfig: TabbedViewsTableWithoutDataProps<IProduct> = {
  views: [GENERAL_DETAILS_VIEW_DEF],
  showSerialNumber: true,
};

export default function ProductsTable(props: ProductsTableProps) {
  const navigate = useNavigate();
  const { data } = props;
  return (
    <TabbedViewsTable<IProduct>
      {...productsTableConfig}
      data={data}
      actions={[
        // {
        //   label: "View Product",
        //   type: "view",
        //   icon: FaEye,
        //   onClick: (row) => {
        //     console.log("View product clicked", row.name);
        //   },
        // },
        {
          label: "Edit Product",
          type: "edit",
          icon: FaPencilAlt,
          onClick: (row) => {
            navigate(`./update/${row.id}`);
          },
        },

        {
          label: "Delete Product",
          type: "delete",
          icon: FaTrash,
          onClick: (row) => {
            console.log("Delete product clicked", row.name);
          },
        },
      ]}
    />
  );
}
