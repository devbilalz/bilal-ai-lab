"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { getPreviousPath, pathLabel } from "@/lib/nav-history";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * On-brand "return to base" control for dedicated pages. Reads like a terminal
 * command (`cd ~/`) with a beckoning arrow and a blinking cursor, so it feels
 * like part of the AI-OS rather than a plain browser back button.
 *
 * History-aware: defaults to home (safe for direct/external landings), then
 * after paint upgrades to the exact page the user came from - so from, say,
 * System Design into Case Files, "back" returns to System Design, not home.
 */
export function BackHome({ label = "back to the lab" }: { label?: string }) {
  const reduced = usePrefersReducedMotion();
  const [target, setTarget] = useState<{ href: string; label: string; home: boolean }>(
    { href: "/", label, home: true },
  );

  useEffect(() => {
    const prev = getPreviousPath();
    const id = requestAnimationFrame(() => {
      if (prev && prev !== "/") {
        setTarget({ href: prev, label: pathLabel(prev), home: false });
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Link
      href={target.href}
      className="group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/40 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
    >
      <motion.span
        aria-hidden
        className="text-accent"
        animate={reduced ? undefined : { x: [0, -4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        &larr;
      </motion.span>
      <span>
        <span className="text-accent">cd</span>
        {target.home ? " ~/" : ""}
      </span>
      <span className="text-subtle transition-colors group-hover:text-foreground">
        {target.label}
      </span>
      <motion.span
        aria-hidden
        className="inline-block h-3 w-1.5 bg-accent"
        animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </Link>
  );
}
