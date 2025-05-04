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

export function addMeasurements(measurement1: CookingMeasurement, measurement2: CookingMeasurement): CookingMeasurement {
  const type1 = getCookingMeasurement(measurement1.unit).type;
  const type2 = getCookingMeasurement(measurement2.unit).type;
  if (type1 !== type2) {
    throw new Error("Cannot add measurements of different types");
  }

  const convertedMeasurement2 = convertCookingMeasurement(measurement2, measurement1.unit);
  if (convertedMeasurement2.magnitude === 0) {
    return measurement1;
  }

  if (measurement1.unit !== convertedMeasurement2.unit) {
    throw new Error("Cannot add measurements of different units");
  }

  const summedMagnitude = measurement1.magnitude + convertedMeasurement2.magnitude;
  if (isNaN(summedMagnitude)) {
    return {
      magnitude: 0,
      unit: measurement1.unit,
    };
  }

  if (summedMagnitude < 0) {
    return {
      magnitude: 0,
      unit: measurement1.unit,
    };
  }

  return {
    magnitude: summedMagnitude,
    unit: measurement1.unit,
  };
}

export function subtractMeasurements(measurement1: CookingMeasurement, measurement2: CookingMeasurement): CookingMeasurement {
  const type1 = getCookingMeasurement(measurement1.unit).type;
  const type2 = getCookingMeasurement(measurement2.unit).type;
  if (type1 !== type2) {
    throw new Error("Cannot subtract measurements of different types");
  }

  const convertedMeasurement2 = convertCookingMeasurement(measurement2, measurement1.unit);
  if (convertedMeasurement2.magnitude === 0) {
    return measurement1;
  }

  if (measurement1.unit !== convertedMeasurement2.unit) {
    throw new Error("Cannot subtract measurements of different units");
  }

  const subtractedMagnitude = measurement1.magnitude - convertedMeasurement2.magnitude;
  if (isNaN(subtractedMagnitude)) {
    return {
      magnitude: 0,
      unit: measurement1.unit,
    };
  }

  if (subtractedMagnitude < 0) {
    return {
      magnitude: 0,
      unit: measurement1.unit,
    };
  }

  return {
    magnitude: subtractedMagnitude,
    unit: measurement1.unit,
  };
}
