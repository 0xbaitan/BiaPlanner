import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import { Outlet } from "react-router-dom";

export default function AuthenticationPagesContainer() {
  return (
    <AuthenticationLayout className="p-4">
      <Outlet />
    </AuthenticationLayout>
  );
}
