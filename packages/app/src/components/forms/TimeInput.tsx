import MagnitudeAndUnitInput, { CustomisedMagnitudeAndUnitProps } from "./MagnitudeAndUnitInput";

import { Time } from "@biaplanner/shared/build/types/units/Time";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useMemo } from "react";

export type TimeInputProps = CustomisedMagnitudeAndUnitProps<typeof Time>;
export default function TimeInput(props: TimeInputProps) {
  const { filter, ...rest } = props;
  const options = useMemo(() => {
    let entries = Object.entries(Time).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}(s)`, value }));
    if (!filter) return entries;
    return filter.type === "include" ? entries.filter((entry) => filter.units.includes(entry.value)) : entries.filter((entry) => !filter.units.includes(entry.value));
  }, [filter]);
  return <MagnitudeAndUnitInput<typeof Time> {...rest} options={options} />;
}
