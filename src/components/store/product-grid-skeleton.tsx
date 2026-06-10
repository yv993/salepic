import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface overflow-hidden rounded-2xl">
          <Skeleton className="aspect-[1.41/1] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-7 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
