import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SideNavigationBar from "@/components/SideNavigationBar";
import { ToastContainer } from "react-toastify";

export default function BasicLayout(props: { children: React.ReactNode }) {
  return (
    <Container className="d-flex h-100 w-100 m-0 p-0">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss />

      <Row className="w-100 gx-4">
        <Col sm={3} lg={4}>
          <SideNavigationBar />
        </Col>
        <Col>{props.children}</Col>
      </Row>
    </Container>
  );
}
