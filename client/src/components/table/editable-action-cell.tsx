import { Row, Table } from "@tanstack/react-table";
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { z } from "zod";

import { EditableTableMeta } from "@/lib/types/table";

import { Button } from "@/components/ui/button";

interface Props<TData> {
  table: Table<TData>;
  row: Row<TData>;
  schema: z.ZodSchema<TData>;
}

export function EditableTableActionCell<TData>({
  table,
  row,
  schema,
}: Props<TData>) {
  const meta = table.options.meta as EditableTableMeta<TData>;

  const isEditing = meta.editingData[row.index] !== null;
  const isExistingEditRow =
    isEditing && meta.editingData[row.index]!.saved === true;

  const stopEditing = () => {
    meta.setEditingData((prev) =>
      prev.map((data, index) => (index === row.index ? null : data)),
    );
  };

  const onEdit = () => {
    meta.setEditingData((prev) =>
      prev.map((entry, index) =>
        index === row.index
          ? { data: row.original, saved: true, errors: [] }
          : entry,
      ),
    );
  };

  const onDelete = () => {
    meta.setData(meta.data.filter((_, index) => index !== row.index));
    meta.setEditingData((prev) =>
      prev.filter((_, index) => index !== row.index),
    );
  };

  const onSave = () => {
    const editingRow = meta.editingData[row.index]!;

    const result = schema.safeParse(editingRow.data);

    if (result.success) {
      meta.setData(
        meta.data.map((data, index) =>
          index === row.index ? editingRow.data : data,
        ),
      );
      stopEditing();
    } else {
      const errors = result.error.issues.map((issue) => ({
        path: String(issue.path[0]) as keyof TData,
        message: issue.message,
      }));

      meta.setEditingData((prev) =>
        prev.map((entry, index) =>
          index === row.index && entry !== null ? { ...entry, errors } : entry,
        ),
      );
    }
  };
  const onCancel = () => {
    if (isExistingEditRow) {
      stopEditing();
    } else {
      onDelete();
    }
  };

  return (
    <div className="flex items-center justify-end">
      {isEditing ? (
        <>
          <Button size="icon" variant="ghost" onClick={onCancel} type="button">
            <XIcon />
          </Button>
          <Button size="icon" variant="ghost" onClick={onSave} type="button">
            <CheckIcon />
          </Button>
        </>
      ) : (
        <>
          <Button size="icon" variant="ghost" onClick={onDelete} type="button">
            <Trash2Icon />
          </Button>
          <Button size="icon" variant="ghost" onClick={onEdit} type="button">
            <PencilIcon />
          </Button>
        </>
      )}
    </div>
  );
}
