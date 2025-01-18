import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  confirm: ReactNode;
  children: ReactNode;
}

export default function Alert({
  open,
  setOpen,
  title,
  description,
  confirm,
  children,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {confirm}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
