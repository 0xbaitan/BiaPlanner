import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IProduct } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useContainsNecessaryPermission } from "@/features/authentication/hooks/useContainsNecessaryPermission";
import { useDeleteProductMutation } from "@/apis/ProductsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type ProductsTableProps = {
  data: IProduct[];
  offset?: number;
};

export default function ProductsTable(props: ProductsTableProps) {
  const navigate = useNavigate();
  const { data, offset = 0 } = props;

  const containsNecessaryPermissions = useContainsNecessaryPermission();

  const [deleteProduct, { isSuccess, isError, isLoading }] = useDeleteProductMutation();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-product",
    successMessage: "Product deleted successfully",
    errorMessage: "Failed to delete product",
    loadingMessage: "Deleting product...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IProduct>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteProduct(item.id);
    },
  });

  return (
    <TabbedViewsTable<IProduct>
      offset={offset}
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
              accessorFn: (row) => row.brand?.name ?? "N/A",
              accessorKey: "brandName",
            },
            {
              header: "Categories",
              accessorFn: (row) => row.productCategories?.map((category) => category.name).join(", ") ?? "N/A",
              accessorKey: "productCategoryNames",
            },
          ],
        },
      ]}
      actions={[
        {
          label: "View Product",
          type: "view",
          icon: FaEye,
          onClick: (row) => {
            navigate(
              fillParametersInPath(RoutePaths.PRODUCTS_VIEW, {
                id: row.id,
              })
            );
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "product", key: "viewItem" }),
        },
        {
          label: "Edit Product",
          type: "edit",
          icon: FaPencilAlt,
          onClick: (row) => {
            navigate(
              fillParametersInPath(RoutePaths.PRODUCTS_EDIT, {
                id: row.id,
              })
            );
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "product", key: "editItem" }),
        },
        {
          label: "Delete Product",
          type: "delete",
          icon: FaTrash,
          onClick: (row) => {
            notifyDeletion(row);
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "product", key: "deleteItem" }),
        },
      ]}
    />
  );
}
