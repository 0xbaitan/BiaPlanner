import Button from "react-bootstrap/esm/Button";
import CuisinesTable from "../components/CuisinesTable";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";
import { useNavigate } from "react-router-dom";

export default function AdminCuisinesPage() {
  const { data: cuisines, isSuccess, isError } = useGetCuisinesQuery();

  return (
    <div>
      <h1>Cuisines</h1>
      <NavigateToCreateCuisinesPage />
      {isSuccess && cuisines && <CuisinesTable data={cuisines} />}
      {isError && <div>Failed to fetch product categories</div>}
    </div>
  );
}

function NavigateToCreateCuisinesPage() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate("./create")}>Create Cuisine</Button>;
}
