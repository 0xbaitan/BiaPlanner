import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";

import { IQueryProductResultsDto } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useNavigate } from "react-router-dom";

export type ProductsTableProps = {
  data: IQueryProductResultsDto[];
};

export default function ProductsTable(props: ProductsTableProps) {
  const navigate = useNavigate();
  const { data } = props;

  return (
    <TabbedViewsTable<IQueryProductResultsDto>
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
              accessorFn: (row) => row.productName,
              accessorKey: "name",
            },
            {
              header: "Brand",
              accessorFn: (row) => row.brandName ?? "N/A",
              accessorKey: "brandName",
            },
            {
              header: "Categories",
              accessorFn: (row) => row.productCategoryNames?.join(", ") ?? "N/A",
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
            navigate(`./update/${row.productId}`);
          },
        },
        {
          label: "Delete Product",
          type: "delete",
          icon: FaTrash,
          onClick: (row) => {
            console.log("Delete product clicked", row.productId);
          },
        },
      ]}
    />
  );
}
