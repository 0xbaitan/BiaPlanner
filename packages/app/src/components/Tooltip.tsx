import "./styles/Tooltip.scss";

import { ArrowContainer, Popover, PopoverPosition } from "react-tiny-popover";
import React, { HTMLProps } from "react";

import { FaQuestionCircle } from "react-icons/fa";
import { IconType } from "react-icons";

export type TooltipProps = HTMLProps<HTMLDivElement> & {
  popoverProps?: React.ComponentProps<typeof Popover>;
  placement?: PopoverPosition[];
  arrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: IconType;
};

export default function Tooltip(props: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { children, placement = "top", arrow = true, open, onOpenChange } = props;
  const Icon = props.icon ?? FaQuestionCircle;
  return (
    <Popover
      isOpen={open ?? isOpen}
      onClickOutside={() => {
        setIsOpen(false);
        onOpenChange?.(false);
      }}
      positions={placement} // preferred position by priority
      padding={10}
      content={({ position, childRect, popoverRect }) =>
        arrow ? (
          <ArrowContainer position={position} childRect={childRect} popoverRect={popoverRect} arrowColor="#000" arrowSize={10} className="tooltip-arrow-container">
            <div className="bp-tooltip__content">{children}</div>
          </ArrowContainer>
        ) : (
          <div className="bp-tooltip__content">{children}</div>
        )
      }
    >
      <div
        {...props}
        className={`bp-tooltip ${props.className ?? ""}`}
        onMouseOver={() => {
          setIsOpen(true);
          onOpenChange?.(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
          onOpenChange?.(false);
        }}
      >
        <Icon />
      </div>
    </Popover>
  );
}
