import { useGetShoppingListQuery, useMarkShoppingDoneMutation } from "@/apis/ShoppingListsApi";
import { useNavigate, useParams } from "react-router-dom";

import MarkShoppingDoneForm from "../components/MarkShoppingDoneForm";
import { RoutePaths } from "@/Routes";
import { useEffect } from "react";
import { useMarkShoppingDoneActions } from "../reducers/MarkShoppingDoneReducer";
import useSimpleStatusToast from "@/hooks/useSimpleStatusToast";

function MarkShoppingDonePage() {
  const { id } = useParams();
  const {
    data: shoppingList,
    isLoading,
    isError,

    isSuccess,
  } = useGetShoppingListQuery(String(id), {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const navigate = useNavigate();

  const [markShoppingDone, { isSuccess: isMarkingSuccess, isError: isMarkingError, isLoading: isMarkingLoading }] = useMarkShoppingDoneMutation();

  const { resetFormState } = useMarkShoppingDoneActions();

  const { notify } = useSimpleStatusToast({
    idPrefix: "mark-shopping-done",
    errorMessage: "Error marking shopping list as done",
    successMessage: "Shopping list marked as done",
    loadingMessage: "Currently marking shopping list as done...",
    isError: isMarkingError,
    isLoading: isMarkingLoading,
    isSuccess: isMarkingSuccess,
    onSuccess: () => {
      navigate(RoutePaths.SHOPPING_LISTS);
    },
  });
  useEffect(() => {
    return () => {
      resetFormState();
    };
  }, [resetFormState]);

  return (
    <div>
      {isError && <p>Error: </p>}
      {isLoading && <p>Loading...</p>}

      {isSuccess && shoppingList && (
        <MarkShoppingDoneForm
          initialValue={shoppingList}
          onSubmit={async (values) => {
            if (!id) {
              console.error("No id provided");
              return;
            }
            notify();
            await markShoppingDone({ id, dto: values });
          }}
        />
      )}
    </div>
  );
}

export default MarkShoppingDonePage;
