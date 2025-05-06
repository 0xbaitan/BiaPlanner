import { Approximates, Volumes, Weights } from "./units";

import { z } from "zod";

export type CookingMeasurement = {
  magnitude: number;
  unit: CookingMeasurementUnit;
};

export const CookingMeasurementSchema = {
  magnitude: z.coerce.number().refine((value) => value > 0, {
    message: "Magnitude must be greater than 0",
  }),
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

export function getMeasurementLabel(unit: CookingMeasurementUnit): string {
  const measurement = getCookingMeasurement(unit);
  switch (measurement.unit) {
    case Weights.GRAM:
      return "grams (g)";
    case Weights.KILOGRAM:
      return "kilograms (kg)";
    case Weights.POUND:
      return "pounds (lb)";
    case Weights.OUNCE:
      return "ounces (oz)";
    case Volumes.LITRE:
      return "litres (L)";
    case Volumes.MILLILITRE:
      return "millilitres (mL)";
    case Volumes.CUP:
      return "cups (c)";
    case Volumes.TABLESPOON:
      return "tablespoons (tbsp)";
    case Volumes.TEASPOON:
      return "teaspoons (tsp)";
    case Volumes.FLUID_OUNCE:
      return "fluid ounces (fl oz)";
    case Volumes.PINT:
      return "pints (pt)";
    case Volumes.QUART:
      return "quarts (qt)";
    case Volumes.GALLON:
      return "gallons (gal)";
    case Approximates.DASH:
      return "dashes";
    case Approximates.PINCH:
      return "pinches";
    case Approximates.DROP:
      return "drops";
    case Approximates.PIECE:
      return "pieces";
    case Approximates.SMIDGEN:
      return "smidgens";
    case Weights.MICROGRAM:
      return "micrograms (mcg)";
    case Weights.MILLIGRAM:
      return "milligrams (mg)";
    case Volumes.CUBIC_CENTIMETRE:
      return "cubic centimeters (cc)";
    case Volumes.CUBIC_INCH:
      return "cubic inches (in³)";
    case Volumes.CUBIC_METRE:
      return "cubic meters (m³)";
    default:
      return "N/A";
  }
}
