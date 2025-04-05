import { ChangeEvent, useState } from "react";

import BasicLayout from "@/layouts/BasicLayout";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import LogoutButton from "@/features/authentication/components/LogoutButton";
import Protected from "@/features/authentication/components/Protected";
import { useLazyGetExpiringPantryItemsQuery } from "@/apis/PantryItemsApi";
import { useSendTestReminderMutation } from "@/apis/RemindersApi";
import { useUploadFileMutation } from "@/apis/FilesApi";

export default function HomePage() {
  const [getExpiringPantryItems, { data, isSuccess, isError, isLoading }] = useLazyGetExpiringPantryItemsQuery();
  const [maxDaysLeft, setMaxDaysLeft] = useState(0);
  return (
    <Protected>
      <BasicLayout>
        <Form.Group className="mb-3">
          <Form.Label>Max days left</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max days left"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMaxDaysLeft(Number(e.target.value));
            }}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => {
            getExpiringPantryItems({ maxDaysLeft });
          }}
        >
          Get Expiring Pantry Items
        </Button>
        {isLoading && <p>Loading...</p>}
        {isSuccess && (
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                {item.product?.name} - {item.expiryDate}
              </li>
            ))}
          </ul>
        )}
        {isError && <p>Error fetching expiring pantry items</p>}
        <LogoutButton />
      </BasicLayout>
    </Protected>
  );
}
