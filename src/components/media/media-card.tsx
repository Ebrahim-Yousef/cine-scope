'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film, Tv, Star } from 'lucide-react';
import { getTMDBImageUrl, formatRating } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';

export interface MediaCardProps {
  id: number;
  title: string;
  originalTitle?: string;
  posterPath: string | null;
  year?: string;
  rating?: number;
  type: 'movie' | 'tv';
  priority?: boolean;
}

export function MediaCard({
  id,
  title,
  originalTitle,
  posterPath,
  year,
  rating,
  type,
  priority = false,
}: MediaCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const href = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  const imageUrl = !imageError ? getTMDBImageUrl(posterPath, 'w500') : null;
  const displayTitle = title || originalTitle || 'بدون عنوان';
  const showRating = rating !== undefined && rating !== null && rating > 0;

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-secondary/40 text-muted-foreground">
            {type === 'movie' ? (
              <Film className="h-10 w-10 mb-2 opacity-50 text-primary" />
            ) : (
              <Tv className="h-10 w-10 mb-2 opacity-50 text-primary" />
            )}
            <span className="text-xs font-medium line-clamp-2 px-2" dir="auto">
              {displayTitle}
            </span>
          </div>
        )}

        {/* Gradient overlay on hover for atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Type badge on top start */}
        <div className="absolute top-2.5 start-2.5 z-10">
          <Badge
            variant="secondary"
            className="text-[11px] font-medium bg-background/85 backdrop-blur-xs text-foreground border-border/50 shadow-xs px-2 py-0.5"
          >
            {type === 'movie' ? 'فيلم' : 'مسلسل'}
          </Badge>
        </div>

        {/* Rating badge on top end if available */}
        {showRating && (
          <div className="absolute top-2.5 end-2.5 z-10">
            <span
              dir="ltr"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold bg-black/75 text-amber-300 backdrop-blur-xs shadow-xs"
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{formatRating(rating)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <h3
          className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug"
          title={displayTitle}
          dir="auto"
        >
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-1">
          {year ? (
            <span dir="ltr" className="font-medium tracking-wide">{year}</span>
          ) : (
            <span />
          )}

          {originalTitle && originalTitle !== title && (
            <span
              className="text-[11px] opacity-75 truncate max-w-[120px]"
              dir="auto"
              title={originalTitle}
            >
              {originalTitle}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
