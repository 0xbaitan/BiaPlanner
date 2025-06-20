import { Outlet } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";

export default function AuthenticationPagesContainer() {
  return (
    <PublicLayout className="p-4">
      <Outlet />
    </PublicLayout>
  );
}
