import { Skeleton } from '@/components/ui/skeleton';
import { MediaGridSkeleton } from '@/components/media/media-card-skeleton';

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero Skeleton */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full bg-muted/60">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Section 1 */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <MediaGridSkeleton count={5} />
        </div>

        {/* Section 2 */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <MediaGridSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}
