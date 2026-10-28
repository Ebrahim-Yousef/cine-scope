import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF3F7" },
    { media: "(prefers-color-scheme: dark)", color: "#211820" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "CineScope — استكشاف الأفلام والمسلسلات العالمية",
    template: "%s | CineScope",
  },
  description:
    "منصة سينمائية متقدمة لاستكشاف الأفلام والمسلسلات التلفزيونية العالمية، معرفة التقييمات، مواعيد العرض، وتفاصيل الأعمال السينمائية عبر بيانات TMDB.",
  keywords: [
    "أفلام",
    "مسلسلات",
    "سينما",
    "تقييمات الأفلام",
    "TMDB",
    "CineScope",
  ],
  authors: [{ name: "CineScope" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${ibmPlexArabic.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
