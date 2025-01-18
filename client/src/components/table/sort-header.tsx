import { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface Props<TData> {
  title: string;
  column: Column<TData>;
}

export function SortHeader<TData>({ title, column }: Props<TData>) {
  const sortState = column.getIsSorted();
  const isActive = sortState !== false;
  const iconColor = isActive ? "stroke-gray-900" : "stroke-gray-400";
  const iconClassName = `ml-2.5 size-4 ${iconColor}`;

  const icon =
    sortState === false ? (
      <ChevronsUpDown className={iconClassName} />
    ) : sortState === "asc" ? (
      <ChevronUp className={iconClassName} />
    ) : sortState === "desc" ? (
      <ChevronDown className={iconClassName} />
    ) : null;

  return (
    <button
      className="flex items-center font-bold"
      onClick={() => column.toggleSorting(sortState === "asc")}
    >
      {title}
      {icon}
    </button>
  );
}
