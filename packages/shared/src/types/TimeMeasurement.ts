import { Time } from "./units";
import { z } from "zod";

export type TimeMeasurement = {
  magnitude: number;
  unit: Time;
};

export const SegmentedTimeSchema = z.object({
  days: z.number().min(0).max(7),
  hours: z.number().min(0).max(23),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
});

export type SegmentedTime = z.infer<typeof SegmentedTimeSchema>;
