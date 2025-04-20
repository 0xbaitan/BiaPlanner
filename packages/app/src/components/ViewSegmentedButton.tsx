import ButtonGroup from "react-bootstrap/esm/ButtonGroup";

export default function ViewSegmentedButton() {
  return (
    <ButtonGroup className="bp-view-segmented-button">
      <button type="button" className="btn btn-outline-primary">
        Table view
      </button>
      <button type="button" className="btn btn-outline-primary">
        Grid view
      </button>
    </ButtonGroup>
  );
}
