import Link from 'next/link';
import { ArrowLeft, Film, Tv, Trophy } from 'lucide-react';
import {
  getPopularMovies,
  getPopularTVShows,
  getTopRatedMovies,
  isTMDBConfigured,
  formatYear,
} from '@/lib/tmdb';
import { HeroBanner } from '@/components/media/hero-banner';
import { MediaGrid } from '@/components/media/media-grid';
import { ErrorState } from '@/components/ui/error-state';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MediaCardProps } from '@/components/media/media-card';

export const revalidate = 600; // 10 minutes cache

export default async function HomePage() {
  const isConfigured = isTMDBConfigured();

  let heroItem = null;
  let popularMovies: Omit<MediaCardProps, 'priority'>[] = [];
  let popularTVShows: Omit<MediaCardProps, 'priority'>[] = [];
  let topRatedMovies: Omit<MediaCardProps, 'priority'>[] = [];
  let fetchError = false;

  if (isConfigured) {
    try {
      const [moviesRes, tvRes, topRatedRes] = await Promise.all([
        getPopularMovies(1),
        getPopularTVShows(1),
        getTopRatedMovies(1),
      ]);

      // Choose hero item: find the first movie with a valid backdrop
      const candidateHero =
        moviesRes.results.find((m) => !!m.backdrop_path) || moviesRes.results[0];
      heroItem = candidateHero || null;

      popularMovies = moviesRes.results.slice(0, 10).map((m) => ({
        id: m.id,
        title: m.title,
        originalTitle: m.original_title,
        posterPath: m.poster_path,
        year: formatYear(m.release_date),
        rating: m.vote_average,
        type: 'movie' as const,
      }));

      popularTVShows = tvRes.results.slice(0, 10).map((t) => ({
        id: t.id,
        title: t.name,
        originalTitle: t.original_name,
        posterPath: t.poster_path,
        year: formatYear(t.first_air_date),
        rating: t.vote_average,
        type: 'tv' as const,
      }));

      topRatedMovies = topRatedRes.results.slice(0, 10).map((m) => ({
        id: m.id,
        title: m.title,
        originalTitle: m.original_title,
        posterPath: m.poster_path,
        year: formatYear(m.release_date),
        rating: m.vote_average,
        type: 'movie' as const,
      }));
    } catch (err: unknown) {
      // Log safely server-side; never expose secrets or raw API details to the client
      if (process.env.NODE_ENV !== 'production') {
        console.error('[CineScope Home]:', err instanceof Error ? err.message : err);
      }
      fetchError = true;
    }
  } else {
    // API not configured — treat as an error state on the front-end
    fetchError = true;
  }

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero section if data exists */}
      {heroItem && <HeroBanner item={heroItem} />}

      {/* Main content container */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12 pt-6">
        {/* Polished error state — no technical details shown to users */}
        {fetchError && (
          <ErrorState
            title="تعذّر تحميل المحتوى"
            description="حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل."
            actionLabel="إعادة المحاولة"
          />
        )}

        {!fetchError && (
          <>
            {/* Section 1: Popular Movies */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Film className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      الأفلام الأكثر رواجاً
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      أحدث وأشهر الأعمال السينمائية المتداولة عالمياً اليوم
                    </p>
                  </div>
                </div>

                <Link
                  href="/movies"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 text-primary hover:text-primary')}
                >
                  <span>تصفح الكل</span>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-0 rotate-180" />
                </Link>
              </div>

              <MediaGrid
                items={popularMovies}
                priorityCount={5}
                emptyMessage="لا توجد أفلام رائجة متاحة حالياً."
              />
            </section>

            {/* Section 2: Popular TV Shows */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Tv className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      المسلسلات التلفزيونية الشائعة
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      أفضل الأعمال والإنتاجات الدرامية والتلفزيونية العالمية
                    </p>
                  </div>
                </div>

                <Link
                  href="/tv"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 text-primary hover:text-primary')}
                >
                  <span>تصفح الكل</span>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-0 rotate-180" />
                </Link>
              </div>

              <MediaGrid
                items={popularTVShows}
                emptyMessage="لا توجد مسلسلات شائعة متاحة حالياً."
              />
            </section>

            {/* Section 3: Top Rated Movies */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      الأعلى تقييماً في السينما
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      شاهقات الفن السابع والأعمال التي حازت على أعلى درجات التقدير
                    </p>
                  </div>
                </div>

                <Link
                  href="/movies?sort=top_rated"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 text-primary hover:text-primary')}
                >
                  <span>المزيد</span>
                  <ArrowLeft className="h-4 w-4 rtl:rotate-0 rotate-180" />
                </Link>
              </div>

              <MediaGrid
                items={topRatedMovies}
                emptyMessage="لا توجد أعمال متاحة حالياً."
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
