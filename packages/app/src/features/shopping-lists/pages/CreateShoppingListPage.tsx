import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import { IShoppingList } from "@biaplanner/shared";
import ShoppingListForm from "../components/ShoppingListForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreateShoppingListMutation } from "@/apis/ShoppingListsApi";

function CreateShoppingListPage() {
  const [createShoppingList, { isLoading, isError, isSuccess }] = useCreateShoppingListMutation();

  const { setItem } = useDefaultStatusToast<IShoppingList>({
    action: Action.CREATE,
    entityIdentifier: (item) => item.title,
    idPrefix: "shopping-list",
    isError,
    isLoading,
    isSuccess,
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

  return (
    <>
      <ShoppingListForm
        onSubmit={async (values) => {
          setItem(values as IShoppingList);
          await createShoppingList(values);
        }}
        type="create"
        initialValue={undefined}
      />
      ;
    </>
  );
}

CreateShoppingListPage.relativeToContainerPath = "create";

export default CreateShoppingListPage;
