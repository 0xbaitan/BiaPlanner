import { DifficultyLevels } from "@biaplanner/shared";
import Form from "react-bootstrap/Form";
import { FormSelectProps } from "react-bootstrap/FormSelect";
import normaliseEnumKey from "@/util/normaliseEnumKey";
import { useMemo } from "react";

export type DifficultyLevelSelectProps = {
  initialValue?: DifficultyLevels;
  onChange: (difficultyLevel: DifficultyLevels) => void | Promise<void>;
  error?: string;
  label?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function DifficultyLevelSelect(props: DifficultyLevelSelectProps) {
  const { initialValue, onChange, error, label } = props;
  const options = useMemo(() => {
    let entries = Object.entries(DifficultyLevels).map(([key, value]) => ({ label: `${normaliseEnumKey(key)}`, value }));
    return entries;
  }, []);

  return (
    <Form.Group>
      <Form.Label>{label ?? "Difficulty Level"}</Form.Label>
      <Form.Select
        value={initialValue}
        isInvalid={!!error}
        onChange={(e) => {
          const value = String(e.target.value);
          onChange(value as DifficultyLevels);
        }}
      >
        {options.map((option, id) => (
          <option key={id} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
