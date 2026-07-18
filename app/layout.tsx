import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Starfield } from "@/components/background/starfield";
import { SectionRail } from "@/components/layout/section-rail";
import { RouteHistory } from "@/components/layout/route-history";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { OrbitCompanion } from "@/components/runtime/orbit-companion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.person} - ${site.title}`,
    template: `%s - ${site.person}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.person, url: site.url }],
  creator: site.person,
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.person} - ${site.title}`,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.person} - ${site.title}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06060a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f0e5" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      data-theme-mode="night"
      data-time-phase="night"
      data-resolved-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <body className="flex min-h-dvh flex-col text-foreground">
        <PersonJsonLd />
        <ThemeProvider>
          <Starfield />
          <LenisProvider>
            <RouteHistory />
            <Nav />
            <SectionRail />
            <div className="flex-1">{children}</div>
            <Footer />
            <OrbitCompanion />
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
