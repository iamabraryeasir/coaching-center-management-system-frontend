import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="w-full">
      {/* Hero Section Skeleton */}
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:py-24">
        {/* Badge Pill Skeleton */}
        <Skeleton className="h-7 w-48 rounded-full" />

        {/* Heading Skeleton */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-10 w-3/4 max-w-xl sm:h-12" />
          <Skeleton className="h-10 w-2/3 max-w-md sm:h-12" />
        </div>

        {/* Subtitle Description Skeleton */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>

        {/* Hero Actions Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </section>

      {/* Feature Highlights Grid Skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder skeleton items
            <Card key={i} className="space-y-2 p-6">
              <Skeleton className="size-10 rounded-xl" />
              <CardHeader className="p-0 pt-2 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
