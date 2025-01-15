import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export default function AdminBrandsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Admin Brands Page</h1>

      <Button onClick={() => navigate("./create")}>Create Brand</Button>
    </div>
  );
}
