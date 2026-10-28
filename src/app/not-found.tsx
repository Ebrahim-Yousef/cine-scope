import Link from 'next/link';
import { Film, Home, ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-primary shadow-inner">
          <Film className="h-12 w-12 opacity-80" />
        </div>
        <span className="absolute -top-1 -right-1 font-mono text-3xl font-extrabold text-primary">
          404
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
        الصفحة أو العمل غير موجود
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        يبدو أن الرابط الذي تبحث عنه غير متوفر، أو تم حذف العمل الفني من قاعدة بيانات TMDB.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'gap-2')}
        >
          <Home className="h-4 w-4" />
          <span>الصفحة الرئيسية</span>
        </Link>
        <Link
          href="/movies"
          className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'gap-2')}
        >
          <span>تصفح الأفلام</span>
          <ArrowLeft className="h-4 w-4 rtl:rotate-0 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
