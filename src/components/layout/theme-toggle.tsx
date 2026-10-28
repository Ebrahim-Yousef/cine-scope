'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 rounded-full text-foreground/70"
        aria-label="تبديل المظهر"
        disabled
      >
        <span className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full text-foreground hover:bg-secondary transition-colors"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-primary transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-primary transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}
