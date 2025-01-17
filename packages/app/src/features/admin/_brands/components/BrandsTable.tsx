import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IBrand } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteBrandMutation } from "@/apis/BrandsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type BrandsTableProps = {
  data: IBrand[];
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data } = props;
  const navigate = useNavigate();
  const [deleteBrand, { isSuccess, isError, isLoading }] = useDeleteBrandMutation();

  const { setItem } = useDefaultStatusToast<IBrand>({
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

  const { notify: notifyDeletion } = useDeletionToast<IBrand>({
    identifierSelector: (brand) => brand.name,
    onConfirm: async (item) => {
      setItem(item);
      await deleteBrand(item.id);
    },
  });

  return (
    <TabbedViewsTable<IBrand>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["name", "description"],
          columnDefs: [
            {
              header: "Name",
              accessorFn: (row) => row.name,
            },
            {
              header: "Logo",

              cell: (cell) => {
                const fileName = cell.row.original.logo?.fileName;
                return <img src={`http://localhost:4000/uploads/${fileName}`} alt={fileName} style={{ width: 50, height: 50 }} />;
              },
            },
            {
              header: "Description",
              accessorFn: (row) => row.description,
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Update Brand Details",
          type: "edit",
          onClick: (row) => {
            navigate(`./update/${row.id}`);
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
