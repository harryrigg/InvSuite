import { Trash2, TriangleAlert } from "lucide-react";

import Alert from "@/components/alert";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mutate: () => void;
  isPending: boolean;
  title: string;
  confirmText?: string;
}

export default function DeleteButton({
  open,
  setOpen,
  mutate,
  isPending,
  title,
  confirmText = title,
}: Props) {
  return (
    <Alert
      open={open}
      setOpen={setOpen}
      title={title}
      description={
        <span className="flex items-center gap-2">
          <TriangleAlert size={18} /> This cannot be undone
        </span>
      }
      confirm={
        <Button onClick={() => mutate()} disabled={isPending}>
          {confirmText}
        </Button>
      }
    >
      <Button size="xs" variant="outline" onClick={() => setOpen(true)}>
        <Trash2 /> Delete
      </Button>
    </Alert>
  );
}
