import BasicLayout from "@/layouts/BasicLayout";
import { Outlet } from "react-router-dom";
import Protected from "@/features/authentication/components/Protected";

export default function ProtectedPagesContainer() {
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
