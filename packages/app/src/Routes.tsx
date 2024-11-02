import { Route, BrowserRouter as Router, Routes as RoutingTable } from "react-router-dom";

import Authenticated from "./features/authentication/components/Authenticated";
import Home from "@/pages/Home";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignUpPage from "./features/authentication/pages/SignUpPage";

export default function Routes() {
  return (
    <Router>
      <RoutingTable>
        <Route
          path="/"
          index
          element={
            <Authenticated>
              <Home />
            </Authenticated>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </RoutingTable>
    </Router>
  );
}
