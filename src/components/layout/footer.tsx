import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 transition-colors mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          {/* Logo & CineScope info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Clapperboard className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Cine<span className="text-primary font-black">Scope</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-md">
              منصة استكشاف سينمائية متميزة للأفلام والمسلسلات العالمية المبنية على بيانات The Movie Database.
            </p>
          </div>

          {/* Quick links */}
          <nav className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/movies" className="hover:text-primary transition-colors">
              الأفلام
            </Link>
            <Link href="/tv" className="hover:text-primary transition-colors">
              المسلسلات
            </Link>
          </nav>
        </div>

        {/* TMDB Attribution & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>
            هذا المنتج يستخدم واجهة برمجة تطبيقات TMDB ولكن غير معتمد أو معترف به من قِبل The Movie Database (TMDB).
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">CineScope</span>
            <span>&copy; {new Date().getFullYear()} — جميع الحقوق محفوظة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
