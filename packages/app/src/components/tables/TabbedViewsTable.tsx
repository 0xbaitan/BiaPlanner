import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from "@tanstack/react-table";
import Tabs, { TabsProps } from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Tab from "react-bootstrap/Tab";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useCallback, useMemo, useState } from "react";
import { IconBase } from "react-icons";
import { FaEllipsisV as KebabIcon } from "react-icons/fa";
import BootstrapTable from "react-bootstrap/Table";
import { IconType } from "react-icons";
import Button from "react-bootstrap/esm/Button";

export type TabbedViewsTableActionType = "update" | "delete" | "view" | string;
export type TabbedViewsTableAction<T> = {
  type: TabbedViewsTableActionType;
  label: string;
  icon: IconType;
  onClick: (row: T) => void;
};
export type TabbedViewsTableProps<T> = {
  data: T[];
  showSerialNumber?: boolean;
  tabsProps?: TabsProps;
  views: TabbedViewDef<T>[];
  leftPinnedAccessorKeys?: string[];
  rightPinnedAccessorKeys?: string[];
  actions?: TabbedViewsTableAction<T>[];
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

function useRenderActionsKebabMenu<T>(props: Pick<TabbedViewsTableProps<T>, "actions">) {
  const { actions } = props;
  const renderActionsKebabMenu = useCallback(
    (row: T) => {
      const kebabContent = actions?.map((action) => {
        const ActionIcon = action.icon;
        return (
          <Dropdown.Item key={action.label} onClick={() => action.onClick(row)}>
            <div>
              <ActionIcon className="me-2" />
              {action.label}
            </div>
          </Dropdown.Item>
        );
      });

      const kebabMenu = <Dropdown>{kebabContent}</Dropdown>;
      const kebabMenuPopup = (
        <Popup
          trigger={
            <Button size="sm">
              <KebabIcon size={"16px"} />
            </Button>
          }
          position="right top"
          on="click"
          closeOnDocumentClick={true}
        >
          {kebabMenu}
        </Popup>
      );

      return kebabMenuPopup;
    },

    [actions]
  );

  return renderActionsKebabMenu;
}

function useAllColumnDef<T>(props: TabbedViewsTableProps<T>): ColumnDef<T>[] {
  const { views, showSerialNumber, actions } = props;
  const renderActionsKebabMenu = useRenderActionsKebabMenu({ actions });
  const allColumnDefs = useMemo(() => {
    const collatedViewColDefs = views.reduce((acc, view) => {
      return acc.concat(view.columnDefs);
    }, [] as ColumnDef<T>[]);
    return [
      ...((showSerialNumber ? [{ header: "#", accessorKey: "serialNumber", accessorFn: (_row, index: number) => index + 1 }] : []) satisfies ColumnDef<T>[]),
      ...collatedViewColDefs,
      ...((actions
        ? [
            {
              header: "Actions",
              accessorKey: "actions",
              cell: (cell) => {
                const row = cell.row.original;
                return renderActionsKebabMenu(row);
              },
            },
          ]
        : []) as ColumnDef<T>[]),
    ];
  }, [views, showSerialNumber, actions, renderActionsKebabMenu]);

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
  const { data, views, leftPinnedAccessorKeys, rightPinnedAccessorKeys, showSerialNumber, actions } = props;
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
        right: actions ? [...(rightPinnedAccessorKeys ?? []), "actions"] : rightPinnedAccessorKeys,
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
