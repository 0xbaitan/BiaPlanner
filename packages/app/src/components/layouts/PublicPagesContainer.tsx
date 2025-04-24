import { Outlet } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";

export default function ProtectedPagesContainer() {
  return (
    <PublicLayout className="p-4">
      <div className="p-4">
        <Outlet />
      </div>
    </PublicLayout>
  );
}
