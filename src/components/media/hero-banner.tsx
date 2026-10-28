import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowLeft, Info, Clapperboard } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTMDBImageUrl, formatRating, formatYear } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb';

interface HeroBannerProps {
  item: (TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' };
}

export function HeroBanner({ item }: HeroBannerProps) {
  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  const originalTitle = isMovie ? item.original_title : item.original_name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = formatYear(releaseDate);
  const detailsUrl = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
  const backdropUrl = getTMDBImageUrl(item.backdrop_path, 'w1280');
  const rating = item.vote_average;

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border/60">
      {/* Background Image Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-60 dark:opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
            <Clapperboard className="h-16 w-16 text-primary/30" />
          </div>
        )}

        {/* Cinematic Multi-stop Velvet Rose Gradients for contrast and atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent rtl:bg-gradient-to-l" />

        {/* Content Box */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto max-w-7xl px-4 pb-8 sm:pb-12 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3.5">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5 text-xs shadow-xs">
                  {isMovie ? 'فيلم مختار' : 'مسلسل مختار'}
                </Badge>
                {year && (
                  <Badge variant="outline" className="font-mono text-xs bg-background/70 backdrop-blur-xs">
                    {year}
                  </Badge>
                )}
                {rating > 0 && (
                  <span
                    dir="ltr"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-black/60 text-amber-300 backdrop-blur-xs"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{formatRating(rating)}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight"
                dir="auto"
              >
                {title}
              </h1>

              {/* Original title subtitle */}
              {originalTitle && originalTitle !== title && (
                <p className="text-sm sm:text-base text-primary/90 font-medium" dir="auto">
                  {originalTitle}
                </p>
              )}

              {/* Overview */}
              {item.overview && (
                <p
                  className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4 leading-relaxed max-w-xl"
                  dir="auto"
                >
                  {item.overview}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={detailsUrl}
                  className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'shadow-md font-medium gap-2')}
                >
                  <Info className="h-4 w-4" />
                  <span>عرض التفاصيل</span>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-0 rotate-180" />
                </Link>
                <Link
                  href="/movies"
                  className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'bg-background/60 backdrop-blur-xs')}
                >
                  <span>استكشاف المزيد</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
