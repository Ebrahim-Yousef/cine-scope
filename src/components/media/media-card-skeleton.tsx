import { Skeleton } from '@/components/ui/skeleton';

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-card border border-border/70">
      <div className="relative aspect-[2/3] w-full bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        <Skeleton className="h-4 w-4/5 rounded-sm" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-10 rounded-sm" />
          <Skeleton className="h-3 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
