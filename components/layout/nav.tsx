import Link from "next/link";
import { site } from "@/lib/site";
import { StatusDot } from "@/components/common/status-dot";
import { SiteMenu } from "@/components/layout/site-menu";
import { ThemeOrbit } from "@/components/layout/theme-orbit";
import { WeatherWidget } from "@/components/layout/weather-widget";

/**
 * F7 - minimal, premium top bar. Just identity (wordmark + live status) and a
 * single Menu entry point. In-page section navigation lives in the right-side
 * SectionRail; everything else is one click away in the Menu overlay.
 */
export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6"
      >
        <div className="min-w-0 flex items-center gap-3">
          <Link
            href="/#top"
            className="min-w-0 truncate font-mono text-sm font-semibold tracking-tight text-foreground"
          >
            <span className="text-accent">~/</span>
            <span className="hidden min-[380px]:inline">
              {site.name.toLowerCase().replace(/\s+/g, "-")}
            </span>
            <span className="min-[380px]:hidden">bilal</span>
          </Link>
          <span className="hidden sm:block">
            <StatusDot />
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          <WeatherWidget />
          <ThemeOrbit />
          <SiteMenu />
        </div>
      </nav>
    </header>
  );
}
