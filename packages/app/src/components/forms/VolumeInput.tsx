import MagnitudeAndUnitInput, { MagnitudeAndUnitProps } from "./MagnitudeAndUnitInput";

import { Volumes } from "@biaplanner/shared/build/types/units/Volumes";
import normaliseEnumKey from "@/features/phone-directory/util/normaliseEnumKey";
import { useMemo } from "react";

export type VolumeInputProps = Partial<Omit<MagnitudeAndUnitProps<typeof Volumes>, "options">>;
export default function VolumeInput(props: VolumeInputProps) {
  const options = useMemo(() => Object.entries(Volumes).map(([key, value]) => ({ label: normaliseEnumKey(key), value })), []);
  return <MagnitudeAndUnitInput<typeof Volumes> {...props} options={options} />;
}
