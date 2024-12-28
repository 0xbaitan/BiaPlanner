import BasicLayout from "@/layouts/BasicLayout";
import Button from "react-bootstrap/esm/Button";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import PhoneDirectoryTable from "@/features/phone-directory/components/PhoneDirectoryTable";
import Protected from "@/features/authentication/components/Protected";
import SideNavigationBar from "../components/SideNavigationBar";
import { useSendTestReminderMutation } from "@/apis/RemindersApi";
export default function HomePage() {
  const [sendTestEmail, { isSuccess, isError }] = useSendTestReminderMutation();
  return (
    <Protected>
      <BasicLayout>
        <div>Hi. You have Logged In</div>
        <LogoutButton />
        <Button
          variant="primary"
          onClick={async () => {
            await sendTestEmail();
          }}
        >
          Send test email
        </Button>
        <div>
          {isSuccess ? "Email sent successfully" : ""}
          {isError ? "Error sending email" : ""}
        </div>
      </BasicLayout>
    </Protected>
  );
}
