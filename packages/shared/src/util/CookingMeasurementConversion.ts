import { CookingMeasurement, CookingMeasurementUnit, Volumes, Weights, getCookingMeasurement } from "../types";

import convert from "convert-units";

export default function convertCookingMeasurement(currentMeasurement: CookingMeasurement, targetMeasurementUnit: CookingMeasurementUnit): CookingMeasurement {
  let { magnitude, unit } = currentMeasurement;
  let targetUnit = targetMeasurementUnit;

  if (unit === targetMeasurementUnit) {
    return currentMeasurement;
  }

  const currentCookingMeasurement = getCookingMeasurement(unit);
  const targetCookingMeasurement = getCookingMeasurement(targetMeasurementUnit);

  const currentUnitType = currentCookingMeasurement.type;
  const targetUnitType = targetCookingMeasurement.type;
  if (currentUnitType === targetUnitType) {
    throw new Error("Cannot convert between different types of measurements");
  }

  if (currentUnitType === "approximate") {
    throw new Error("Cannot convert approximate measurements");
  }

  const convertedMagnitude = convert(magnitude)
    .from(unit as Volumes | Weights)
    .to(targetMeasurementUnit as Volumes | Weights)
    .toFixed(4);

  if (isNaN(Number(convertedMagnitude))) {
    throw new Error("Conversion failed");
  }

  return {
    magnitude: Number(convertedMagnitude),
    unit: targetUnit,
  };
}
