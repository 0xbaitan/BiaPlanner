import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from "@tanstack/react-table";
import Tabs, { TabsProps } from "react-bootstrap/Tabs";

import Tab from "react-bootstrap/Tab";

import { useCallback, useMemo, useState } from "react";

import BootstrapTable from "react-bootstrap/Table";
export type TabbedViewsTableProps<T> = {
  data: T[];
  showSerialNumber?: boolean;
  tabsProps?: TabsProps;
  views: TabbedViewDef<T>[];
  leftPinnedAccessorKeys?: string[];
  rightPinnedAccessorKeys?: string[];
};

export type TabbedViewsTableWithoutDataProps<T> = Omit<TabbedViewsTableProps<T>, "data">;

export type TabbedViewDef<T> = {
  viewTitle: string;
  viewKey: string;
  columnDefs: ColumnDef<T>[];
  columnAccessorKeys: string[];
  default?: boolean;
};

type ViewTabsProps<T> = Pick<TabbedViewsTableProps<T>, "views" | "tabsProps"> & {
  activeKey: string;
  handleTabChange: (key: string) => void;
};
function ViewTabs<T>(props: ViewTabsProps<T>) {
  const { views, tabsProps, activeKey, handleTabChange } = props;

  return (
    <Tabs {...tabsProps} defaultActiveKey={activeKey} onSelect={(key) => key && handleTabChange(key)}>
      {views.map((view) => {
        return <Tab key={`tab-${view.viewKey}`} eventKey={view.viewKey} title={view.viewTitle} />;
      })}
    </Tabs>
  );
}

export type UseColumnVisibilityProps<T> = Pick<TabbedViewsTableProps<T>, "leftPinnedAccessorKeys" | "rightPinnedAccessorKeys" | "views"> & {
  activeKey: string;
};

function useAllColumnDefAccessorKeys<T>(views: TabbedViewDef<T>[]): string[] {
  return views.reduce((acc, view) => {
    return acc.concat(view.columnAccessorKeys);
  }, [] as string[]);
}

function useAllColumnDef<T>(props: TabbedViewsTableProps<T>): ColumnDef<T>[] {
  const { views, showSerialNumber } = props;
  const allColumnDefs = useMemo(() => {
    const collatedViewColDefs = views.reduce((acc, view) => {
      return acc.concat(view.columnDefs);
    }, [] as ColumnDef<T>[]);
    return [...((showSerialNumber ? [{ header: "#", accessorKey: "serialNumber", accessorFn: (_row, index: number) => index + 1 }] : []) satisfies ColumnDef<T>[]), ...collatedViewColDefs];
  }, [views, showSerialNumber]);

  return allColumnDefs;
}

function useGetColumnVisibility<T>(props: UseColumnVisibilityProps<T>): (activeViewKey: string) => VisibilityState {
  const { leftPinnedAccessorKeys, rightPinnedAccessorKeys, views } = props;
  const allAccessorKeys = useAllColumnDefAccessorKeys(views);
  const getColumnVisibility = useCallback(
    (activeViewKey: string) => {
      const activeView = views.find((view) => view.viewKey === activeViewKey);
      const visibility: VisibilityState = {};
      allAccessorKeys.forEach((key) => {
        visibility[key] = false;
      });
      activeView?.columnAccessorKeys.forEach((key) => {
        visibility[key] = true;
      });

      leftPinnedAccessorKeys?.forEach((key) => {
        visibility[key] = true;
      });

      rightPinnedAccessorKeys?.forEach((key) => {
        visibility[key] = true;
      });
      return visibility;
    },
    [views, allAccessorKeys, leftPinnedAccessorKeys, rightPinnedAccessorKeys]
  );
  return getColumnVisibility;
}

export default function TabbedViewsTable<T>(props: TabbedViewsTableProps<T>) {
  const { data, views, leftPinnedAccessorKeys, rightPinnedAccessorKeys, showSerialNumber } = props;
  const defaultActiveKey = useMemo(() => views.find((view) => view.default)?.viewKey ?? views[0].viewKey, [views]);
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const allColumnDefs = useAllColumnDef(props);
  const getColumnVisibility = useGetColumnVisibility({ leftPinnedAccessorKeys, rightPinnedAccessorKeys, views, activeKey });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => getColumnVisibility(defaultActiveKey));

  const table = useReactTable({
    data,
    columns: allColumnDefs,
    enableHiding: true,
    enableColumnPinning: true,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnPinning: {
        left: showSerialNumber ? ["serialNumber", ...(leftPinnedAccessorKeys ?? [])] : leftPinnedAccessorKeys,
        right: rightPinnedAccessorKeys,
      },
      columnVisibility: columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const handleTabChange = useCallback(
    (key: string) => {
      setActiveKey(() => key);
      table.setColumnVisibility((visibility) => {
        return {
          ...visibility,
          ...getColumnVisibility(key),
        };
      });
    },
    [getColumnVisibility, table, setActiveKey]
  );

  const tabs = useMemo(() => {
    return <ViewTabs views={views} activeKey={activeKey} handleTabChange={handleTabChange} />;
  }, [views, activeKey, handleTabChange]);

  return (
    <div>
      {tabs}
      <BootstrapTable striped bordered hover>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </BootstrapTable>
    </div>
  );
}
