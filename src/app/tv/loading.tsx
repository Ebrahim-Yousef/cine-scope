import { Skeleton } from '@/components/ui/skeleton';
import { MediaGridSkeleton } from '@/components/media/media-card-skeleton';

export default function TVLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      <div className="border-b border-border/70 pb-6 space-y-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      <MediaGridSkeleton count={10} />
    </div>
  );
}
