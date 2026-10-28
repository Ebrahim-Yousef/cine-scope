import { Metadata } from 'next';
import { Tv } from 'lucide-react';
import {
  getPopularTVShows,
  isTMDBConfigured,
  formatYear,
} from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/media-grid';
import { Pagination } from '@/components/media/pagination';
import { TokenWarning } from '@/components/layout/token-warning';
import type { MediaCardProps } from '@/components/media/media-card';

export const metadata: Metadata = {
  title: 'المسلسلات التلفزيونية',
  description: 'استكشف قائمة المسلسلات التلفزيونية والإنتاجات الدرامية الأكثر شعبية وتداولاً حول العالم.',
};

export const revalidate = 600;

interface TVPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TVPage({ searchParams }: TVPageProps) {
  const sp = await searchParams;
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const parsedPage = parseInt(rawPage || '1', 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const isConfigured = isTMDBConfigured();

  let tvShows: Omit<MediaCardProps, 'priority'>[] = [];
  let totalPages = 1;
  let fetchError: string | null = null;

  if (isConfigured) {
    try {
      const response = await getPopularTVShows(page);
      totalPages = response.total_pages;
      tvShows = response.results.map((t) => ({
        id: t.id,
        title: t.name,
        originalTitle: t.original_name,
        posterPath: t.poster_path,
        year: formatYear(t.first_air_date),
        rating: t.vote_average,
        type: 'tv' as const,
      }));
    } catch (err: unknown) {
      fetchError =
        err instanceof Error ? err.message : 'تعذر استرجاع قائمة المسلسلات حالياً';
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-border/70 pb-6">
        <div className="flex items-center gap-2.5 text-primary mb-2">
          <Tv className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-wider">الدراما والتلفزيون</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
          المسلسلات التلفزيونية الشائعة
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
          أحدث المسلسلات، سلاسل الإثارة، والأعمال التلفزيونية الأكثر متابعة وإشادة دولياً.
        </p>
      </div>

      {!isConfigured && <TokenWarning />}

      {fetchError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-destructive text-sm">
          {fetchError}
        </div>
      )}

      {/* Grid */}
      <MediaGrid
        items={tvShows}
        priorityCount={10}
        emptyMessage={
          !isConfigured
            ? 'يرجى تهيئة مفتاح TMDB_ACCESS_TOKEN في .env.local لعرض المسلسلات.'
            : 'لم يتم العثور على أي مسلسلات في هذه الصفحة.'
        }
      />

      {/* Pagination */}
      {isConfigured && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/tv"
        />
      )}
    </div>
  );
}
