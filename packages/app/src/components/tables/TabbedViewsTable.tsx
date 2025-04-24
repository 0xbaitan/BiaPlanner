import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from "@tanstack/react-table";
import Tabs, { TabsProps } from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import Tab from "react-bootstrap/Tab";

import { useCallback, useMemo, useState } from "react";
import { IconBase } from "react-icons";
import { FaEllipsisV as KebabIcon } from "react-icons/fa";
import BootstrapTable from "react-bootstrap/Table";
import { IconType } from "react-icons";
import Button from "react-bootstrap/esm/Button";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../styles/TabbedViewsTable.scss";
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
    <Tabs {...tabsProps} defaultActiveKey={activeKey} onSelect={(key) => key && handleTabChange(key)} className="bp-tabbed_views_table__tabs">
      {views.map((view) => {
        return <Tab key={`tab-${view.viewKey}`} eventKey={view.viewKey} title={view.viewTitle} className="bp-tabbed_views_table__tab" />;
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
          <Dropdown.Item key={action.label} onClick={() => action.onClick(row)} className="bp-tabbed_views_table__dropdown_item">
            <div className="bp-tabbed_views_table__dropdown_item_content">
              <ActionIcon className="bp-tabbed_views_table__action_icon me-2" />
              <span className="bp-tabbed_views_table__action_label">{action.label}</span>
            </div>
          </Dropdown.Item>
        );
      });

      const kebabMenu = <Dropdown className="bp-tabbed_views_table__kebab_dropdown">{kebabContent}</Dropdown>;
      const kebabMenuPopup = (
        <Popup
          className="bp-tabbed_views_table__popup"
          trigger={
            <button className="bp-tabbed_views_table__kebab_button">
              <KebabIcon size={"16px"} className="bp-tabbed_views_table__kebab_icon" />
            </button>
          }
          position="right center"
          on="click"
          closeOnDocumentClick={true}
        >
          <div className="bp-tabbed_views_table__kebab_menu">{kebabMenu}</div>
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
    <div className="bp-tabbed_views_table__container">
      {tabs}
      <BootstrapTable className="bp-tabbed_views_table__table" bordered hover responsive>
        <thead className="bp-tabbed_views_table__thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bp-tabbed_views_table__header_row">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="bp-tabbed_views_table__header_cell">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bp-tabbed_views_table__tbody">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bp-tabbed_views_table__body_row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="bp-tabbed_views_table__body_cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </BootstrapTable>
    </div>
  );
}
