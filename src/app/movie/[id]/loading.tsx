import { Skeleton } from '@/components/ui/skeleton';

export default function MovieDetailsLoading() {
  return (
    <div className="relative min-h-screen pb-16">
      <div className="h-[320px] sm:h-[420px] lg:h-[480px] w-full bg-muted/50">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 relative z-10">
        <Skeleton className="h-9 w-36 mb-6 rounded-lg" />

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-card border-2 border-border/80 shadow-xl">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-5 w-1/3 rounded-md" />
            </div>

            <div className="flex gap-6 py-3 border-y border-border/60">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
