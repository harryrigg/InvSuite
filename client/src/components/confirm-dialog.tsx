import { useMutation } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import Alert from "@/components/alert";
import { Button } from "@/components/ui/button";

interface Props<TData = unknown, TError = unknown> {
  title?: string;
  description?: string;
  confirmText?: string;
  hook: ReturnType<typeof useMutation<TData, TError>>;
  onSuccess: () => void;
  children: ReactNode;
}

export default function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmText = title,
  hook,
  onSuccess,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = hook;

  return (
    <Alert
      open={open}
      setOpen={setOpen}
      title={title}
      description={description}
      confirm={
        <Button
          onClick={() => mutate(undefined, { onSuccess })}
          disabled={isPending}
        >
          {confirmText}
        </Button>
      }
    >
      {children}
    </Alert>
  );
}
