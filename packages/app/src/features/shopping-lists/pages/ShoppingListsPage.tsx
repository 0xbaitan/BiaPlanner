import Button from "react-bootstrap/esm/Button";
import Heading from "@/components/Heading";
import { RoutePaths } from "@/Routes";
import ShoppingListTable from "../components/ShoppingListTable";
import { useGetConcreteRecipesQuery } from "@/apis/ConcreteRecipeApi";
import { useGetShoppingListsQuery } from "@/apis/ShoppingListsApi";
import { useNavigate } from "react-router-dom";

function ShoppingListsPage() {
  const navigate = useNavigate();
  const { data: shoppingLists, isLoading, isError, isSuccess } = useGetShoppingListsQuery();

  return (
    <div>
      <Heading level={Heading.Level.H1}>Shopping Lists</Heading>
      <Button onClick={() => navigate(RoutePaths.SHOPPING_LISTS_CREATE)}>Create Shopping List</Button>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading shopping lists</div>}
      {isSuccess && shoppingLists.length === 0 && <div>No shopping lists found</div>}
      {isSuccess && shoppingLists.length > 0 && <ShoppingListTable data={shoppingLists} />}
    </div>
  );
}

export default ShoppingListsPage;
