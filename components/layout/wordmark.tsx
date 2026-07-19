"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { goToSection } from "@/lib/scroll-to-section";

/**
 * Identity wordmark. On the home page it scrolls to the top section with a
 * single clean hash; on other routes it navigates home normally.
 */
export function Wordmark() {
  const pathname = usePathname();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/" && goToSection("top")) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href="/#top"
      onClick={onClick}
      className="min-w-0 truncate font-mono text-sm font-semibold tracking-tight text-foreground"
    >
      <span className="text-accent">~/</span>
      <span className="hidden min-[380px]:inline">
        {site.name.toLowerCase().replace(/\s+/g, "-")}
      </span>
      <span className="min-[380px]:hidden">bilal</span>
    </Link>
  );
}
