import MarkShoppingDoneForm from "../components/MarkShoppingDoneForm";
import { useGetShoppingListQuery } from "@/apis/ShoppingListsApi";
import { useParams } from "react-router-dom";

export default function MarkShoppingDonePage() {
  const { id } = useParams();
  const {
    data: shoppingList,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetShoppingListQuery(String(id), {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  console.log("shoppingList", shoppingList);
  return (
    <div>
      {isError && <p>Error: </p>}
      {isLoading && <p>Loading...</p>}
      {isSuccess && shoppingList && <MarkShoppingDoneForm initialValue={shoppingList} />}
    </div>
  );
}
