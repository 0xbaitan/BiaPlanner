import "../styles/SegmentedTimeInput.scss";

import { useCallback, useEffect, useReducer } from "react";

import { SegmentedTime } from "@biaplanner/shared";

enum SegmentedTimeActionType {
  SET_DAYS = "SET_DAYS",
  SET_HOURS = "SET_HOURS",
  SET_MINUTES = "SET_MINUTES",
  SET_SECONDS = "SET_SECONDS",
}

type SegmentedTimeAction =
  | { type: SegmentedTimeActionType.SET_DAYS; payload: number }
  | { type: SegmentedTimeActionType.SET_HOURS; payload: number }
  | { type: SegmentedTimeActionType.SET_MINUTES; payload: number }
  | { type: SegmentedTimeActionType.SET_SECONDS; payload: number };

const initialTimeState: SegmentedTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function segmentedTimeReducer(state: SegmentedTime, action: SegmentedTimeAction) {
  switch (action.type) {
    case SegmentedTimeActionType.SET_DAYS:
      return { ...state, days: action.payload };
    case SegmentedTimeActionType.SET_HOURS:
      return { ...state, hours: action.payload };
    case SegmentedTimeActionType.SET_MINUTES:
      return { ...state, minutes: action.payload };
    case SegmentedTimeActionType.SET_SECONDS:
      return { ...state, seconds: action.payload };
    default:
      return state;
  }
}

export type SegmentedTimeInputProps = {
  initialValue?: SegmentedTime;
  onChange: (value: SegmentedTime) => void;
};

export default function SegmentedTimeInput(props: SegmentedTimeInputProps) {
  const { initialValue, onChange } = props;
  const [time, dispatch] = useReducer(segmentedTimeReducer, initialValue ?? initialTimeState);

  useEffect(() => {
    onChange(time);
  }, [time, onChange]);

  const onMagnitudeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, actionType: SegmentedTimeActionType, max: number, min: number) => {
    const rawValue = e.target.value;
    const noNonDigits = rawValue.replace(/\D/g, "");

    let magnitude = parseInt(noNonDigits);

    if (isNaN(magnitude)) {
      magnitude = 0;
    } else if (magnitude > max) {
      magnitude = max;
    } else if (magnitude < min) {
      magnitude = min;
    }

    dispatch({ type: actionType, payload: magnitude });
  }, []);

  return (
    <div className="bp-segmented_time_input">
      <input className="bp-segmented_time_input__field--days" type="number" value={String(time.days).padStart(2, "0")} min={0} max={7} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_DAYS, 7, 0)} />
      <span className="bp-segmented_time_input__unit_text--days">d</span>
      <input className="bp-segmented_time_input__field--hours" type="number" min={0} max={23} value={String(time.hours).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_HOURS, 23, 0)} />
      <span className="bp-segmented_time_input__unit_text--hours">hr</span>
      <input className="bp-segmented_time_input__field--minutes" type="number" min={0} max={59} value={String(time.minutes).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_MINUTES, 59, 0)} />
      <span className="bp-segmented_time_input__unit_text--minutes">min</span>
      <input className="bp-segmented_time_input__field--seconds" type="number" min={0} max={59} value={String(time.seconds).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_SECONDS, 59, 0)} />
      <span className="bp-segmented_time_input__unit_text--seconds">s</span>
    </div>
  );
}
