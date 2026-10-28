'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Menu, X, Clapperboard, Tv } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { SearchDialog } from '@/components/search/search-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/movies', label: 'الأفلام' },
  { href: '/tv', label: 'المسلسلات' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & CineScope Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Clapperboard className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Cine<span className="text-primary font-black">Scope</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side: Search, Theme Toggle, Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SearchDialog />
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg text-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-secondary text-primary font-semibold'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.href === '/' && <Clapperboard className="h-4 w-4" />}
                  {link.href === '/movies' && <Film className="h-4 w-4" />}
                  {link.href === '/tv' && <Tv className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
