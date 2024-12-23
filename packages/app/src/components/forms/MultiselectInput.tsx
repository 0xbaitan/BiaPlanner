import { useCallback, useMemo, useState } from "react";

import Multiselect from "multiselect-react-dropdown";

type Option = { id: number; name: string };

export type MultiselectInputProps<T extends object> = Omit<typeof Multiselect.defaultProps, "options" | "selectedValues" | "onSelect" | "onRemove"> & {
  list: T[];
  idSelector: (item: T) => number;
  nameSelector: (item: T) => string;
  selectedValues?: T[];
  onSelect?: (selectedList: T[], selectedItem: T) => void | Promise<void>;
  onRemove?: (selectedList: T[], removedItem: T) => void | Promise<void>;
  onChange?: (selectedList: T[], selectedOptions: Option[]) => void | Promise<void>;
};
export default function MultiselectInput<T extends object>(props: MultiselectInputProps<T>) {
  const { list, idSelector, nameSelector, selectedValues: defaultSelectedValues, onSelect: onCustomSelect, onRemove: onCustomRemove, onChange: onCustomChange, ...rest } = props;
  const options = useMemo(() => list.map((item) => ({ id: idSelector(item), name: nameSelector(item) })), [list, idSelector, nameSelector]);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
  });
  const [, setLastTargetedOption] = useState<Option>();

  const getValueCounterPart = useCallback(
    (option: Option) => {
      return list.find((item) => idSelector(item) === option.id);
    },
    [list, idSelector]
  );

  const onSelect = useCallback(
    (selectedList: Option[], selectedItem: Option) => {
      console.log("selectedList", selectedList);
      setSelectedOptions(selectedList);
      setLastTargetedOption(selectedItem);
      onCustomSelect?.(selectedList.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], getValueCounterPart(selectedItem) as T);
      onCustomChange?.(selectedList.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], selectedList);
    },
    [onCustomSelect, getValueCounterPart, onCustomChange]
  );

  const onRemove = useCallback(
    (selectedList: Option[], removedItem: Option) => {
      console.log("selectedList", selectedList);
      setSelectedOptions(selectedList);
      setLastTargetedOption(removedItem);
      onCustomRemove?.(selectedList.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], getValueCounterPart(removedItem) as T);
      onCustomChange?.(selectedList.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], selectedList);
    },
    [onCustomRemove, getValueCounterPart, onCustomChange]
  );

  return <Multiselect {...rest} options={options} selectedValues={selectedOptions} onSelect={onSelect} onRemove={onRemove} displayValue="name" />;
}
