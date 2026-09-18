"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ApiMeta } from "@/types";

interface StudentPaginationProps {
  meta?: ApiMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
  itemLabel?: string;
}

export function StudentPagination({
  meta,
  onPageChange,
  onLimitChange,
  className,
  itemLabel = "students",
}: StudentPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  if (!meta || meta.total === 0) return null;

  const { page, limit, total, totalPage } = meta;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const navigateToPage = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (!newLimit) return;
    if (onLimitChange) {
      onLimitChange(Number(newLimit));
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // Reset to page 1
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  /**
   * Helper to build visible page number items with stable keys
   */
  const getPageItems = () => {
    const items: { key: string; label: number | "ellipsis"; page?: number }[] =
      [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) {
        items.push({ key: `page-${i}`, label: i, page: i });
      }
    } else {
      items.push({ key: "page-1", label: 1, page: 1 });
      if (page > 3) items.push({ key: "ellipsis-start", label: "ellipsis" });

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPage - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!items.some((item) => item.page === i)) {
          items.push({ key: `page-${i}`, label: i, page: i });
        }
      }

      if (page < totalPage - 2) {
        items.push({ key: "ellipsis-end", label: "ellipsis" });
      }
      if (!items.some((item) => item.page === totalPage)) {
        items.push({
          key: `page-${totalPage}`,
          label: totalPage,
          page: totalPage,
        });
      }
    }

    return items;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-3.5 px-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/60",
        className,
      )}
    >
      {/* Range readout & limit selector */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Showing{" "}
          <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">
            {total.toLocaleString()}
          </span>{" "}
          {itemLabel}
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span>Rows:</span>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-1">
        {/* First Page */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => navigateToPage(1)}
          disabled={page <= 1}
          aria-label="First page"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Previous Page */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => navigateToPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {getPageItems().map((item) => {
            if (item.label === "ellipsis") {
              return (
                <span
                  key={item.key}
                  className="px-1 text-xs text-muted-foreground"
                >
                  &hellip;
                </span>
              );
            }

            const isCurrent = item.page === page;
            return (
              <Button
                key={item.key}
                type="button"
                variant={isCurrent ? "default" : "outline"}
                size="icon-xs"
                onClick={() => item.page && navigateToPage(item.page)}
                className="text-xs"
              >
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => navigateToPage(page + 1)}
          disabled={page >= totalPage}
          aria-label="Next page"
        >
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Last Page */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={() => navigateToPage(totalPage)}
          disabled={page >= totalPage}
          aria-label="Last page"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
