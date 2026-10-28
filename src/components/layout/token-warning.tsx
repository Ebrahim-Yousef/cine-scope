import { Key, AlertTriangle } from 'lucide-react';

export function TokenWarning() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="rounded-2xl border border-primary/30 bg-secondary/50 p-5 sm:p-6 backdrop-blur-xs shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shrink-0 mt-0.5">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <span>مفتاح TMDB_ACCESS_TOKEN بانتظار الإعداد</span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  مطلوب للبيانات الحية
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                تم تجهيز التطبيق وهندسته بالكامل. لعرض البيانات الحية من TMDB، يرجى فتح ملف{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground font-semibold">
                  .env.local
                </code>{' '}
                وإضافة مفتاح القراءة الخاص بك في متغير{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground font-semibold">
                  TMDB_ACCESS_TOKEN
                </code>
                .
              </p>
            </div>
          </div>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
          >
            الحصول على المفتاح من TMDB
          </a>
        </div>
      </div>
    </div>
  );
}
