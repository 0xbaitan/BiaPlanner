import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { FaPencil } from "react-icons/fa6";
import { IShoppingList } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeleteShoppingListMutation } from "@/apis/ShoppingListsApi";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export type ShoppingListTableProps = {
  data: IShoppingList[];
};
export default function ShoppingListTable(props: ShoppingListTableProps) {
  const navigate = useNavigate();
  const [deleteShoppingList, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError }] = useDeleteShoppingListMutation();

  const { notify: notifyOnDeletion } = useDeletionToast<IShoppingList>({
    identifierSelector: (row) => row.title,
    onConfirm: async (row) => {
      notifyAfterDeletion();
      await deleteShoppingList(row.id);
    },
  });

  const { notify: notifyAfterDeletion } = useSimpleStatusToast({
    isLoading: isDeleting,
    isSuccess: isDeleted,
    isError: isDeleteError,
    idPrefix: "delete-shopping-list",
    errorMessage: "Failed to delete shopping list",
    successMessage: "Shopping list deleted successfully",
    loadingMessage: "Deleting shopping list...",
  });

  return (
    <TabbedViewsTable<IShoppingList>
      data={props.data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["title", "plannedDate"],
          default: true,
          columnDefs: [
            {
              header: "Shopping List Title",
              accessorFn: (row) => row.title,
              accessorKey: "title",
            },
            {
              header: "Planned Date",
              accessorFn: (row) => (row.plannedDate ? new Date(row.plannedDate).toLocaleDateString() : "N/A"),
              accessorKey: "plannedDate",
            },
            {
              accessorKey: "Status",
              cell: (cell) => {
                const status = cell.row.original.isShoppingComplete;
                if (status) {
                  return <Pill status="success">Done</Pill>;
                }
                return <Pill status="warning">Pending</Pill>;
              },
            },
          ],
        },
      ]}
      actions={[
        {
          type: "edit",
          label: "Edit shopping list",
          icon: FaPencil,
          onClick(row) {
            navigate(fillParametersInPath(RoutePaths.SHOPPING_LISTS_EDIT, { id: row.id }));
          },
          hideConditionally: (row) => !!row.isShoppingComplete,
        },
        {
          type: "delete",
          label: "Delete shopping list",
          icon: FaTrash,
          onClick(row) {
            notifyOnDeletion(row);
          },
        },
        {
          type: "other",
          label: "Mark as done",
          icon: FaShoppingCart,
          onClick(row) {
            navigate(fillParametersInPath(RoutePaths.SHOPPING_LISTS_MARK_DONE, { id: row.id }));
          },
          hideConditionally: (row) => !!row.isShoppingComplete,
        },
      ]}
    />
  );
}
