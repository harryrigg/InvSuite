import { Pencil } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { InventoryItem } from "@/lib/types/inventory";
import { toastGenericError } from "@/lib/utils";

import { useDeleteInventoryItemImage } from "@/hooks/queries/inventory/delete-image";
import { useFetchInventoryItemImage } from "@/hooks/queries/inventory/fetch-image";
import { useUploadInventoryItemImage } from "@/hooks/queries/inventory/upload-image";

import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  item: InventoryItem;
  query: ReturnType<typeof useFetchInventoryItemImage>;
}

export function ItemImage({ query, item }: Props) {
  const editButton = (
    <Button
      size="icon"
      className="absolute right-0 top-0 m-2.5 rounded-full bg-white/70 text-black shadow hover:bg-white/90"
      disabled={query.data === undefined}
    >
      <Pencil />
    </Button>
  );

  return (
    <figure className="relative flex aspect-square w-full max-w-[400px] items-center justify-center rounded border p-0.5">
      {query.data !== undefined ? (
        <EditDialog existingUrl={query.data} item={item}>
          {editButton}
        </EditDialog>
      ) : (
        editButton
      )}
      {query.isPending ? (
        <Loader />
      ) : query.isError ? (
        "Error Loading Image"
      ) : query.data === null ? (
        <NoImage />
      ) : (
        <img
          src={query.data}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      )}
    </figure>
  );
}

interface EditDialogProps {
  existingUrl: string | null;
  item: InventoryItem;
  children: ReactNode;
}

function EditDialog({ existingUrl, item, children }: EditDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setUploadState("none");
      setImageUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      setImageUrl(existingUrl);
    }
  }, [open]);

  const { mutate: upload } = useUploadInventoryItemImage({
    inventoryItemId: item.id,
    onError: (e) => {
      const message = e.response?.data.message;
      if (message && message.includes("must not be greater than")) {
        toast.warning("Image too large");
        return;
      }
      toastGenericError();
    },
    onSuccess: () => {
      toast.success("Image updated");
      setOpen(false);
    },
  });

  const { mutate: deleteImage } = useDeleteInventoryItemImage({
    inventoryItemId: item.id,
    onError: () => {
      toastGenericError();
    },
    onSuccess: () => {
      toast.success("Image deleted");
      setOpen(false);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<"none" | "delete" | File>(
    "none",
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadState instanceof File) {
      const objectUrl = URL.createObjectURL(uploadState);
      setImageUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (existingUrl && uploadState !== "delete") {
      setImageUrl(existingUrl);
    } else {
      setImageUrl(null);
    }
  }, [existingUrl, uploadState]);

  const onRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    if (uploadState === "none" && existingUrl) {
      setUploadState("delete");
    } else if (uploadState instanceof File) {
      URL.revokeObjectURL(imageUrl!);
      setUploadState("none");
    }
  };

  const onSave = () => {
    if (uploadState === "delete") {
      deleteImage();
    } else if (uploadState instanceof File) {
      upload(uploadState);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            PNG and JPG files are supported. Must be less than 10MB.
          </DialogDescription>
        </DialogHeader>
        <figure className="aspect-square w-full rounded border p-0.5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="h-full w-full rounded-[0.125rem] object-cover"
            />
          ) : (
            <NoImage />
          )}
        </figure>
        <div className="flex gap-2">
          <Input
            type="file"
            ref={inputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setUploadState(file);
            }}
            accept="image/png, image/jpeg"
            className="cursor-pointer"
          />
          <Button
            variant="outline"
            onClick={onRemove}
            disabled={
              (uploadState === "none" && !existingUrl) ||
              uploadState === "delete"
            }
            className="text-red-500 hover:text-red-600"
          >
            Remove Image
          </Button>
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            disabled={uploadState === "none"}
            className="flex-1"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NoImage() {
  return (
    <div className="flex h-full select-none items-center justify-center text-2xl text-gray-400">
      No Image
    </div>
  );
}
