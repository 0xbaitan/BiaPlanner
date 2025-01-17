import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { IProduct, convertTimeMeasurementToWords } from "@biaplanner/shared";
import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

import { useNavigate } from "react-router-dom";

export type ProductsTableProps = {
  data: IProduct[];
};

export default function ProductsTable(props: ProductsTableProps) {
  const navigate = useNavigate();
  const { data } = props;
  return (
    <TabbedViewsTable<IProduct>
      showSerialNumber
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["product", "categories"],

          default: true,
          columnDefs: [
            {
              header: "Product",
              accessorFn: (row) => row.name,
              accessorKey: "product",
            },
            {
              header: "Brand",
              accessorFn: (row) => row.brand?.name ?? "N/A",
            },
            {
              header: "Categories",
              accessorFn: (row) => row.productCategories?.map((category) => category.name).join(", ") ?? "N/A",
              accessorKey: "categories",
            },
            {
              header: "Time until expiry after opening",
              cell: (cell) => {
                const product = cell.row.original;
                if (!product.canQuicklyExpireAfterOpening || !product.canExpire || !product?.timeTillExpiryAfterOpening) return "N/A";
                return convertTimeMeasurementToWords(product?.timeTillExpiryAfterOpening);
              },
            },
          ],
        },
      ]}
      actions={[
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
