import { PaginationInstance, PaginationState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as UiPagination,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 15, 20, 25, 30] as const;

interface Props<TData> {
  table: PaginationInstance<TData>;
  state: PaginationState;
  className?: string;
}

export function Pagination<TData>({ table, state, className }: Props<TData>) {
  const currentPage = state.pageIndex + 1;
  const items = getPaginationItems(currentPage, table.getPageCount(), 7);

  return (
    <div className={cn("flex", className)}>
      <Select
        value={state.pageSize.toString()}
        onValueChange={(v) => table.setPageSize(Number(v))}
      >
        <SelectTrigger className="h-9 w-52 border-gray-300">
          <span className="font-semibold">
            <SelectValue />
          </span>
          <span className="ml-1.5 mr-auto">Items</span>
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((v) => (
            <SelectItem key={v} value={v.toString()}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <UiPagination>
        <PaginationContent>
          {items.map((v, i) => (
            <PaginationItem key={`${v}${i}`}>
              {v === null ? (
                <PaginationEllipsis className="text-gray-400" />
              ) : (
                <Button
                  aria-current={currentPage === v ? "page" : undefined}
                  variant={currentPage === v ? "outline" : "ghost"}
                  onClick={() => table.setPageIndex(v - 1)}
                  className="size-9 border-zinc-300"
                >
                  {v}
                </Button>
              )}
            </PaginationItem>
          ))}
        </PaginationContent>
      </UiPagination>
      <div className="flex gap-1">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-9 border-zinc-300"
        >
          <ChevronLeft /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-9 border-zinc-300"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function getPaginationItems(
  currentPage: number,
  pageCount: number,
  pagesShown: number,
): (number | null)[] {
  const getRange = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const centerPagesShown = pagesShown - 5;
  const boundaryPagesShown = pagesShown - 3;

  let delta: number;
  if (pageCount <= pagesShown) {
    delta = pagesShown;
  } else {
    delta =
      currentPage < boundaryPagesShown ||
      currentPage > pageCount - boundaryPagesShown
        ? boundaryPagesShown
        : centerPagesShown;
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1;
    range.end += 1;
  }

  let pages: (number | null)[];
  if (currentPage > delta) {
    pages = getRange(
      Math.min(range.start, pageCount - delta),
      Math.min(range.end, pageCount),
    );
  } else if (
    currentPage > pageCount - boundaryPagesShown &&
    pageCount > pagesShown
  ) {
    pages = getRange(pageCount - delta, pageCount);
  } else {
    pages = getRange(1, Math.min(pageCount, delta + 1));
  }

  const withDots = (value: number, pair: (number | null)[]) =>
    pages.length + 1 !== pageCount ? pair : [value];
  const lastPage = pages[pages.length - 1];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, null]).concat(pages);
  }

  if (lastPage && lastPage < pageCount) {
    pages = pages.concat(withDots(pageCount, [null, pageCount]));
  }

  if (pages[pages.length - 1] === null) pages.pop();

  return pages;
}
