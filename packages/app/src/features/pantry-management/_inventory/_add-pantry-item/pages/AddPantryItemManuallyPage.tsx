import CreatePantryItemForm from "../components/CreatePantryItemForm";
import { useCreatePantryItemMutation } from "@/apis/PantryItemsApi";

export default function AddPantryItemManuallyPage() {
  const [createPantryItem, { isError, isSuccess }] = useCreatePantryItemMutation();
  return (
    <div>
      <h1>AddPantryItemManuallyPage</h1>

      <CreatePantryItemForm
        onSubmit={async (data) => {
          const createdPantryItem = await createPantryItem(data);
          console.log("createdPantryItem", createdPantryItem);
        }}
      />
    </div>
  );
}
