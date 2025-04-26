import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetShoppingListQuery, useMarkShoppingDoneMutation } from "@/apis/ShoppingListsApi";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";
import { useNavigate, useParams } from "react-router-dom";

import BrowseProductsOffcanvas from "../components/BrowseProductsOffcanvas";
import { IUpdateShoppingListExtendedDto } from "@biaplanner/shared";
import MarkShoppingDoneForm from "../components/MarkShoppingDoneForm";
import { RoutePaths } from "@/Routes";
import { Status } from "@/hooks/useStatusToast";
import { useEffect } from "react";
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
