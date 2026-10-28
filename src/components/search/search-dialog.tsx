'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Film, Tv, Star, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTMDBImageUrl, formatRating } from '@/lib/tmdb';

interface SearchResult {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  year: string;
  rating: number;
  url: string;
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search logic with AbortController
  React.useEffect(() => {
    const trimmed = query.trim();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      if (trimmed.length < 2) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `خطأ في الخادم (${res.status})`);
        }

        const data = await res.json();
        setResults(data.results || []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'فشل البحث، يرجى المحاولة لاحقاً');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Mobile search icon button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="sm:hidden h-9 w-9 rounded-full text-foreground hover:bg-secondary shrink-0"
        aria-label="ابحث في الأفلام والمسلسلات"
      >
        <Search className="h-4.5 w-4.5 text-primary" />
      </Button>

      {/* Tablet and Desktop search bar button */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex relative h-9 w-full max-w-[220px] md:max-w-[260px] justify-start rounded-full bg-secondary/50 hover:bg-secondary border-border/70 text-muted-foreground text-xs font-normal px-3 transition-colors shadow-2xs"
        aria-label="ابحث في الأفلام والمسلسلات"
      >
        <Search className="h-3.5 w-3.5 ms-0 me-2 text-primary shrink-0" />
        <span className="truncate">بحث عن فيلم أو مسلسل...</span>
        <kbd className="pointer-events-none absolute end-2 top-2 hidden h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex border border-border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[620px] p-0 overflow-hidden bg-card border-border shadow-2xl rounded-2xl"
          showCloseButton={false}
        >
          <div className="sr-only">
            <DialogTitle>البحث الشامل</DialogTitle>
            <DialogDescription>ابحث في مكتبة الأفلام والمسلسلات الدولية</DialogDescription>
          </div>

          {/* Search Input Bar */}
          <div className="flex items-center gap-2 border-b border-border/80 px-4 py-3 bg-card">
            <Search className="h-5 w-5 text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالعنوان الإنجليزي أو العربي..."
              className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
              dir="auto"
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md bg-muted/60 hover:bg-muted transition-colors"
            >
              إلغاء
            </button>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {error && (
              <div className="flex items-center gap-2 p-4 text-xs sm:text-sm text-destructive bg-destructive/10 rounded-xl m-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!query.trim() && (
              <div className="py-12 text-center text-muted-foreground">
                <Film className="h-10 w-10 mx-auto mb-2.5 opacity-30 text-primary" />
                <p className="text-sm font-medium">ابدأ بكتابة اسم الفيلم أو المسلسل</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ابحث في آلاف العناوين السينمائية والمسلسلات العالمية عبر TMDB
                </p>
              </div>
            )}

            {query.trim().length === 1 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                يرجى إدخال حرفين على الأقل لبدء البحث...
              </div>
            )}

            {query.trim().length >= 2 && !isLoading && results.length === 0 && !error && (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm font-medium">لم يتم العثور على نتائج لـ &quot;{query}&quot;</p>
                <p className="text-xs text-muted-foreground mt-1">
                  تحقق من صحة الكلمات أو جرب البحث بالاسم الأصلي
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="divide-y divide-border/40">
                {results.map((item) => {
                  const posterUrl = getTMDBImageUrl(item.posterPath, 'w92');
                  return (
                    <button
                      key={`${item.mediaType}-${item.id}`}
                      type="button"
                      onClick={() => handleSelect(item.url)}
                      className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-secondary/60 text-start transition-colors group focus-visible:outline-none focus-visible:bg-secondary"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-muted border border-border/50">
                        {posterUrl ? (
                          <Image
                            src={posterUrl}
                            alt={item.title}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-secondary/50 text-muted-foreground">
                            {item.mediaType === 'movie' ? (
                              <Film className="h-4 w-4 opacity-40 text-primary" />
                            ) : (
                              <Tv className="h-4 w-4 opacity-40 text-primary" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground border-border/60"
                          >
                            {item.mediaType === 'movie' ? 'فيلم' : 'مسلسل'}
                          </Badge>
                          {item.year && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.year}
                            </span>
                          )}
                          {item.rating > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{formatRating(item.rating)}</span>
                            </span>
                          )}
                        </div>

                        <h4
                          className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate"
                          dir="auto"
                        >
                          {item.title}
                        </h4>

                        {item.originalTitle && item.originalTitle !== item.title && (
                          <p
                            className="text-xs text-muted-foreground truncate"
                            dir="auto"
                          >
                            {item.originalTitle}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
