import { Approximates, Volumes, Weights } from "./units";

export type CookingMeasurement = {
  magnitude: number;
  unit: CookingMeasurementUnit;
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
