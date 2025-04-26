import "./styles/Pill.scss";

import { HTMLAttributes } from "react";

export type PillProps = HTMLAttributes<HTMLDivElement> & {
  status?: "success" | "warning" | "error" | "info" | "default";
};
export default function Pill(props: PillProps) {
  const { className, status, ...rest } = props;

  return <div {...rest} className={["bp-pill", status ? `${status}` : "default", props.className].filter(Boolean).join(" ")} />;
}
