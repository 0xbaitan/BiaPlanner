import BrandsTable from "../components/BrandsTable";
import Button from "react-bootstrap/esm/Button";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useNavigate } from "react-router-dom";

export default function AdminBrandsPage() {
  const navigate = useNavigate();
  const { data: brands } = useGetBrandsQuery();

  return (
    <div>
      <h1>Admin Brands Page</h1>

      <Button onClick={() => navigate("./create")}>Create Brand</Button>
      <BrandsTable data={brands ?? []} />
    </div>
  );
}
