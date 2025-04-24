import BasicLayout from "@/layouts/BasicLayout";
import { Outlet } from "react-router-dom";
import Protected from "@/features/authentication/components/Protected";

function ShoppingListPagesContainer() {
  return (
    <Protected>
      <BasicLayout>
        <div className="p-4">
          <Outlet />
        </div>
      </BasicLayout>
    </Protected>
  );
}

ShoppingListPagesContainer.path = "/shopping-lists/";

export default ShoppingListPagesContainer;
