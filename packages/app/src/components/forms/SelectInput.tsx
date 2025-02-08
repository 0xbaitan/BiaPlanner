import Select, { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";
import { useCallback, useMemo, useState } from "react";

export type Option = { id: string; name: string };

export type SelectInputProps<T extends object> = Omit<SelectProps<Option>, "options" | "values" | "onChange" | "dropdownRenderer" | "itemRenderer"> & {
  list: T[];
  idSelector: (item: T) => string;
  nameSelector: (item: T) => string;
  selectedValues?: T[];
  onChange?: (selectedList: T[], selectedOptions: Option[]) => void | Promise<void>;
  dropdownRenderer?: (rendererProps: {
    props: SelectProps<Option>;
    state: SelectState<Option>;
    methods: SelectMethods<Option>;

    additionalMethods: {
      getValueCounterPart: (option: Option) => T;
    };
  }) => JSX.Element;
  itemRenderer?: (renderProps: {
    item: Option;
    itemIndex: number;
    props: SelectProps<Option>;
    state: SelectState<Option>;
    methods: SelectMethods<Option>;
    additionalMethods: {
      getValueCounterPart: (option: Option) => T;
    };
  }) => JSX.Element;
};
export default function SelectInput<T extends object>(props: SelectInputProps<T>) {
  const { list, idSelector, nameSelector, selectedValues: defaultSelectedValues, onChange: onCustomChange, dropdownRenderer: customDropdownRender, itemRenderer: customItemRenderer, ...rest } = props;
  const options: Option[] = useMemo(() => list.map((item) => ({ id: idSelector(item), name: nameSelector(item) })), [list, idSelector, nameSelector]);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
  });

  const getValueCounterPart = useCallback(
    (option: Option) => {
      return list.find((item) => idSelector(item) === option.id)!;
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

  const dropdownRenderer = useCallback(
    ({ props, state, methods }: { props: SelectProps<Option>; state: SelectState<Option>; methods: SelectMethods<Option> }) => {
      return customDropdownRender?.({ props, state, methods, additionalMethods: { getValueCounterPart } })!;
    },
    [customDropdownRender, getValueCounterPart]
  );

  const itemRenderer = useCallback(
    ({ item, itemIndex = 0, props, state, methods }: { item: Option; itemIndex?: number; props: SelectProps<Option>; state: SelectState<Option>; methods: SelectMethods<Option> }) => {
      return customItemRenderer?.({
        item,
        itemIndex,
        props,
        state,
        methods,
        additionalMethods: { getValueCounterPart },
      })!;
    },
    [customItemRenderer, getValueCounterPart]
  );

  return <Select {...rest} {...(customDropdownRender ? { dropdownRenderer } : {})} {...(customItemRenderer ? { itemRenderer } : {})} options={options} values={selectedOptions} onChange={onChange} labelField="name" valueField="id" />;
}
