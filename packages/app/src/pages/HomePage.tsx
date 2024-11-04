import BasicLayout from "@/layouts/BasicLayout";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import PhoneDirectoryTable from "@/features/phone-directory/components/PhoneDirectoryTable";
import Protected from "@/features/authentication/components/Protected";
import SideNavigationBar from "../components/SideNavigationBar";

export default function HomePage() {
  return (
    <Protected>
      <BasicLayout>
        <div>Hi. You have Logged In</div>
        <LogoutButton />
      </BasicLayout>
    </Protected>
  );
}
