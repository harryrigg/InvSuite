import { CheckIcon } from "lucide-react";

import { Option } from "@/lib/types/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  inputPlaceholder: string;
  value: string | null;
  onSelect: (value: string) => void;
  values: Option[];
}

export default function SelectCommand({
  inputPlaceholder,
  value,
  onSelect,
  values,
}: Props) {
  return (
    <Command>
      <CommandInput placeholder={inputPlaceholder} />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup>
          {values.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              keywords={[item.label]}
              onSelect={onSelect}
            >
              {item.value === value && <CheckIcon />}
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
