import AnchoredSectionList from "@/components/AnchoredSectionList";
import CreatePantryItemForm from "../components/CreatePantryItemForm";
import { useForm } from "react-hook-form";

export default function AddPantryItemManuallyPage() {
  return (
    <div>
      <h1>AddPantryItemManuallyPage</h1>
      <AnchoredSectionList
        anchors={[
          {
            id: "required-pantry-item-details-section",
            title: "Required Details",
          },
        ]}
        placement="end"
        show={true}
      >
        <CreatePantryItemForm onSubmit={() => {}} />
      </AnchoredSectionList>
    </div>
  );
}
