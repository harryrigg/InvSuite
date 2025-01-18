import { Search } from "lucide-react";
import { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function FilterInput({ value, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-10 w-full overflow-hidden rounded-md border border-gray-200",
        className,
      )}
    >
      <input
        type="text"
        className="flex-1 px-3 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={value}
        onChange={onChange}
        placeholder="Filter..."
      />
      <span className="flex items-center justify-center bg-gray-200 px-[10px]">
        <Search className="size-5 stroke-gray-500" />
      </span>
    </div>
  );
}
