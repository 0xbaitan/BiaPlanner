import "./styles/Alert.scss";

import { Alert as BootstrapAlert } from "react-bootstrap";
import React from "react";

export interface AlertProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  title?: string;
  message: string;
}

export default function Alert({ variant = "info", title, message }: AlertProps) {
  return (
    <BootstrapAlert variant={variant} className="bp-alert">
      {title && <h4 className="bp-alert__title">{title}</h4>}
      <p className="bp-alert__message">{message}</p>
    </BootstrapAlert>
  );
}
