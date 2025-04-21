import "../styles/SelectInput.scss";

import Select, { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";
import { useCallback, useEffect, useMemo, useState } from "react";

import Form from "react-bootstrap/Form";

export type Option = { id: string; name: string };
export type SelectAdditionalMethods<T> = {
  getValueCounterPart: (option: Option) => T;
  addOption: (item: T) => void;
  removeOption: (item: T) => void;
};

export type SelectRendererProps<T> = {
  props: SelectProps<Option>;
  state: SelectState<Option>;
  methods: SelectMethods<Option>;
  additionalMethods: SelectAdditionalMethods<T>;
};
export type SelectInputProps<T extends object> = Omit<SelectProps<Option>, "options" | "values" | "onChange" | "dropdownRenderer" | "searchFn" | "itemRenderer" | "contentRenderer"> & {
  list: T[];

  error?: string;
  idSelector: (item: T) => string;
  nameSelector: (item: T) => string;
  selectedValues?: T[];
  onChange?: (selectedList: T[], selectedOptions: Option[]) => void | Promise<void>;
  dropdownRenderer?: (rendererProps: SelectRendererProps<T>) => JSX.Element;
  contentRenderer?: (renderProps: SelectRendererProps<T>) => JSX.Element;
  itemRenderer?: ({
    item,
    itemIndex,
    props,
    state,
    methods,
    additionalMethods,
  }: {
    item: Option;
    itemIndex?: number;
    props: SelectProps<Option>;
    state: SelectState<Option>;
    methods: SelectMethods<Option>;
    additionalMethods: SelectAdditionalMethods<T>;
  }) => JSX.Element;
  searchFn?: (rendererProps: SelectRendererProps<T>) => Option[];
};
export default function SelectInput<T extends object>(props: SelectInputProps<T>) {
  const {
    list,
    idSelector,
    nameSelector,
    selectedValues: defaultSelectedValues,
    className,
    error,
    onChange: onCustomChange,
    dropdownRenderer: customDropdownRender,
    itemRenderer: customItemRenderer,
    contentRenderer: customContentRenderer,
    searchFn: customSearchFn,

    ...rest
  } = props;
  const defaultOptions: Option[] = useMemo(() => list.map((item) => ({ id: idSelector(item), name: nameSelector(item) })), [list, idSelector, nameSelector]);
  const [options, setOptions] = useState<Option[]>(() => defaultOptions ?? []);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
  });

  useEffect(() => {
    setSelectedOptions(() => {
      return defaultSelectedValues?.map((selectedValue) => ({ id: idSelector(selectedValue), name: nameSelector(selectedValue) })) ?? [];
    });
  }, [defaultSelectedValues, idSelector, nameSelector]);

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

  const addOption = useCallback(
    (item: T) => {
      const newOption = { id: idSelector(item), name: nameSelector(item) };
      setOptions((prevOptions) => {
        const existingOption = prevOptions.find((option) => option.id === newOption.id);
        if (!existingOption) {
          return [...prevOptions, newOption];
        }
        return prevOptions;
      });
    },
    [idSelector, nameSelector]
  );

  const removeOption = useCallback(
    (item: T) => {
      const id = idSelector(item);
      setOptions((prevOptions) => {
        const newOptions = prevOptions.filter((option) => option.id !== id);
        return newOptions;
      });
      setSelectedOptions((prevSelectedOptions) => {
        const newSelectedOptions = prevSelectedOptions.filter((option) => option.id !== id);
        return newSelectedOptions;
      });
    },
    [idSelector]
  );

  const dropdownRenderer = useCallback(
    ({ props, state, methods }: { props: SelectProps<Option>; state: SelectState<Option>; methods: SelectMethods<Option> }) => {
      return customDropdownRender?.({ props, state, methods, additionalMethods: { getValueCounterPart, addOption, removeOption } })!;
    },
    [addOption, customDropdownRender, getValueCounterPart, removeOption]
  );

  const itemRenderer = useCallback(
    ({ item, itemIndex = 0, props, state, methods }: { item: Option; itemIndex?: number; props: SelectProps<Option>; state: SelectState<Option>; methods: SelectMethods<Option> }) => {
      return customItemRenderer?.({
        item,
        itemIndex,
        props,
        state,
        methods,
        additionalMethods: { getValueCounterPart, addOption, removeOption },
      })!;
    },
    [addOption, customItemRenderer, getValueCounterPart, removeOption]
  );

  const contentRenderer = useCallback(
    ({ state, props, methods }: { state: SelectState<Option>; props: SelectProps<Option>; methods: SelectMethods<Option> }) => {
      return customContentRenderer?.({
        state,
        props,
        methods,
        additionalMethods: { getValueCounterPart, addOption, removeOption },
      })!;
    },
    [customContentRenderer, getValueCounterPart, addOption, removeOption]
  );

  const searchFn = useCallback(
    ({ state, props, methods }: { state: SelectState<Option>; props: SelectProps<Option>; methods: SelectMethods<Option> }) => {
      return customSearchFn?.({
        state,
        props,
        methods,
        additionalMethods: { getValueCounterPart, addOption, removeOption },
      })!;
    },
    [addOption, customSearchFn, getValueCounterPart, removeOption]
  );

  return (
    <Form.Group className="bp-select">
      <Select
        {...rest}
        {...(customDropdownRender ? { dropdownRenderer } : {})}
        {...(customItemRenderer ? { itemRenderer } : {})}
        {...(customContentRenderer ? { contentRenderer } : {})}
        {...(customSearchFn ? { searchFn } : {})}
        className={["bp-select__input", Boolean(error) ? "+invalid" : "", className ?? ""].join(" ")}
        options={options}
        values={selectedOptions}
        onChange={onChange}
        labelField="name"
        valueField="id"
      />
      <span className={["bp-select__error_message", Boolean(error) ? "+visible" : ""].join(" ")}>{error}</span>
    </Form.Group>
  );
}
