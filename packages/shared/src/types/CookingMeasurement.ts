import { Approximates, Volumes, Weights } from "./units";

import { z } from "zod";

export type CookingMeasurement = {
  magnitude: number;
  unit: CookingMeasurementUnit;
};

export const CookingMeasurementSchema = {
  magnitude: z.number().min(0, { message: "Magnitude must be greater than 0" }),
  unit: z.union([z.nativeEnum(Weights), z.nativeEnum(Volumes), z.nativeEnum(Approximates)]),
};

export type CookingMeasurementUnit = Weights | Volumes | Approximates;

export enum CookingMeasurementType {
  WEIGHT = "weight",
  VOLUME = "volume",
  APPROXIMATE = "approximate",
}
export interface ICookingMeasurement {
  unit: CookingMeasurementUnit;
  id: string;
  type: CookingMeasurementType;
}

export function getCookingMeasurementList(): ICookingMeasurement[] {
  const weights = Object.entries(Weights).map(([key, value]) => ({ unit: value, id: key, type: CookingMeasurementType.WEIGHT }));
  const volumes = Object.entries(Volumes).map(([key, value]) => ({ unit: value, id: key, type: CookingMeasurementType.VOLUME }));
  const approximates = Object.entries(Approximates).map(([key, value]) => ({ unit: value, id: key, type: CookingMeasurementType.APPROXIMATE }));
  return [...weights, ...volumes, ...approximates];
}

export function getCookingMeasurement(unit: CookingMeasurementUnit): ICookingMeasurement {
  const allMeasurements = getCookingMeasurementList();
  return allMeasurements.find((measurement) => measurement.unit === unit) as ICookingMeasurement;
}
