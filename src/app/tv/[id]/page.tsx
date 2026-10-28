import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  Star,
  Tv,
  Calendar,
  Layers,
  Film,
} from 'lucide-react';
import {
  getTVDetails,
  getTMDBImageUrl,
  formatRating,
  formatYear,
  isTMDBConfigured,
} from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TokenWarning } from '@/components/layout/token-warning';

interface TVDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TVDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    notFound();
  }
  if (!isTMDBConfigured()) {
    return { title: 'تفاصيل المسلسل' };
  }

  try {
    const tv = await getTVDetails(id);
    if (!tv) {
      notFound();
    }
    const year = formatYear(tv.first_air_date);
    return {
      title: `${tv.name} ${year ? `(${year})` : ''}`,
      description: tv.overview || `تفاصيل وتقييم مسلسل ${tv.name} على CineScope.`,
    };
  } catch {
    return { title: 'تفاصيل المسلسل' };
  }
}

export default async function TVDetailsPage({ params }: TVDetailsPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const isConfigured = isTMDBConfigured();
  if (!isConfigured) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <TokenWarning />
      </div>
    );
  }

  const tv = await getTVDetails(id);

  if (!tv) {
    notFound();
  }

  const backdropUrl = getTMDBImageUrl(tv.backdrop_path, 'original');
  const posterUrl = getTMDBImageUrl(tv.poster_path, 'w500');
  const year = formatYear(tv.first_air_date);
  const hasRating = tv.vote_average > 0;

  return (
    <div className="relative min-h-screen pb-16">
      {/* Wide Backdrop Background */}
      <div className="relative h-[320px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden bg-background">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={tv.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-35 dark:opacity-25"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 relative z-10">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/tv"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2 bg-card/80 backdrop-blur-md')}
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة إلى المسلسلات</span>
          </Link>
        </div>

        {/* Hero Details Grid */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster Artwork Column */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-card border-2 border-border/80 shadow-xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={tv.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 192px, 288px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-secondary/50 text-muted-foreground text-center">
                  <Tv className="h-12 w-12 opacity-40 text-primary mb-2" />
                  <span className="text-xs" dir="auto">{tv.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Column */}
          <div className="flex-1 space-y-6 text-start">
            <div>
              {/* Type and Status */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5 text-xs">
                  مسلسل تلفزيوني
                </Badge>
                {year && (
                  <Badge variant="outline" className="text-xs bg-background/60 font-mono">
                    {year}
                  </Badge>
                )}
                {tv.status && (
                  <Badge variant="outline" className="text-xs bg-background/60">
                    {tv.status}
                  </Badge>
                )}
                {tv.original_language && (
                  <Badge variant="secondary" className="text-xs uppercase font-mono">
                    {tv.original_language}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight"
                dir="auto"
              >
                {tv.name}
              </h1>

              {/* Original Title */}
              {tv.original_name && tv.original_name !== tv.name && (
                <p className="text-sm sm:text-base text-primary/90 font-medium mt-1" dir="auto">
                  {tv.original_name}
                </p>
              )}

              {/* Tagline */}
              {tv.tagline && (
                <p className="text-xs sm:text-sm italic text-muted-foreground mt-2 border-s-2 border-primary/50 ps-3">
                  &quot;{tv.tagline}&quot;
                </p>
              )}
            </div>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-3 border-y border-border/60 text-xs sm:text-sm">
              {hasRating && (
                <div dir="ltr" className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{formatRating(tv.vote_average)}</span>
                  <span className="text-muted-foreground font-normal text-xs">
                    ({tv.vote_count.toLocaleString('ar-EG')} تقييم)
                  </span>
                </div>
              )}

              {tv.number_of_seasons > 0 && (
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>{tv.number_of_seasons} مواسم</span>
                </div>
              )}

              {tv.number_of_episodes > 0 && (
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <Film className="h-4 w-4 text-primary" />
                  <span>{tv.number_of_episodes} حلقة</span>
                </div>
              )}

              {tv.first_air_date && (
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>بدأ العرض: {tv.first_air_date}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {tv.genres && tv.genres.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground">التصنيفات</h3>
                <div className="flex flex-wrap gap-2">
                  {tv.genres.map((g) => (
                    <Badge
                      key={g.id}
                      variant="secondary"
                      className="px-3 py-1 rounded-lg text-xs bg-secondary text-foreground hover:bg-secondary/80"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            {tv.overview && (
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-bold text-foreground">قصة العمل</h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-3xl"
                  dir="auto"
                >
                  {tv.overview}
                </p>
              </div>
            )}

            {/* Additional genuine metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
              {tv.last_air_date && (
                <div>
                  <span className="text-muted-foreground block mb-0.5">آخر حلقة عُرضت</span>
                  <span className="font-semibold text-foreground font-mono">
                    {tv.last_air_date}
                  </span>
                </div>
              )}
              {tv.homepage && (
                <div>
                  <span className="text-muted-foreground block mb-0.5">الموقع الرسمي</span>
                  <a
                    href={tv.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium truncate block max-w-[180px]"
                    dir="ltr"
                  >
                    زيارة الموقع
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
