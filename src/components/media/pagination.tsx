import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  extraParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  extraParams = {},
}: PaginationProps) {
  // TMDB API limits max accessible page to 500
  const safeTotalPages = Math.min(Math.max(1, totalPages), 500);

  if (safeTotalPages <= 1) {
    return null;
  }

  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams)) {
      if (value) params.set(key, value);
    }
    params.set('page', String(pageNumber));
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate range of page numbers around current page
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(safeTotalPages - 1, currentPage + delta);

    pages.push(1);

    if (start > 2) {
      pages.push('ellipsis-start');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < safeTotalPages - 1) {
      pages.push('ellipsis-end');
    }

    if (safeTotalPages > 1) {
      pages.push(safeTotalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < safeTotalPages;

  return (
    <nav
      role="navigation"
      aria-label="التنقل بين الصفحات"
      className="flex items-center justify-center gap-1.5 pt-8 pb-4"
    >
      {/* Previous Button (In RTL, ChevronRight points to previous) */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          aria-label="الصفحة السابقة"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 h-9 px-3 rounded-lg')}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-0" />
          <span className="hidden sm:inline">السابق</span>
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'gap-1 h-9 px-3 rounded-lg opacity-40 cursor-not-allowed select-none'
          )}
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-0" />
          <span className="hidden sm:inline">السابق</span>
        </span>
      )}

      {/* Number Buttons */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <span
                key={`${p}-${idx}`}
                className="px-2 text-xs text-muted-foreground select-none"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;

          return isActive ? (
            <span
              key={p}
              aria-current="page"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs font-mono select-none"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground text-xs font-mono font-medium hover:bg-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next Button (In RTL, ChevronLeft points to next) */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          aria-label="الصفحة التالية"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 h-9 px-3 rounded-lg')}
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="h-4 w-4 rtl:rotate-0" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'gap-1 h-9 px-3 rounded-lg opacity-40 cursor-not-allowed select-none'
          )}
          aria-disabled="true"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="h-4 w-4 rtl:rotate-0" />
        </span>
      )}
    </nav>
  );
}
