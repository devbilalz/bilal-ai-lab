"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { getPreviousPath } from "@/lib/nav-history";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

const CAREER_SLUGS = ["sphere", "duett", "joinreflect"];

type Target = { href: string; label: string };

/** Resolve where "back" should go from the path the user actually came from. */
function resolveTarget(prev: string | null, slug: string): Target {
  if (prev && prev.startsWith("/deep-dives")) {
    return { href: "/deep-dives", label: "Deep Dives" };
  }
  if (prev === "/") {
    return CAREER_SLUGS.includes(slug)
      ? { href: "/#timeline", label: "Career Path" }
      : { href: "/#mission-control", label: "Mission Control" };
  }
  // No in-app history (direct/external/menu) => the index.
  return { href: "/deep-dives", label: "Deep Dives" };
}

/**
 * History-aware "retrace" control. Defaults to the Deep Dives index (safe for
 * direct landings), then - after paint - upgrades to the exact place the user
 * came from (Mission Control, Career Path, or Deep Dives). The double-chevron
 * animates leftward like a path being retraced.
 */
export function DeepDiveBack({ slug }: { slug: string }) {
  const reduced = usePrefersReducedMotion();
  const [target, setTarget] = useState<Target>({
    href: "/deep-dives",
    label: "Deep Dives",
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTarget(resolveTarget(getPreviousPath(), slug));
    });
    return () => cancelAnimationFrame(id);
  }, [slug]);

  return (
    <Link
      href={target.href}
      className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/40 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
    >
      <span aria-hidden className="relative flex h-4 w-5 items-center">
        <motion.span
          className="absolute left-0 text-accent"
          animate={reduced ? undefined : { x: [2, -2, 2], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
        </motion.span>
        <motion.span
          className="absolute left-1.5 text-accent-soft"
          animate={reduced ? undefined : { x: [2, -2, 2], opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.18,
          }}
        >
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
        </motion.span>
      </span>
      <span>
        retrace to{" "}
        <span className="text-foreground transition-colors group-hover:text-accent">
          {target.label}
        </span>
      </span>
    </Link>
  );
}
