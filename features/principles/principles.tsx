"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/animations/reveal";
import { principles, personalInterest } from "@/lib/content/principles";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { BrainBackground } from "./brain-background";

/**
 * S7 Engineering Principles - brain-themed: an ambient neural background,
 * emoji-tagged principle cards, and a prominent "beyond the code" callout.
 */

/** One emoji per principle, in the order they're authored. */
const principleIcons = ["\u{1F6E1}\uFE0F", "\u{1F9E9}", "\u{1F501}", "\u{1F50D}"];

const interests: [string, string][] = [
  ["\u{2708}\uFE0F", "travel"],
  ["\u{1F35C}", "good food"],
  ["\u{1F6B6}", "long walks"],
];

export function Principles() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative">
      <BrainBackground />

      <div className="relative space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <motion.div
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-surface/70"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background-elevated text-xl transition-transform duration-300 group-hover:scale-110 group-hover:border-accent/40">
                    {principleIcons[i] ?? "\u{1F9E0}"}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/[0.14] via-surface/60 to-surface/30 p-6 shadow-[0_0_40px_var(--accent-glow)] sm:p-7">
            <div className="flex items-center gap-2.5">
              <motion.span
                aria-hidden
                className="text-2xl"
                animate={
                  reduced
                    ? undefined
                    : { scale: [1, 1.14, 1], rotate: [0, -4, 4, 0] }
                }
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {"\u{1F9E0}"}
              </motion.span>
              <span className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">
                Beyond the code
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
              {personalInterest}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {interests.map(([emoji, label], i) => (
                <motion.span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-elevated/70 px-3 py-1.5 text-sm text-muted"
                  animate={reduced ? undefined : { y: [0, -3, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <span aria-hidden className="text-base">
                    {emoji}
                  </span>
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
