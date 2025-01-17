import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { IBrand, IProduct, IProductCategory } from "@biaplanner/shared";
import TabbedViewsTable, { TabbedViewDef, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { useDeleteBrandMutation } from "@/apis/BrandsApi";
import { useDeleteProductCategoryMutation } from "@/apis/ProductCategoryApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type ProductCategoriesTableProps = {
  data: IProductCategory[];
};

export default function ProductCategoriesTable(props: ProductCategoriesTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteProductCategory, { isSuccess, isError, isLoading }] = useDeleteProductCategoryMutation();

  const { setItem } = useDefaultStatusToast<IProductCategory>({
    isSuccess,
    isError,
    isLoading,
    idPrefix: "product-category",
    idSelector: (entity) => entity.id,
    toastProps: {
      autoClose: 5000,
    },
    action: Action.DELETE,
    entityIdentifier: (entity) => entity.name,
  });

  const { notify: notifyDeletion } = useDeletionToast<IProductCategory>({
    identifierSelector: (entity) => entity.name,
    onConfirm: async (item) => {
      setItem(item);
      await deleteProductCategory(item.id);
    },
  });

  return (
    <TabbedViewsTable<IProductCategory>
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
              accessorFn: (row) => row.products?.length ?? 0,
              accessorKey: "productCount",
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Edit Category",
          type: "edit",
          onClick: (row) => {
            navigate(`./update/${row.id}`);
          },
        },

        {
          icon: FaTrashAlt,
          label: "Delete Category",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
    />
  );
}
