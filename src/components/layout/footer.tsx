import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard, Code2, MessageCircle, Mail } from 'lucide-react';
import { TmdbCreditsDialog } from '@/components/layout/tmdb-credits-dialog';

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 transition-colors mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Top row: Logo + Developer profile */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">

          {/* CineScope branding */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors shrink-0"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clapperboard className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Cine<span className="text-primary font-black">Scope</span>
            </span>
          </Link>

          {/* Developer profile — عن المطوّر */}
          <div className="flex flex-col items-center sm:items-end gap-3 text-center sm:text-end">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              عن المطوّر
            </p>

            <div className="flex items-center gap-3">
              {/* Portrait */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-card shadow-sm">
                <Image
                  src="/images/ebrahim-yousef.jpg"
                  alt="صورة المطوّر إبراهيم يوسف"
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                  priority={false}
                />
              </div>

              {/* Name & role */}
              <div className="flex flex-col gap-0.5 text-start">
                <span className="text-sm font-bold text-foreground">
                  إبراهيم يوسف
                </span>
                <span className="text-xs text-muted-foreground">
                  مطور واجهات ويب
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border/50" />

        {/* Bottom row: contact links + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Contact links */}
          <nav
            className="flex items-center gap-1 flex-wrap justify-center sm:justify-start"
            aria-label="روابط التواصل مع المطوّر"
          >
            {/* GitHub */}
            <a
              href="https://github.com/Ebrahim-Yousef"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ملف إبراهيم يوسف على GitHub (يفتح في نافذة جديدة)"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Code2 className="h-4 w-4 shrink-0" />
              <span dir="ltr">GitHub</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/201018399732"
              aria-label="تواصل عبر واتساب"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span dir="ltr">WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href="mailto:ebrahim.yousef.dev@gmail.com"
              aria-label="مراسلة إبراهيم يوسف عبر البريد الإلكتروني"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span dir="ltr">Email</span>
            </a>
          </nav>

          {/* Copyright + TMDB credits link */}
          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-primary">CineScope</span>{' '}
              &copy; 2026 — جميع الحقوق محفوظة
            </p>
            <TmdbCreditsDialog />
          </div>
        </div>

      </div>
    </footer>
  );
}
