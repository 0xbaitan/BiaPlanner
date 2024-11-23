import { useCallback, useEffect, useMemo, useState } from "react";

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
  const checkOptionsAreUnique = useCallback(() => {
    const allOptionsAreUnique = options.reduce((acc, option) => {
      return acc && options.filter((o) => o.id === option.id).length === 1;
    }, true);
    if (!allOptionsAreUnique) {
      throw new Error("All options must be unique");
    }
  }, [options]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
  });
  const [lastTargetedOption, setLastTargetedOption] = useState<Option>();

  const getValueCounterPart = useCallback(
    (option: Option) => {
      return list.find((item) => idSelector(item) === option.id);
    },
    [list, idSelector]
  );

  const onSelect = useCallback((selectedList: Option[], selectedItem: Option) => {
    console.log("selectedList", selectedList);
    setSelectedOptions(selectedList);
    setLastTargetedOption(selectedItem);
  }, []);

  const onRemove = useCallback((selectedList: Option[], removedItem: Option) => {
    console.log("selectedList", selectedList);
    setSelectedOptions(selectedList);
    setLastTargetedOption(removedItem);
  }, []);

  const checkSelectedValuesAreValid = useCallback(() => {
    const allSelectedValuesAreValid = selectedOptions.reduce((acc, selectedOption) => {
      return acc && options.find((option) => option.id === selectedOption.id) !== undefined;
    }, true);
    if (!allSelectedValuesAreValid) {
      throw new Error("All selected values must be valid");
    }
  }, [selectedOptions, options]);

  const onChange = useCallback(() => {
    checkOptionsAreUnique();
    checkSelectedValuesAreValid();
    const selectedValues = selectedOptions.map((selectedOption) => getValueCounterPart(selectedOption)) as T[];
    onCustomChange?.(selectedValues, selectedOptions);
  }, [selectedOptions, getValueCounterPart, onCustomChange, checkOptionsAreUnique, checkSelectedValuesAreValid]);

  useEffect(() => {
    onChange();
  }, [onChange]);

  useEffect(() => {
    lastTargetedOption && onCustomSelect?.(selectedOptions.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], getValueCounterPart(lastTargetedOption) as T);
  }, [lastTargetedOption, getValueCounterPart, onCustomSelect, selectedOptions]);

  useEffect(() => {
    lastTargetedOption && onCustomRemove?.(selectedOptions.map((selectedOption) => getValueCounterPart(selectedOption)) as T[], getValueCounterPart(lastTargetedOption) as T);
  }, [lastTargetedOption, getValueCounterPart, onCustomRemove, selectedOptions]);

  return <Multiselect {...rest} options={options} selectedValues={selectedOptions} onSelect={onSelect} onRemove={onRemove} displayValue="name" />;
}
