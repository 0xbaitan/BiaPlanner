import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";
import { useGetShoppingListQuery, useMarkShoppingDoneMutation } from "@/apis/ShoppingListsApi";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import BrowseProductsOffcanvas from "../components/BrowseProductsOffcanvas";
import { IUpdateShoppingListExtendedDto } from "@biaplanner/shared";
import MarkShoppingDoneForm from "../components/MarkShoppingDoneForm";
import { Status } from "@/hooks/useStatusToast";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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

  const [markShoppingDone, { isSuccess: isMarkingSuccess, isError: isMarkingError, isLoading: isMarkingLoading }] = useMarkShoppingDoneMutation();

  const { resetFormState } = useMarkShoppingDoneActions();

  const { notify, setItem } = useDefaultStatusToast<IUpdateShoppingListExtendedDto>({
    action: Action.UPDATE,
    entityIdentifier: (item) => item.title ?? "Shopping List",
    idPrefix: "shopping-list",
    isError: isMarkingError,
    isLoading: isMarkingLoading,
    isSuccess: isMarkingSuccess,
    idSelector: (item) => item?.id ?? "new",
    toastProps: {
      autoClose: 5000,
    },
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectUrl: "/shopping-lists",
      redirectButtonText: "Return to Shopping Lists",
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
            setItem(values);
            notify();
            await markShoppingDone(values);
          }}
        />
      )}
    </div>
  );
}

export default MarkShoppingDonePage;
