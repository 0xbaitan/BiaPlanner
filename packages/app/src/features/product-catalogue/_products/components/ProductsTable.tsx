import { FaPencilAlt, FaTrash } from "react-icons/fa";

import { IProduct } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
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
          columnAccessorKeys: ["name", "brandName", "productCategoryNames"],
          default: true,
          columnDefs: [
            {
              header: "Product Name",
              accessorFn: (row) => row.name,
              accessorKey: "name",
            },
            {
              header: "Brand",
              accessorFn: (row) => row.brand ?? "N/A",
              accessorKey: "brandName",
            },
            {
              header: "Categories",
              accessorFn: (row) => row.productCategories?.join(", ") ?? "N/A",
              accessorKey: "productCategoryNames",
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
            console.log("Delete product clicked", row.id);
          },
        },
      ]}
    />
  );
}
