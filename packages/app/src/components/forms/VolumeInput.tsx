import MagnitudeAndUnitInput, { CustomisedMagnitudeAndUnitProps } from "./MagnitudeAndUnitInput";

import { Volumes } from "@biaplanner/shared/build/types/units/Volumes";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useMemo } from "react";

export type VolumeInputProps = CustomisedMagnitudeAndUnitProps<typeof Volumes>;
export default function VolumeInput(props: VolumeInputProps) {
  const { filter, ...rest } = props;
  const options = useMemo(() => {
    let entries = Object.entries(Volumes).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}(s)`, value }));
    if (!filter) return entries;
    return filter.type === "include" ? entries.filter((entry) => filter.units.includes(entry.value)) : entries.filter((entry) => !filter.units.includes(entry.value));
  }, [filter]);
  return <MagnitudeAndUnitInput<typeof Volumes> {...rest} options={options} />;
}
