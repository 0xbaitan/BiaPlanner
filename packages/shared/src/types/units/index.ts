import { Approximates } from "./Approximates";
import { Volumes } from "./Volumes";
import { Weights } from "./Weights";

export * from "./Weights";
export * from "./Volumes";
export * from "./Currencies";
export * from "./Time";
export * from "./Approximates";
export * from "./DifficultyLevels";

export type CookingMeasurementUnit = Weights | Volumes | Approximates;

export interface ICookingMeasurement {
  unit: CookingMeasurementUnit;
  id: string;
  type: "weight" | "volume" | "approximate";
}

export function getCookingMeasurementList(): ICookingMeasurement[] {
  const weights = Object.entries(Weights).map(([key, value]) => ({ unit: value, id: key, type: "weight" as const }));
  const volumes = Object.entries(Volumes).map(([key, value]) => ({ unit: value, id: key, type: "volume" as const }));
  const approximates = Object.entries(Approximates).map(([key, value]) => ({ unit: value, id: key, type: "approximate" as const }));
  return [...weights, ...volumes, ...approximates];
}
