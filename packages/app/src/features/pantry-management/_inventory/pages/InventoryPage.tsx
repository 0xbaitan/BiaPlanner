import { useEffect, useState } from "react";

import BasicLayout from "@/layouts/BasicLayout";
import { IPantryItem } from "@biaplanner/shared";
import PantryItemsTable from "../components/PantryItemsTable";
import PantryItemsTable2 from "../components/PantryItemsTable2";
import Protected from "@/features/authentication/components/Protected";
import useAuthenticationState from "@/features/authentication/hooks/useAuthenticationState";
import { useLazyGetPantryItemsQuery } from "@/apis/PantryItemsApi";

export default function InventoryPage() {
  const authenticationState = useAuthenticationState();
  const [getPantryItems, {}] = useLazyGetPantryItemsQuery();
  const [pantryItems, setPantryItems] = useState<IPantryItem[]>([]);

  useEffect(() => {
    let userId: number | undefined;
    if ((userId = authenticationState?.accessTokenObject?.id)) {
      getPantryItems({ userId }).then(({ data }) => {
        if (data) {
          setPantryItems(data);
        }
      });
    } else {
      console.error("No user id found in access token object");
    }
  }, [authenticationState.accessTokenObject, getPantryItems]);

  return (
    <Protected>
      <BasicLayout>
        <div className="p-4">
          {/* <PantryItemsTable data={pantryItems} /> */}
          {<PantryItemsTable2 data={pantryItems} />}
        </div>
      </BasicLayout>
    </Protected>
  );
}
