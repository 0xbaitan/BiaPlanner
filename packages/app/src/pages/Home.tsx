import LogoutButton from "@/features/authentication/components/LogoutButton";
import PhoneDirectoryTable from "@/features/phone-directory/components/PhoneDirectoryTable";

export default function Home() {
  return (
    <div>
      {" "}
      <div>Hi. You have Logged In</div>
      <LogoutButton />
    </div>
  );
}
