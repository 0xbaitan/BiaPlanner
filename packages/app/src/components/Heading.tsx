import "./styles/Heading.scss";

import { HTMLProps } from "react";
import React from "react";

enum Level {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

export type HeadingProps = HTMLProps<HTMLHeadingElement> & {
  level: Level;
};

function Heading(props: HeadingProps) {
  const { level, children, ...rest } = props;
  return React.createElement(level, { ...rest, className: `bp-${level} ${props.className ?? ""}` }, children);
}

Heading.Level = Level;
export default Heading;
