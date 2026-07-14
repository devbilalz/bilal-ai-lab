"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import {
  consumeDeepDiveOrigin,
  getPreviousPath,
  pathLabel,
  type DeepDiveOrigin,
} from "@/lib/nav-history";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

const CAREER_SLUGS = ["sphere", "duett", "joinreflect"];

type Target = { href: string; label: string };

const ORIGIN_TARGETS: Record<DeepDiveOrigin, Target> = {
  chat: { href: "/#top", label: "the Console" },
  "mission-control": { href: "/#mission-control", label: "Under the Hood" },
  timeline: { href: "/#timeline", label: "Trajectory" },
  "deep-dives": { href: "/deep-dives", label: "Case Files" },
};

/**
 * Resolve where "back" should go, honoring the actual last page. An explicit
 * origin recorded by the clicked link wins first, because it can tell apart
 * surfaces that share the "/" URL (the chat console vs Mission Control vs the
 * timeline). Otherwise we return to the exact previous in-app route (System
 * Design, Case Files, another case file, the resume...). Only a direct/external
 * landing with no history falls back to the Case Files index.
 */
function resolveTarget(
  origin: DeepDiveOrigin | null,
  prev: string | null,
  slug: string,
): Target {
  if (origin) return ORIGIN_TARGETS[origin];
  if (prev) {
    // The home page has multiple surfaces behind one URL; pick the likely one.
    if (prev === "/") {
      return CAREER_SLUGS.includes(slug)
        ? { href: "/#timeline", label: "Trajectory" }
        : { href: "/#mission-control", label: "Under the Hood" };
    }
    // Any other dedicated route: go back to exactly where they were.
    return { href: prev, label: pathLabel(prev) };
  }
  // No in-app history (direct/external) => the index.
  return { href: "/deep-dives", label: "Case Files" };
}

/**
 * History-aware "retrace" control. Defaults to the Case Files index (safe for
 * direct landings), then - after paint - upgrades to the exact place the user
 * came from (Mission Control, Career Path, or Case Files). The double-chevron
 * animates leftward like a path being retraced.
 */
export function DeepDiveBack({ slug }: { slug: string }) {
  const reduced = usePrefersReducedMotion();
  const [target, setTarget] = useState<Target>({
    href: "/deep-dives",
    label: "Case Files",
  });

  useEffect(() => {
    const origin = consumeDeepDiveOrigin();
    const id = requestAnimationFrame(() => {
      setTarget(resolveTarget(origin, getPreviousPath(), slug));
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
