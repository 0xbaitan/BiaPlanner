import { RoutePaths, fillParametersInPath } from "@/Routes";
import { useGetShoppingListQuery, useUpdateShoppingListMutation } from "@/apis/ShoppingListsApi";
import { useNavigate, useParams } from "react-router-dom";

import ShoppingListForm from "../components/ShoppingListForm";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

export default function EditShoppingListPage() {
  const { id } = useParams(); // Get the shopping list ID from the URL
  const { data: shoppingList } = useGetShoppingListQuery(String(id)); // Fetch the shopping list data
  const [updateShoppingList, { isSuccess, isError, isLoading }] = useUpdateShoppingListMutation(); // Mutation for updating the shopping list
  const navigate = useNavigate();

  const { notify: notifyOnUpdateTrigger } = useSimpleStatusToast({
    isError,
    isLoading,
    isSuccess,
    successMessage: "Shopping list updated successfully.",
    errorMessage: "Failed to update shopping list.",
    loadingMessage: "Updating shopping list...",
    idPrefix: "shopping-list-update",
    onFailure: () => {
      console.error("Failed to update shopping list");
    },
    onSuccess: () => {
      console.log("Shopping list updated successfully");
      navigate(fillParametersInPath(RoutePaths.SHOPPING_LISTS_VIEW, { id: String(shoppingList?.id) }));
    },
  });

  if (!shoppingList) return <div>Could not find shopping list</div>;

  return (
    <ShoppingListForm
      type="update"
      initialValue={shoppingList}
      onSubmit={async (shoppingListDto) => {
        notifyOnUpdateTrigger();
        await updateShoppingList({ id: String(shoppingList.id), dto: shoppingListDto });
      }}
    />
  );
}
