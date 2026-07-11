"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CountUp } from "@/components/animations/count-up";
import { Reveal } from "@/components/animations/reveal";
import { metrics } from "@/lib/content/metrics";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * S5 Metrics Strip. Count-up on scroll-into-view; every tile links to the Deep
 * Dive / section that proves it (evidence chain). Each tile carries its own
 * accent color (glowing number, colored bloom + border), and the grid bobs in
 * sequence like a wave rolling across it every few seconds.
 */

const COLORS = [
  "#7c5cff", // violet
  "#22d3ee", // cyan
  "#34d399", // emerald
  "#fbbf24", // amber
  "#f472b6", // pink
  "#38bdf8", // sky
];

export function MetricsStrip() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {metrics.map((m, i) => {
        const c = COLORS[i % COLORS.length];
        return (
          <Reveal key={m.label} delay={i * 0.05}>
            <motion.div
              animate={reduced ? undefined : { y: [0, -12, 0] }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: 3.4,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }
              }
            >
              <Link
                href={m.evidence}
                style={{ "--m": c } as React.CSSProperties}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface/40 p-5 transition-colors hover:[border-color:var(--m)]"
              >
                {/* colored bloom, intensifies on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-45"
                  style={{ background: c }}
                />
                {/* top accent hairline */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
                  }}
                />

                <span
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{
                    color: c,
                    textShadow: `0 0 22px ${c}66`,
                  }}
                >
                  <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </span>
                <span className="relative mt-2 text-sm text-muted">
                  {m.label}
                </span>
                <span className="relative mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-subtle transition-colors group-hover:[color:var(--m)]">
                  view evidence &rarr;
                </span>
              </Link>
            </motion.div>
          </Reveal>
        );
      })}
    </div>
  );
}
