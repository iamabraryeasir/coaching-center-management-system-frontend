import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherBatchesLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
      <div className="h-96 w-full bg-card border border-border/70 rounded-xl animate-pulse" />
    </div>
  );
}
