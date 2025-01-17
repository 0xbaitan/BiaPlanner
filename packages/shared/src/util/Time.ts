import { Time, TimeMeasurement } from "../types";

import ms from "ms";

export function convertDurationStringToMilli(str: string): number {
  return ms(str).valueOf();
}

export function convertTimeMeasurementToWords(time: TimeMeasurement): string {
  const multipler = time.magnitude > 1 ? "s" : "";

  switch (time.unit) {
    case Time.HOUR:
      return `${time.magnitude} hour${multipler}`;
    case Time.MINUTE:
      return `${time.magnitude} minute${multipler}`;
    case Time.SECOND:
      return `${time.magnitude} second${multipler}`;
    case Time.MILLISECOND:
      return `${time.magnitude} millisecond${multipler}`;
    case Time.DAY:
      return `${time.magnitude} day${multipler}`;
    case Time.WEEK:
      return `${time.magnitude} week${multipler}`;
    case Time.MONTH:
      return `${time.magnitude} month
      ${multipler}`;
    case Time.YEAR:
      return `${time.magnitude} year${multipler}`;
    case Time.DECADE:
      return `${time.magnitude} decade${multipler}`;
    case Time.CENTURY:
      return `${time.magnitude} century${multipler}`;
    case Time.MILLENNIUM:
      return `${time.magnitude} millennium${multipler}`;
    default:
      return "N/A";
  }
}
