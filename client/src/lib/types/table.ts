export type EditingTableEntry<TData> = {
  data: TData;
  saved: boolean;
  errors: {
    path: keyof TData;
    message: string;
  }[];
};

export interface EditableTableMeta<TData> {
  data: TData[];
  setData: (data: TData[]) => void;
  editingData: (EditingTableEntry<TData> | null)[];
  setEditingData: React.Dispatch<
    React.SetStateAction<(EditingTableEntry<TData> | null)[]>
  >;
}
