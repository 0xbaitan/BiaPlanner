import { ChangeEvent, useState } from "react";

import BasicLayout from "@/layouts/BasicLayout";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import Protected from "@/features/authentication/components/Protected";
import { useSendTestReminderMutation } from "@/apis/RemindersApi";
import { useUploadFileMutation } from "@/apis/FilesApi";

export default function HomePage() {
  const [sendTestEmail, { isSuccess, isError }] = useSendTestReminderMutation();
  const [uploadFile, { isSuccess: isFileUploadSuccess, isError: isFileUploadError }] = useUploadFileMutation();
  const [file, setFile] = useState<File | null>(null);
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
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            if (file) {
              formData.append("file", file);
              await uploadFile(formData);
            }
          }}
        >
          <Form.Group>
            <Form.Label>Test File Upload</Form.Label>
            <Form.Control
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            {isFileUploadSuccess ? "File uploaded successfully" : ""}
            {isFileUploadError ? "Error uploading file" : ""}
          </Form.Group>
          <Button type="submit">Upload</Button>
        </Form>
      </BasicLayout>
    </Protected>
  );
}
