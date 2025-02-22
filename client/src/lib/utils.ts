import { type ClassValue, clsx } from "clsx";
import { format as formatDate } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function toTitleCase(input: string) {
  return input.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

export function toastGenericError() {
  toast.error("Something went wrong. Try again later.");
}

export function formatDateShort(date: Date) {
  return formatDate(date, "dd/MM/yyyy (p)");
}

export function formatDateLong(date: Date) {
  return formatDate(date, "MMMM d, yyyy (p)");
}
