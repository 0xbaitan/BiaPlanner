import "./styles/404Page.scss"; // Import the updated styles

import { Button } from "react-bootstrap";
import { GrReturn } from "react-icons/gr"; // Import the return icon
import { ReactComponent as NoPageFoundIllustration } from "@/icons/no-page-found.svg"; // Import the new illustration
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bp-not-found-page">
      <div className="bp-not-found-page__content">
        <NoPageFoundIllustration className="bp-not-found-page__illustration" />
        <h1 className="bp-not-found-page__title">Page Not Found</h1>
        <p className="bp-not-found-page__description">Oops! The page you are looking for does not exist.</p>
        <Button className="bp-not-found-page__button" onClick={() => navigate(-1)}>
          <GrReturn size={20} />
          &nbsp;Return to Previous Page
        </Button>
      </div>
    </div>
  );
}
