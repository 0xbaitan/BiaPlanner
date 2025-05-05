import { FaExclamationTriangle, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { IProductCategoryExtended } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useContainsNecessaryPermission } from "@/features/authentication/hooks/useContainsNecessaryPermission";
import { useDeleteProductCategoryMutation } from "@/apis/ProductCategoryApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type ProductCategoriesTableProps = {
  data: IProductCategoryExtended[];
  offset?: number;
};

export default function ProductCategoriesTable(props: ProductCategoriesTableProps) {
  const { data, offset } = props;
  const navigate = useNavigate();

  const [deleteProductCategory, { isSuccess, isError, isLoading }] = useDeleteProductCategoryMutation();

  const containsNecessaryPermissions = useContainsNecessaryPermission();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-product-category",
    successMessage: "Product category deleted successfully",
    errorMessage: "Failed to delete product category",
    loadingMessage: "Deleting product category...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IProductCategoryExtended>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteProductCategory(item.id);
    },
  });

  return (
    <TabbedViewsTable<IProductCategoryExtended>
      data={data}
      offset={offset}
      showSerialNumber
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["category", "productCount", "isAllergen"],
          default: true,

          columnDefs: [
            {
              header: "Category Name",
              accessorFn: (row) => row.name,
              accessorKey: "category",
            },
            {
              header: "Product Count",
              accessorFn: (row) => row.productCount ?? 0,
              accessorKey: "productCount",
            },
            {
              header: "Allergen Status",
              cell: (cell) => {
                const row = cell.row.original;
                return row.isAllergen ? (
                  <Pill status="warning">
                    <FaExclamationTriangle size={20} className="pe-2" /> Allergen
                  </Pill>
                ) : null;
              },
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Edit Product Category",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.PRODUCT_CATEGORIES_EDIT, { id: row.id }));
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "productCategory", key: "editItem" }),
        },

        {
          icon: FaTrashAlt,
          label: "Delete Product Category",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
          hideConditionally: () => !containsNecessaryPermissions({ area: "productCategory", key: "deleteItem" }),
        },
      ]}
    />
  );
}
