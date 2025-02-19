import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { SquarePenIcon } from "lucide-react";
import { ChangeEvent, ComponentProps, useMemo, useState } from "react";

import { EditableTableMeta } from "@/lib/types/table";

import { useEditableTableValue } from "@/hooks/table";

import SelectCommand from "@/components/select-command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditableNumberCellProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
  column: Column<TData>;
  getValue: Getter<number>;
}

export function EditableNumberCell<TData>({
  table,
  row,
  column,
  getValue,
}: EditableNumberCellProps<TData>) {
  const meta = table.options.meta as EditableTableMeta<TData>;

  const { isEditing, error, value, setValue, setExternalValue } =
    useEditableTableValue({
      getValue,
      row,
      column,
      meta,
    });

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setExternalValue(Number(e.target.value));
  };

  if (isEditing) {
    return (
      <span className="flex flex-col">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onBlur={onBlur}
        />
        <TableCellError error={error} />
      </span>
    );
  } else {
    return <span>{value}</span>;
  }
}

type EditableSelectCellProps<TData> = {
  table: Table<TData>;
  row: Row<TData>;
  column: Column<TData>;
  getValue: Getter<string>;
} & Omit<ComponentProps<typeof SelectCommand>, "onSelect" | "value">;

export function EditableSelectCell<TData>({
  table,
  row,
  column,
  getValue,
  ...props
}: EditableSelectCellProps<TData>) {
  const meta = table.options.meta as EditableTableMeta<TData>;

  const { isEditing, error, value, setExternalValue } = useEditableTableValue({
    getValue,
    row,
    column,
    meta,
  });

  const [open, setOpen] = useState(false);

  const valueOption = useMemo(
    () => props.values.find((v) => v.value === value) ?? null,
    [value],
  );

  const onSelect = (value: string) => {
    setOpen(false);
    setExternalValue(value);
  };

  return (
    <span className="flex flex-col">
      <span className="flex items-center gap-3 w-full">
        {valueOption?.label ?? (
          <span className="text-zinc-600 italic">Nothing Selected</span>
        )}
        {isEditing && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-7 h-7">
                <SquarePenIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <SelectCommand {...props} onSelect={onSelect} value={value} />
            </PopoverContent>
          </Popover>
        )}
      </span>
      <TableCellError error={error} />
    </span>
  );
}

function TableCellError({ error }: { error: string | undefined }) {
  if (!error) return null;

  return (
    <p className="mt-1.5 text-sm font-medium text-red-500 dark:text-red-900">
      {error}
    </p>
  );
}
