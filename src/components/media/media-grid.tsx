import { MediaCard, MediaCardProps } from './media-card';
import { Film } from 'lucide-react';

interface MediaGridProps {
  items: Omit<MediaCardProps, 'priority'>[];
  emptyMessage?: string;
  priorityCount?: number;
}

export function MediaGrid({
  items,
  emptyMessage = 'لا توجد عناصر لعرضها حالياً.',
  priorityCount = 0,
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-card border border-border/60">
        <div className="p-3.5 rounded-full bg-secondary text-primary mb-3">
          <Film className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">
          يرجى التحقق لاحقاً أو تجربة استعلام بحث مختلف.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {items.map((item, index) => (
        <MediaCard
          key={`${item.type}-${item.id}`}
          {...item}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
