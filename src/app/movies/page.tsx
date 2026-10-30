import { Metadata } from 'next';
import Link from 'next/link';
import { Film, Trophy, TrendingUp } from 'lucide-react';
import {
  getPopularMovies,
  getTopRatedMovies,
  isTMDBConfigured,
  formatYear,
} from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/media-grid';
import { Pagination } from '@/components/media/pagination';
import { ErrorState } from '@/components/ui/error-state';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MediaCardProps } from '@/components/media/media-card';

export const metadata: Metadata = {
  title: 'الأفلام السينمائية',
  description: 'استكشف قائمة الأفلام الأكثر رواجاً والأعلى تقييماً في السينما العالمية.',
};

export const revalidate = 600;

interface MoviesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const sp = await searchParams;
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const parsedPage = parseInt(rawPage || '1', 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const rawSort = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const isTopRated = rawSort === 'top_rated';

  const isConfigured = isTMDBConfigured();

  let movies: Omit<MediaCardProps, 'priority'>[] = [];
  let totalPages = 1;
  let fetchError = false;

  if (isConfigured) {
    try {
      const response = isTopRated
        ? await getTopRatedMovies(page)
        : await getPopularMovies(page);

      totalPages = response.total_pages;
      movies = response.results.map((m) => ({
        id: m.id,
        title: m.title,
        originalTitle: m.original_title,
        posterPath: m.poster_path,
        year: formatYear(m.release_date),
        rating: m.vote_average,
        type: 'movie' as const,
      }));
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[CineScope Movies]:', err instanceof Error ? err.message : err);
      }
      fetchError = true;
    }
  } else {
    fetchError = true;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-primary mb-2">
            <Film className="h-6 w-6" />
            <span className="text-xs font-bold uppercase tracking-wider">دليل السينما</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
            {isTopRated ? 'أفضل الأفلام تقييماً' : 'الأفلام الرائجة'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {isTopRated
              ? 'أعلى الأفلام تقييماً وفقاً لآراء وإجماع نقاد وجماهير السينما حول العالم.'
              : 'الأفلام السينمائية الأكثر مشاهدة وتداولاً في دور العرض والمنصات العالمية.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/60 self-start md:self-auto">
          <Link
            href="/movies"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'rounded-lg text-xs font-semibold gap-1.5 transition-all',
              !isTopRated
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span>الأكثر رواجاً</span>
          </Link>
          <Link
            href="/movies?sort=top_rated"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'rounded-lg text-xs font-semibold gap-1.5 transition-all',
              isTopRated
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span>الأعلى تقييماً</span>
          </Link>
        </div>
      </div>

      {/* Polished error state */}
      {fetchError && (
        <ErrorState
          title="تعذّر تحميل المحتوى"
          description="حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل."
          actionLabel="إعادة المحاولة"
        />
      )}

      {/* Grid */}
      {!fetchError && (
        <MediaGrid
          items={movies}
          priorityCount={10}
          emptyMessage="لم يتم العثور على أي أفلام في هذه الصفحة."
        />
      )}

      {/* Pagination */}
      {!fetchError && isConfigured && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/movies"
          extraParams={isTopRated ? { sort: 'top_rated' } : {}}
        />
      )}
    </div>
  );
}
