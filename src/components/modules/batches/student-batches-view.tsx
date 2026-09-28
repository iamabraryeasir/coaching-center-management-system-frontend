"use client";

import { Compass, GraduationCap, Layers, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyEnrolledBatches, useSuspenseBatches } from "@/hooks";
import type { Batch, EnrollmentStatus } from "@/types";
import { RequestEnrollmentDialog } from "./request-enrollment-dialog";
import { StudentBatchesSkeleton } from "./student-batches-skeleton";
import { StudentCatalogBatchCard } from "./student-catalog-batch-card";
import { StudentEnrolledBatchCard } from "./student-enrolled-batch-card";

type EnrolledStatusFilter = "ALL" | "ENROLLED" | "PENDING" | "REJECTED";
type CatalogStatusFilter = "ALL" | "ONGOING" | "UPCOMING";

export function StudentBatchesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const activeTab =
    searchParams.get("tab") === "catalog" ? "catalog" : "enrolled";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "catalog") {
      params.set("tab", "catalog");
    } else {
      params.delete("tab");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Batches & Enrollment
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your enrolled courses, check application statuses, or browse
            upcoming batches.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="w-full sm:w-auto h-10 p-1 bg-muted/60">
          <TabsTrigger
            value="enrolled"
            className="gap-2 text-xs font-medium px-4"
          >
            <Layers className="size-4" />
            <span>My Batches</span>
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="gap-2 text-xs font-medium px-4"
          >
            <Compass className="size-4" />
            <span>Explore Catalog</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-6 mt-0">
          <Suspense fallback={<StudentBatchesSkeleton />}>
            <StudentEnrolledBatchesContent
              onExploreClick={() => handleTabChange("catalog")}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6 mt-0">
          <Suspense fallback={<StudentBatchesSkeleton />}>
            <StudentCatalogBatchesContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentEnrolledBatchesContent({
  onExploreClick,
}: {
  onExploreClick: () => void;
}) {
  const { data: enrolledBatches } = useMyEnrolledBatches();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnrolledStatusFilter>("ALL");
  const [selectedBatchForDialog, setSelectedBatchForDialog] =
    useState<Batch | null>(null);

  const filteredBatches = enrolledBatches.filter((item) => {
    const name = item.batch?.name || item.batchName || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "ALL") return true;
    if (statusFilter === "ENROLLED") {
      return item.status === "ENROLLED" || item.status === "APPROVED";
    }
    return item.status === statusFilter;
  });

  const activeCount = enrolledBatches.filter(
    (e) => e.status === "ENROLLED" || e.status === "APPROVED",
  ).length;
  const pendingCount = enrolledBatches.filter(
    (e) => e.status === "PENDING",
  ).length;

  if (enrolledBatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-12 text-center bg-card">
        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <GraduationCap className="size-6" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
          No Batches Enrolled Yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          You are currently not enrolled in any academic batches. Browse our
          batch catalog to enroll in upcoming or ongoing classes.
        </p>
        <Button onClick={onExploreClick} className="gap-2">
          <Compass className="size-4" />
          Explore Available Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Summary Pill Bar & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search enrolled batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="xs"
            onClick={() => setStatusFilter("ALL")}
            className="text-xs font-medium"
          >
            All ({enrolledBatches.length})
          </Button>
          <Button
            type="button"
            variant={statusFilter === "ENROLLED" ? "default" : "outline"}
            size="xs"
            onClick={() => setStatusFilter("ENROLLED")}
            className="text-xs font-medium"
          >
            Active ({activeCount})
          </Button>
          {pendingCount > 0 && (
            <Button
              type="button"
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              size="xs"
              onClick={() => setStatusFilter("PENDING")}
              className="text-xs font-medium"
            >
              Pending ({pendingCount})
            </Button>
          )}
        </div>
      </div>

      {/* Grid of Enrolled Batch Cards */}
      {filteredBatches.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No batches found matching &ldquo;{search}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((enrollment) => (
            <StudentEnrolledBatchCard
              key={enrollment.id}
              enrollment={enrollment}
              onReapply={(batchId) => {
                if (enrollment.batch) {
                  setSelectedBatchForDialog(enrollment.batch);
                } else {
                  setSelectedBatchForDialog({
                    id: batchId,
                    name: enrollment.batchName || "Batch",
                    fee: enrollment.batchFee || 0,
                    status: "ONGOING",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Re-apply Dialog */}
      <RequestEnrollmentDialog
        batch={selectedBatchForDialog}
        open={Boolean(selectedBatchForDialog)}
        onOpenChange={(open) => {
          if (!open) setSelectedBatchForDialog(null);
        }}
      />
    </div>
  );
}

function StudentCatalogBatchesContent() {
  const { data: enrolledBatches } = useMyEnrolledBatches();
  const { data: batchesResponse } = useSuspenseBatches({ limit: 100 });
  const allBatches = batchesResponse.data || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CatalogStatusFilter>("ALL");
  const [selectedBatchForDialog, setSelectedBatchForDialog] =
    useState<Batch | null>(null);

  // Map enrolled batchId -> status
  const enrollmentMap = new Map<string, EnrollmentStatus>();
  for (const item of enrolledBatches) {
    enrollmentMap.set(item.batchId, item.status);
  }

  const filteredBatches = allBatches.filter((batch) => {
    const matchesSearch = batch.name
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "ALL") return true;
    return batch.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search available batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="xs"
            onClick={() => setStatusFilter("ALL")}
            className="text-xs font-medium"
          >
            All Courses
          </Button>
          <Button
            type="button"
            variant={statusFilter === "ONGOING" ? "default" : "outline"}
            size="xs"
            onClick={() => setStatusFilter("ONGOING")}
            className="text-xs font-medium"
          >
            Ongoing
          </Button>
          <Button
            type="button"
            variant={statusFilter === "UPCOMING" ? "default" : "outline"}
            size="xs"
            onClick={() => setStatusFilter("UPCOMING")}
            className="text-xs font-medium"
          >
            Upcoming
          </Button>
        </div>
      </div>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No courses found matching &ldquo;{search}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <StudentCatalogBatchCard
              key={batch.id}
              batch={batch}
              enrollmentStatus={enrollmentMap.get(batch.id)}
              onRequestEnroll={(target) => setSelectedBatchForDialog(target)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <RequestEnrollmentDialog
        batch={selectedBatchForDialog}
        open={Boolean(selectedBatchForDialog)}
        onOpenChange={(open) => {
          if (!open) setSelectedBatchForDialog(null);
        }}
      />
    </div>
  );
}
