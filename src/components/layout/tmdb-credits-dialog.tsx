'use client';

import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function TmdbCreditsDialog() {
  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
        aria-label="عرض مصادر البيانات وحقوق TMDB"
      >
        <Info className="h-3 w-3 shrink-0" />
        <span>المصادر وحقوق البيانات</span>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl p-6 text-center">
        <DialogTitle className="text-base font-bold text-foreground mb-1">
          مصادر البيانات وحقوق TMDB
        </DialogTitle>

        {/* TMDB gradient logo per TMDB attribution guidelines */}
        <div className="flex justify-center my-4">
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="زيارة موقع The Movie Database"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 190 34"
              className="h-9 w-auto"
              aria-hidden="true"
              focusable="false"
              role="img"
            >
              <defs>
                <linearGradient id="tmdb-grad-credits" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#90CEA1" />
                  <stop offset="100%" stopColor="#01B4E4" />
                </linearGradient>
              </defs>
              <rect width="190" height="34" rx="5" fill="url(#tmdb-grad-credits)" />
              <text
                x="12"
                y="23"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                fontSize="17"
                fill="#fff"
                letterSpacing="1"
              >
                TMDB
              </text>
              <text
                x="68"
                y="23"
                fontFamily="Arial, sans-serif"
                fontSize="11"
                fill="#fff"
              >
                The Movie Database
              </text>
            </svg>
          </a>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          يستخدم CineScope واجهة برمجة تطبيقات{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            The Movie Database (TMDB)
          </a>{' '}
          لعرض بيانات الأفلام والمسلسلات.
        </p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          هذا المنتج يستخدم واجهة برمجة TMDB ولكنه غير معتمد أو معترف به رسمياً من قِبل TMDB.
        </p>
      </DialogContent>
    </Dialog>
  );
}
