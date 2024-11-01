import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import Home from "@/pages/Home";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";

export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </RoutingTable>
    </Router>
  );
}
