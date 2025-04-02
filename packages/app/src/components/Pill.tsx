import "./styles/Pill.scss";

import { HTMLAttributes } from "react";

export type PillProps = HTMLAttributes<HTMLDivElement>;
export default function Pill(props: PillProps) {
  const { className, ...rest } = props;

  return <div {...rest} className={`bp-pill ${className}`} />;
}
