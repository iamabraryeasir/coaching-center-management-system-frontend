import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Brand Header Skeleton */}
        <div className="flex items-center justify-center gap-2 self-center">
          <Skeleton className="size-6 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Auth Form Card Skeleton */}
        <Card>
          <CardHeader className="text-center space-y-2">
            <Skeleton className="mx-auto h-6 w-36" />
            <Skeleton className="mx-auto h-4 w-52" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Field 1 */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            {/* Input Field 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-9 w-full rounded-lg" />

            {/* Divider */}
            <div className="py-2">
              <Skeleton className="h-3 w-full" />
            </div>

            {/* OAuth / Alternative Button */}
            <Skeleton className="h-9 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Terms Footer Skeleton */}
        <div className="px-6 text-center space-y-1">
          <Skeleton className="mx-auto h-3 w-4/5" />
          <Skeleton className="mx-auto h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}
