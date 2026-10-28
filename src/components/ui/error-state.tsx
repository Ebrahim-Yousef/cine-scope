'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = 'تعذّر تحميل المحتوى',
  description = 'حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل.',
  actionLabel = 'إعادة المحاولة',
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
      setTimeout(() => setIsRetrying(false), 800);
    } else {
      router.refresh();
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-card border border-border/80 shadow-xs',
          className
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="p-2.5 rounded-full bg-secondary/80 text-primary mb-3">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
        <Button
          onClick={handleRetry}
          size="sm"
          disabled={isRetrying}
          className="gap-1.5 text-xs font-semibold shadow-xs"
        >
          <RotateCcw className={cn('h-3.5 w-3.5', isRetrying && 'animate-spin')} />
          <span>{actionLabel}</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-14 px-6 text-center rounded-3xl bg-card border border-border/70 shadow-sm max-w-xl mx-auto my-6',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4 rounded-2xl bg-secondary/70 text-primary mb-4 shadow-inner">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">
        {title}
      </h2>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <Button
        onClick={handleRetry}
        size="default"
        disabled={isRetrying}
        className="gap-2 px-6 rounded-xl font-semibold shadow-md"
      >
        <RotateCcw className={cn('h-4 w-4', isRetrying && 'animate-spin')} />
        <span>{actionLabel}</span>
      </Button>
    </div>
  );
}
