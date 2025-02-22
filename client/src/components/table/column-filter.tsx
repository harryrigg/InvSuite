import { ColumnFiltersState } from "@tanstack/react-table";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Fragment, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterOption = {
  label: ReactNode;
  value: string;
};

export type FilterColumnType = "select" | "radio";

export type FilterColumn = {
  label: ReactNode;
  id: string;
  type: FilterColumnType;
  options: FilterOption[];
};

interface Props {
  columns: FilterColumn[];
  state: ColumnFiltersState;
  setState: (state: ColumnFiltersState) => void;
  className?: string;
}

export default function ColumnFilter({
  columns,
  state,
  setState,
  className,
}: Props) {
  const total = state.reduce((acc, v) => acc + (v.value as string[]).length, 0);

  const hasSelected = (column: string) => {
    return (
      (state.find((v) => v.id === column)?.value as string[] | undefined)
        ?.length ?? 0 > 0
    );
  };

  const selectedCount = (column: string) => {
    return (
      (state.find((v) => v.id === column)?.value as string[] | undefined)
        ?.length ?? 0
    );
  };

  const cancelAll = (column: string) => {
    setState(state.filter((v) => v.id !== column));
  };

  const isChecked = (column: string, value: string) => {
    return state.some(
      (v) => v.id === column && (v.value as string[]).includes(value),
    );
  };

  const onCheck = (column: string, value: string, checked: boolean) => {
    if (selectedCount(column) === 1 && !checked) {
      cancelAll(column);
    } else {
      const otherState = state.filter((v) => v.id !== column);
      const currentValue =
        (state.find((v) => v.id === column)?.value as string[] | undefined) ??
        [];
      if (checked) {
        setState([
          ...otherState,
          { id: column, value: [...currentValue, value] },
        ]);
      } else {
        setState([
          ...otherState,
          { id: column, value: currentValue.filter((a) => a !== value) },
        ]);
      }
    }
  };

  const radioValue = (column: string) => {
    return (
      state.find((v) => v.id === column)?.value as string[] | undefined
    )?.[0];
  };

  const onRadioSelect = (column: string, value: string) => {
    setState([
      ...state.filter((v) => v.id !== column),
      { id: column, value: [value] },
    ]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <Button size="sm" variant="outline">
          <SlidersHorizontalIcon />
          Filter
          {total > 0 && ` (${total})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {columns.map((column) => (
          <Fragment key={column.id}>
            <DropdownMenuLabel className="flex items-center gap-2 h-8">
              {column.label}
              {hasSelected(column.id) && (
                <button
                  className="flex items-center gap-[3px] text-xs px-2 py-0.5 border border-zinc-300 rounded-full"
                  onClick={() => cancelAll(column.id)}
                >
                  {column.type == "radio" && "Clear"}
                  {column.type == "select" && selectedCount(column.id)}
                  <XIcon className="size-3" strokeWidth={2.25} />
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {column.type === "select" &&
              column.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isChecked(column.id, option.value)}
                  onCheckedChange={(v) => onCheck(column.id, option.value, v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            {column.type === "radio" && (
              <DropdownMenuRadioGroup
                value={radioValue(column.id)}
                onValueChange={(v) => onRadioSelect(column.id, v)}
              >
                {column.options.map((option) => (
                  <DropdownMenuRadioItem
                    value={option.value}
                    key={option.value}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            )}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
