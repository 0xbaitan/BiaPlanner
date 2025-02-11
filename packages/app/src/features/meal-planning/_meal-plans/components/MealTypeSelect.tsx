import { IMealType, MEAL_TYPES, MealTypes } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

export type MealTypeSelectProps = Omit<SelectInputProps<IMealType>, "list" | "idSelector" | "nameSelector" | "onChange" | "multi"> & {
  onChange: (mealType: MealTypes) => void | Promise<void>;
};
export default function MealTypeSelect(props: MealTypeSelectProps) {
  const { onChange, ...rest } = props;

  return (
    <SelectInput<IMealType>
      {...rest}
      onChange={([selectedMealType]) => {
        onChange(selectedMealType.value as MealTypes);
      }}
      multi={false}
      idSelector={(mealType) => mealType.id}
      list={MEAL_TYPES}
      nameSelector={(mealType) => mealType.value}
    />
  );
}
