import useDefaultStatusToast, { Action } from "@/hooks/useDefaultStatusToast";

import CreatePantryItemForm from "../components/CreatePantryItemForm";
import { Status } from "@/hooks/useStatusToast";
import { useCreatePantryItemMutation } from "@/apis/PantryItemsApi";

export default function AddPantryItemManuallyPage() {
  const [createPantryItem, { isError, isSuccess, isLoading }] = useCreatePantryItemMutation();

  const { setItem } = useDefaultStatusToast({
    isLoading,
    isError,
    isSuccess,
    action: Action.CREATE,
    entityIdentifier: () => "Item",
    redirectContent: {
      applicableStatuses: [Status.SUCCESS],
      redirectButtonText: "Go to Pantry",
      redirectUrl: "/pantry/inventory",
    },
    idPrefix: "pantry-items",
    idSelector: () => "new",
  });
  return (
    <div>
      <h1>AddPantryItemManuallyPage</h1>

      <CreatePantryItemForm
        onSubmit={async (data) => {
          setItem(data);
          const createdPantryItem = await createPantryItem(data);
          console.log("createdPantryItem", createdPantryItem);
        }}
      />
    </div>
  );
}
