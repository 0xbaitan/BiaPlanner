import OffCanvas, { OffcanvasPlacement, OffcanvasProps } from "react-bootstrap/Offcanvas";
import React, { useState } from "react";

import AnchorLink from "react-anchor-link-smooth-scroll";
import Button from "react-bootstrap/esm/Button";

export type Anchor = {
  id: string;
  title: string;
};

export type AnchoredSectionListProps = {
  anchors: Anchor[];
  placement: OffcanvasPlacement;

  show: boolean;
} & Omit<OffcanvasProps, "show" | "onHide" | "backdrop" | "placement"> &
  Pick<React.HTMLAttributes<HTMLDivElement>, "children">;

export default function AnchoredSectionList(props: AnchoredSectionListProps) {
  const { anchors, show: defaultShow, children, ...remainingProps } = props;
  console.log(children);
  const [show, setShow] = useState<boolean>(defaultShow);
  return (
    <div>
      <Button onClick={() => setShow(true)}>Toggle</Button>
      <OffCanvas {...remainingProps} show={show} onHide={() => setShow(false)} backdrop={false} as="div">
        <OffCanvas.Header closeButton />

        <OffCanvas.Body>
          <ul className="d-flex flex-column justify-content-center">
            {anchors.map((anchor) => (
              <AnchorLink href={`#${anchor.id}`} key={`anchor-${anchor.id}`}>
                {anchor.title}
              </AnchorLink>
            ))}
          </ul>
        </OffCanvas.Body>
      </OffCanvas>
      {children}
    </div>
  );
}
