import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { FaEye } from "react-icons/fa6";
import { IQueryBrandResultsDto } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteBrandMutation } from "@/apis/BrandsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type BrandsTableProps = {
  data: IQueryBrandResultsDto[];
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data } = props;
  const navigate = useNavigate();

  const [deleteBrand, { isSuccess, isError, isLoading }] = useDeleteBrandMutation();

  const { setItem } = useDefaultStatusToast<IQueryBrandResultsDto>({
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

  const { notify: notifyDeletion } = useDeletionToast<IQueryBrandResultsDto>({
    identifierSelector: (brand) => brand.name,
    onConfirm: async (item) => {
      setItem(item);
      await deleteBrand(item.id);
    },
  });

  return (
    <TabbedViewsTable<IQueryBrandResultsDto>
      data={data}
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
