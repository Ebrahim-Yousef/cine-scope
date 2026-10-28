'use client';

import * as React from 'react';
import { ErrorState } from '@/components/ui/error-state';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Keep diagnostic info on the server / dev console without exposing secrets
    console.error('[CineScope App Error]:', error.message);
  }, [error]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20 flex items-center justify-center">
      <ErrorState
        title="تعذّر تحميل المحتوى"
        description="حصلت مشكلة أثناء تحميل البيانات. حاول تاني بعد قليل."
        actionLabel="إعادة المحاولة"
        onRetry={() => reset()}
      />
    </div>
  );
}
