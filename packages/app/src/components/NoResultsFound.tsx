import "./styles/NoResultsFound.scss";

import { HTMLProps } from "react";
import Heading from "./Heading";
import { ReactComponent as NoItemsFoundIllustration } from "@/icons/no-items-found.svg";

export type NoResultsFoundProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  title?: string;
  description?: string;
};

export default function NoResultsFound(props: NoResultsFoundProps) {
  return (
    <div className={`bp-no_results_found ${props.className || ""}`} {...props}>
      <NoItemsFoundIllustration className="bp-no_results_found__illustration" />
      <div>
        <Heading level={Heading.Level.H2} className="bp-no_results_found__title">
          {props.title || "Hmm... couldn't find any results."}
        </Heading>

        <p className="bp-no_results_found__description">{props.description || "Please try again with a different search term or set of filters."}</p>
      </div>
    </div>
  );
}
