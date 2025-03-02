import { Time } from "./units";

export type TimeMeasurement = {
  magnitude: number;
  unit: Time;
};

export type SegmentedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
