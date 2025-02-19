import { Column, Getter, Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { EditableTableMeta } from "@/lib/types/table";

export function useEditableTableValue<TData, TValue>({
  getValue,
  row,
  column,
  meta,
}: {
  getValue: Getter<TValue>;
  row: Row<TData>;
  column: Column<TData>;
  meta: EditableTableMeta<TData>;
}) {
  const editingData = meta.editingData;

  const isEditing = editingData[row.index] !== null;
  const error = editingData[row.index]?.errors?.find(
    (v) => v.path === column.id,
  )?.message;

  const dataValue = getValue();

  const editValue = editingData[row.index]?.data[column.id as keyof TData] as
    | TValue
    | undefined;

  const externalValue = editValue ?? dataValue;

  const [internalValue, setInternalValue] = useState<TValue>(externalValue);
  useEffect(() => {
    setInternalValue(externalValue);
  }, [externalValue]);

  const setExternalValue = (value: TValue) => {
    meta.setEditingData((prev) =>
      prev.map((entry, index) =>
        index === row.index && entry !== null
          ? { ...entry, data: { ...entry.data, [column.id]: value } }
          : entry,
      ),
    );
  };

  return {
    isEditing,
    error,
    setExternalValue,
    value: internalValue,
    setValue: setInternalValue,
  };
}
