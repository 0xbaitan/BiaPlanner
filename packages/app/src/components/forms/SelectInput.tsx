import Select, { SelectProps } from "react-dropdown-select";
import { useCallback, useMemo, useState } from "react";

type Option = { id: number; name: string };

export type SelectInputProps<T extends object> = Omit<SelectProps<Option>, "options" | "values" | "onChange"> & {
  list: T[];
  idSelector: (item: T) => number;
  nameSelector: (item: T) => string;
  selectedValues?: T[];
  onChange?: (selectedList: T[], selectedOptions: Option[]) => void | Promise<void>;
};
export default function SelectInput<T extends object>(props: SelectInputProps<T>) {
  const { list, idSelector, nameSelector, selectedValues: defaultSelectedValues, onChange: onCustomChange, ...rest } = props;
  const options: Option[] = useMemo(() => list.map((item) => ({ id: idSelector(item), name: nameSelector(item) })), [list, idSelector, nameSelector]);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
  });

  const getValueCounterPart = useCallback(
    (option: Option) => {
      return list.find((item) => idSelector(item) === option.id);
    },
    [list, idSelector]
  );

  const onChange = useCallback(
    (values: Option[]) => {
      const selectedList = values.map((value) => getValueCounterPart(value)!);
      setSelectedOptions(values);
      onCustomChange?.(selectedList, values);
    },
    [getValueCounterPart, onCustomChange]
  );

  return <Select {...rest} options={options} values={selectedOptions} onChange={onChange} labelField="name" valueField="id" />;
}
