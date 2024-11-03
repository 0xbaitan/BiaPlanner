import BasicLayout from "@/layouts/BasicLayout";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import PhoneDirectoryTable from "@/features/phone-directory/components/PhoneDirectoryTable";
import SideNavigationBar from "../components/SideNavigationBar";

export default function HomePage() {
  return (
    <BasicLayout>
      <div>Hi. You have Logged In</div>
      <LogoutButton />
    </BasicLayout>
  );
}
