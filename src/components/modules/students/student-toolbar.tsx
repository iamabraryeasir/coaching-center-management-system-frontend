"use client";

import { RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserStatus } from "@/types";

interface StudentToolbarProps {
  currentStatus?: UserStatus | "ALL";
  currentSort?: string;
  currentSearch?: string;
}

const statusDisplayMap: Record<string, string> = {
  ALL: "All Statuses",
  ACTIVE: "Active",
  PENDING_ACTIVATION: "Pending",
  INACTIVE: "Inactive",
  BLOCKED: "Blocked",
};

const sortDisplayMap: Record<string, string> = {
  "createdAt:desc": "Newest First",
  "createdAt:asc": "Oldest First",
  "name:asc": "Name: A to Z",
  "name:desc": "Name: Z to A",
};

export function StudentToolbar({
  currentStatus = "ALL",
  currentSort = "createdAt:desc",
  currentSearch = "",
}: StudentToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  /**
   * Helper to push updated search parameters to the URL
   */
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim() !== "" && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 on filter or search change
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim() !== "") {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        params.delete("page");

        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`);
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, currentSearch, pathname, router, searchParams]);

  const handleStatusChange = (val: string | null) => {
    updateQuery("status", val);
  };

  const handleSortChange = (val: string | null) => {
    if (!val) return;
    const [sortBy, sortOrder] = val.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const isFiltered =
    searchTerm.trim() !== "" ||
    (currentStatus && currentStatus !== "ALL") ||
    currentSort !== "createdAt:desc";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Bar with Icon */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-3 h-9 text-sm"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <Select
          value={currentStatus || "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-9 min-w-36 text-xs px-3">
            <SelectValue placeholder="Status">
              {(val: string | null) =>
                val && val !== "ALL"
                  ? `Status: ${statusDisplayMap[val] || val}`
                  : "All Statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING_ACTIVATION">Pending</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={currentSort || "createdAt:desc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="h-9 min-w-44 text-xs px-3">
            <SelectValue placeholder="Sort by">
              {(val: string | null) =>
                `Sort: ${sortDisplayMap[val ?? "createdAt:desc"] || "Newest First"}`
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt:desc">Newest First</SelectItem>
            <SelectItem value="createdAt:asc">Oldest First</SelectItem>
            <SelectItem value="name:asc">Name: A to Z</SelectItem>
            <SelectItem value="name:desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
