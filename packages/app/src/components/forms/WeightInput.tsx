import MagnitudeAndUnitInput, { CustomisedMagnitudeAndUnitProps } from "./MagnitudeAndUnitInput";

import { Weights } from "@biaplanner/shared/build/types/units/Weights";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useMemo } from "react";

export type WeightInputProps = CustomisedMagnitudeAndUnitProps<typeof Weights>;
export default function WeightInput(props: WeightInputProps) {
  const { filter, ...rest } = props;
  const options = useMemo(() => {
    let entries = Object.entries(Weights).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}(s)`, value }));
    if (!filter) return entries;
    return filter.type === "include" ? entries.filter((entry) => filter.units.includes(entry.value)) : entries.filter((entry) => !filter.units.includes(entry.value));
  }, [filter]);
  return <MagnitudeAndUnitInput<typeof Weights> {...rest} options={options} />;
}
