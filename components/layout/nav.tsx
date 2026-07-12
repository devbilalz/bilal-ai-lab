import Link from "next/link";
import { site } from "@/lib/site";
import { StatusDot } from "@/components/common/status-dot";
import { SiteMenu } from "@/components/layout/site-menu";

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
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/#top"
            className="font-mono text-sm font-semibold tracking-tight text-foreground"
          >
            <span className="text-accent">~/</span>
            {site.name.toLowerCase().replace(/\s+/g, "-")}
          </Link>
          <span className="hidden sm:block">
            <StatusDot />
          </span>
        </div>

        <SiteMenu />
      </nav>
    </header>
  );
}
