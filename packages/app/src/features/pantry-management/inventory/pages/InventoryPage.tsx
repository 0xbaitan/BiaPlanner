import BasicLayout from "@/layouts/BasicLayout";
import Protected from "@/features/authentication/components/Protected";

export default function InventoryPage() {
  return (
    <Protected>
      <BasicLayout>
        <div>Inventory Page</div>
      </BasicLayout>
    </Protected>
  );
}
