import "../styles/SegmentedTimeInput.scss";

import { useCallback, useEffect, useReducer, useState } from "react";

import { FaCircleCheck } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
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

export function sumSegementedTime(a: SegmentedTime, b: SegmentedTime): SegmentedTime {
  let totalSeconds = a.seconds + b.seconds;
  let totalMinutes = a.minutes + b.minutes;
  let totalHours = a.hours + b.hours;
  let totalDays = a.days + b.days;
  if (totalSeconds >= 60) {
    totalSeconds -= 60;
    totalMinutes += 1;
  }
  if (totalMinutes >= 60) {
    totalMinutes -= 60;
    totalHours += 1;
  }
  if (totalHours >= 24) {
    totalHours -= 24;
    totalDays += 1;
  }
  return {
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

export function stringifySegmentedTime(time: SegmentedTime): string {
  const { days, hours, minutes, seconds } = time;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${padWithZeroes(days)}d`);
  }
  if (hours > 0) {
    parts.push(`${padWithZeroes(hours)}hr`);
  }
  if (minutes > 0) {
    parts.push(`${padWithZeroes(minutes)}min`);
  }
  if (seconds > 0) {
    parts.push(`${padWithZeroes(seconds)}s`);
  }

  return parts.join(" ");
}

function padWithZeroes(value: number): string {
  return String(value).padStart(2, "0");
}

export type SegmentedTimeInputProps = {
  initialValue?: SegmentedTime;
  onChange: (value: SegmentedTime) => void;
  placeholder?: string;
};

export default function SegmentedTimeInput(props: SegmentedTimeInputProps) {
  const { initialValue, onChange, placeholder } = props;
  const [time, dispatch] = useReducer(segmentedTimeReducer, initialValue ?? initialTimeState);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const onMagnitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, actionType: SegmentedTimeActionType, max: number, min: number) => {
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
      onChange({ ...time });
    },
    [onChange, time]
  );

  return (
    <div className={["bp-segmented_time_input", isEditing ? "+focus" : ""].join(" ")} onDoubleClick={() => setIsEditing(true)}>
      <div className={["bp-segmented_time_input--edit", isEditing ? "+active" : ""].join(" ")}>
        <div className="bp-segmented_time_input__fields">
          <input className="bp-segmented_time_input__field--days" type="number" value={String(time.days).padStart(2, "0")} min={0} max={7} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_DAYS, 7, 0)} />
          <span className="bp-segmented_time_input__unit_text--days">d</span>
          <input className="bp-segmented_time_input__field--hours" type="number" min={0} max={23} value={String(time.hours).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_HOURS, 23, 0)} />
          <span className="bp-segmented_time_input__unit_text--hours">hr</span>
          <input className="bp-segmented_time_input__field--minutes" type="number" min={0} max={59} value={String(time.minutes).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_MINUTES, 59, 0)} />
          <span className="bp-segmented_time_input__unit_text--minutes">min</span>
          <input className="bp-segmented_time_input__field--seconds" type="number" min={0} max={59} value={String(time.seconds).padStart(2, "0")} onChange={(e) => onMagnitudeChange(e, SegmentedTimeActionType.SET_SECONDS, 59, 0)} />
          <span className="bp-segmented_time_input__unit_text--seconds">s</span>
        </div>
        <div className="bp-segmented_time_input__actions">
          <button className="bp-segmented_time_input__confirm_button" type="button" onClick={() => setIsEditing(false)}>
            <FaCircleCheck size={20} />
          </button>
        </div>
      </div>
      <div className={["bp-segmented_time_input--display", !isEditing ? "+active" : ""].join(" ")}>
        <div className="bp-segmented_time_input__fields">
          {time.days > 0 && <span>{padWithZeroes(time.days)}d&nbsp;</span>}
          {time.hours > 0 && <span>{padWithZeroes(time.hours)}hr&nbsp;</span>}
          {time.minutes > 0 && <span>{padWithZeroes(time.minutes)}min&nbsp;</span>}
          {time.seconds > 0 && <span>{padWithZeroes(time.seconds)}s&nbsp;</span>}
          {time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0 && <span className="bp-segmented_time_input__placeholder_text">{placeholder ?? "Enter time..."}</span>}
        </div>

        <div className="bp-segmented_time_input__actions">
          <button className="bp-segmented_time_input__edit_button" type="button" onClick={() => setIsEditing(true)}>
            <MdEdit size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
