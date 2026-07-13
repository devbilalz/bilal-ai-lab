"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/animations/reveal";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * S-beyond - the personal layer, kept skimmable: no story paragraph, just
 * clearly-labeled word chips grouped into "reset with" and "drawn to". Easy to
 * scan in two seconds; the emojis carry warmth without prose.
 */

interface Group {
  label: string;
  accent: string;
  items: [string, string][]; // [emoji, word]
}

const groups: Group[] = [
  {
    label: "Reset with",
    accent: "#22d3ee",
    items: [
      ["\u{2708}\uFE0F", "Travel"],
      ["\u{1F35C}", "Good food"],
      ["\u{1F6B6}", "Long walks"],
    ],
  },
  {
    label: "Drawn to",
    accent: "#8b5cf6",
    items: [
      ["\u{1F501}", "Better habits"],
      ["\u{2699}\uFE0F", "Sharper systems"],
      ["\u{1F6E0}\uFE0F", "Stubborn side projects"],
      ["\u{1F9D8}", "Calm teams, hard problems"],
    ],
  },
];

export function BeyondTheCode() {
  const reduced = usePrefersReducedMotion();

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {groups.map((g, gi) => (
          <Reveal key={g.label} delay={gi * 0.08}>
            <div
              className="h-full rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm"
              style={{ boxShadow: `inset 0 0 0 1px ${g.accent}14` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ background: g.accent, boxShadow: `0 0 10px ${g.accent}` }}
                />
                <span
                  className="font-mono text-[0.66rem] uppercase tracking-widest"
                  style={{ color: g.accent }}
                >
                  {g.label}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {g.items.map(([emoji, word], i) => (
                  <motion.span
                    key={word}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated/70 px-3.5 py-2 text-sm text-foreground"
                    whileHover={
                      reduced
                        ? undefined
                        : { y: -3, borderColor: `${g.accent}66` }
                    }
                    animate={reduced ? undefined : { y: [0, -2.5, 0] }}
                    transition={
                      reduced
                        ? undefined
                        : {
                            duration: 2.6,
                            repeat: Infinity,
                            delay: i * 0.25 + gi * 0.15,
                            ease: "easeInOut",
                          }
                    }
                  >
                    <span aria-hidden className="text-base">
                      {emoji}
                    </span>
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
