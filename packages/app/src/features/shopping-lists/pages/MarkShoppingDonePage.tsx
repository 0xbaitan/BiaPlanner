import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import BrowseProductsOffcanvas from "../components/BrowseProductsOffcanvas";
import MarkShoppingDoneForm from "../components/MarkShoppingDoneForm";
import { useEffect } from "react";
import { useGetShoppingListQuery } from "@/apis/ShoppingListsApi";
import { useParams } from "react-router-dom";

export default function MarkShoppingDonePage() {
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

  const { resetFormState } = useMarkShoppingDoneActions();

  useEffect(() => {
    return () => {
      resetFormState();
    };
  }, [resetFormState]);

  return (
    <div>
      {isError && <p>Error: </p>}
      {isLoading && <p>Loading...</p>}

      {isSuccess && shoppingList && <MarkShoppingDoneForm initialValue={shoppingList} />}
    </div>
  );
}
