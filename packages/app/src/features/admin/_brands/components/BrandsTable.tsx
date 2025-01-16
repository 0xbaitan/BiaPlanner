import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import { IBrand } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteBrandMutation } from "@/apis/BrandsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useEffect } from "react";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useNavigate } from "react-router-dom";
import { useSuccessToast } from "@/components/toasts/SuccessToast";

export type BrandsTableProps = {
  data: IBrand[];
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data } = props;
  const navigate = useNavigate();
  const [deleteBrand, { isSuccess, isError, error }] = useDeleteBrandMutation();

  const { notify: notifyDeletionFailure, setPauseNotificationStatus: setDeletionFailureToastPauseStatus } = useErrorToast({ error });
  const { notify: notifyDeletionSuccess, setPauseNotificationStatus: setDeletionSuccessToastPauseStatus } = useSuccessToast({ message: "Brand deleted successfully" });
  useEffect(() => {
    if (isSuccess) {
      setDeletionSuccessToastPauseStatus(true);
      notifyDeletionSuccess();
    } else if (isError) {
      setDeletionFailureToastPauseStatus(true);
      notifyDeletionFailure();
    }
  }, [isSuccess, isError, deleteBrand, notifyDeletionSuccess, notifyDeletionFailure, setDeletionSuccessToastPauseStatus, setDeletionFailureToastPauseStatus]);

  const { notify: notifyDeletion } = useDeletionToast<IBrand>({
    identifierSelector: (brand) => brand.name,
    onConfirm: async (item) => {
      await deleteBrand(item.id);
      setDeletionFailureToastPauseStatus(false);
      setDeletionSuccessToastPauseStatus(false);
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
