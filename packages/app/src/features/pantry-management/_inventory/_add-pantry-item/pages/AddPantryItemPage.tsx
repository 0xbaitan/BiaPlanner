import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import PantryItemForm from "../components/CreatePantryItemForm";
import { useNavigate } from "react-router-dom";
export default function AddPantryItemPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Add Pantry Item</h1>
      <h2>Select Input Method</h2>
      <h3>Choose any one method to add new items to your pantry</h3>
      <ButtonGroup>
        <Button disabled>Process Receipt Photo</Button>
        <Button disabled>Process Text Input</Button>
        <Button disabled>Process Voice Input</Button>
        <Button onClick={() => navigate("./manual")}>Add Item Manually</Button>
      </ButtonGroup>
    </div>
  );
}
