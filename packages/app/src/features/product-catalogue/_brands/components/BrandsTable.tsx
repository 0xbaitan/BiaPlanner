import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { IBrand, IBrandExtended } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { FaEye } from "react-icons/fa6";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteBrandMutation } from "@/apis/BrandsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type BrandsTableProps = {
  data: IBrandExtended[];
  offset?: number;
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data, offset } = props;
  const navigate = useNavigate();

  const [deleteBrand, { isSuccess, isError, isLoading }] = useDeleteBrandMutation();

  const { setItem } = useDefaultStatusToast<IBrandExtended>({
    isSuccess,
    isError,
    isLoading,
    idPrefix: "brand",
    idSelector: (brand) => brand.id,
    toastProps: {
      autoClose: 5000,
    },
    action: Action.DELETE,
    entityIdentifier: (brand) => brand.name,
  });

  const { notify: notifyDeletion } = useDeletionToast<IBrandExtended>({
    identifierSelector: (brand) => brand.name,
    onConfirm: async (item) => {
      setItem(item);
      await deleteBrand(item.id);
    },
  });

  return (
    <TabbedViewsTable<IBrandExtended>
      data={data}
      offset={offset}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["name", "description", "productCount"],
          default: true,
          columnDefs: [
            {
              header: "Brand Name",
              accessorFn: (row) => row.name,
              accessorKey: "name",
            },
            {
              header: "Description",
              accessorFn: (row) => row.description ?? "N/A",
              accessorKey: "description",
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
          icon: FaEye,
          label: "View Brand",
          type: "view",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.BRANDS_VIEW, { id: row.id }));
          },
        },
        {
          icon: FaPencilAlt,
          label: "Edit Brand",
          type: "edit",
          onClick: (row) => {
            navigate(fillParametersInPath(RoutePaths.BRANDS_EDIT, { id: row.id }));
          },
        },
        {
          icon: FaTrashAlt,
          label: "Delete Brand",
          type: "delete",
          onClick: (row) => {
            notifyDeletion(row);
          },
        },
      ]}
      showSerialNumber={true}
    />
  );
}
