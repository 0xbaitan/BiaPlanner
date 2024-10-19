import {
  Route,
  BrowserRouter as Router,
  Routes as RoutingTable,
} from "react-router-dom";
import Home from "@/pages/Home";
export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route path="/" element={<Home />} />
      </RoutingTable>
    </Router>
  );
}
