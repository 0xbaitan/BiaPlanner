import BrandsTable from "../components/BrandsTable";
import Button from "react-bootstrap/esm/Button";
import { useEffect } from "react";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useNavigate } from "react-router-dom";

export default function AdminBrandsPage() {
  const navigate = useNavigate();
  const { data: brands, isError } = useGetBrandsQuery();

  const { notify: notifyOnError } = useErrorToast({
    error: "An error occurred while retrieving the list of brands",
  });

  useEffect(() => {
    if (isError) {
      notifyOnError();
    }
  }, [isError, notifyOnError]);

  return (
    <div>
      <h1>Admin Brands Page</h1>

      <Button onClick={() => navigate("./create")}>Create Brand</Button>
      <BrandsTable data={brands ?? []} />
    </div>
  );
}
