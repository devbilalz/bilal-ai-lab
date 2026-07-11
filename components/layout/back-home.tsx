"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * On-brand "return to base" control for dedicated pages. Reads like a terminal
 * command (`cd ~/`) with a beckoning arrow and a blinking cursor, so it feels
 * like part of the AI-OS rather than a plain browser back button.
 */
export function BackHome({ label = "back to the lab" }: { label?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <Link
      href="/"
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
        <span className="text-accent">cd</span> ~/
      </span>
      <span className="text-subtle transition-colors group-hover:text-foreground">
        {label}
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
