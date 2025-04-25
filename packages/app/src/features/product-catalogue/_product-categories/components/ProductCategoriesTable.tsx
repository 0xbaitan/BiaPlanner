import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IQueryProductCategoryResultsDto } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteProductCategoryMutation } from "@/apis/ProductCategoryApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type ProductCategoriesTableProps = {
  data: IQueryProductCategoryResultsDto[];
};

export default function ProductCategoriesTable(props: ProductCategoriesTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteProductCategory, { isSuccess, isError, isLoading }] = useDeleteProductCategoryMutation();

  const { notify } = useSimpleStatusToast({
    idPrefix: "delete-product-category",
    successMessage: "Product category deleted successfully",
    errorMessage: "Failed to delete product category",
    loadingMessage: "Deleting product category...",
    isSuccess,
    isError,
    isLoading,
  });

  const { notify: notifyDeletion } = useDeletionToast<IQueryProductCategoryResultsDto>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      if (!!item.id) {
        notify();
      }
      await deleteProductCategory(item.id);
    },
  });

  return (
    <TabbedViewsTable<IQueryProductCategoryResultsDto>
      data={data}
      views={[
        {
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
              accessorFn: (row) => row.productCount ?? 0,
              accessorKey: "productCount",
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
        },

        {
          icon: FaTrashAlt,
          label: "Delete Product Category",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
