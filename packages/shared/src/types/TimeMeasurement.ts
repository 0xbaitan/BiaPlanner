import { Time } from "./units";
import { z } from "zod";

export type TimeMeasurement = {
  magnitude: number;
  unit: Time;
};

export const SegmentedTimeSchema = z.object({
  days: z.coerce.number().min(0).max(7),
  hours: z.coerce.number().min(0).max(23),
  minutes: z.coerce.number().min(0).max(59),
  seconds: z.coerce.number().min(0).max(59),
});

export type SegmentedTime = z.infer<typeof SegmentedTimeSchema>;
