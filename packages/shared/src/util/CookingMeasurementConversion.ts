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
  if (currentUnitType !== targetUnitType) {
    return {
      magnitude: 0,
      unit: targetUnit,
    };
  }

  if (currentUnitType === "approximate") {
    return {
      magnitude: 0,
      unit: targetUnit,
    };
  }

  const convertedMagnitude = convert(magnitude)
    .from(unit as Volumes | Weights)
    .to(targetMeasurementUnit as Volumes | Weights)
    .toFixed(4);

  if (isNaN(Number(convertedMagnitude))) {
    return {
      magnitude: 0,
      unit: targetUnit,
    };
  }

  return {
    magnitude: Number(convertedMagnitude),
    unit: targetUnit,
  };
}
