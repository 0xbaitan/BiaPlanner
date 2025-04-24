import Button from "react-bootstrap/esm/Button";
import PantryItemsTable from "../components/PantryItemsTable";
import { useGetPantryItemsQuery } from "@/apis/PantryItemsApi";
import { useNavigate } from "react-router-dom";

function PantryPage() {
  const { data: pantryItems, isError } = useGetPantryItemsQuery({});
  if (isError || !pantryItems) return <div>Failed to fetch pantry items</div>;
  return (
    <>
      <h1>Inventory</h1>
      <NavigateToAddItemPageButton />
      {/* <PantryItemsTable data={pantryItems} /> */}
      {<PantryItemsTable data={pantryItems} />}
    </>
  );
}

function NavigateToAddItemPageButton() {
  const navigate = useNavigate();
  return <Button onClick={() => navigate("/pantry/inventory/add-item")}>Add New Item</Button>;
}

PantryPage.path = "/pantry/inventory";

export default PantryPage;
