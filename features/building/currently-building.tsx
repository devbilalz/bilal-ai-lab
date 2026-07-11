"use client";

import { Boxes, Database, Gauge, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/animations/reveal";
import { currentlyBuilding } from "@/lib/content/principles";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * S8 Currently Building - the focus areas rendered as "live experiments":
 * a slowly rotating aurora border, a running signal bar, a live status verb
 * with a blinking cursor, and an index counter. Reads like active processes,
 * not a static bullet list. Reduced motion => everything settles calmly.
 */

const ICONS: LucideIcon[] = [Boxes, Database, Gauge];
const COLORS = ["#7c5cff", "#22d3ee", "#34d399"];

export function CurrentlyBuilding() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {currentlyBuilding.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        const c = COLORS[i % COLORS.length];
        return (
          <Reveal key={item.title} delay={i * 0.08}>
            <div
              style={{ "--m": c } as React.CSSProperties}
              className="group relative h-full overflow-hidden rounded-xl p-px"
            >
              {/* rotating aurora border */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-[-40%] opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${c} 60deg, transparent 130deg)`,
                }}
                animate={reduced ? undefined : { rotate: 360 }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 8, repeat: Infinity, ease: "linear" }
                }
              />

              <div className="relative flex h-full flex-col rounded-[calc(0.75rem-1px)] bg-background-elevated p-5">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border-strong"
                    style={{ color: c, boxShadow: `0 0 18px -6px ${c}` }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="font-mono text-[0.65rem] text-subtle">
                    {String(i + 1).padStart(2, "0")} / {String(currentlyBuilding.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{item.body}</p>

                {/* live status */}
                <div className="mt-4 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest">
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{ background: c, boxShadow: `0 0 8px ${c}` }}
                  />
                  <span style={{ color: c }}>{item.status}</span>
                  <motion.span
                    aria-hidden
                    className="inline-block h-3 w-1"
                    style={{ background: c }}
                    animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
                    transition={
                      reduced
                        ? undefined
                        : { duration: 1, repeat: Infinity, ease: "linear" }
                    }
                  />
                </div>

                {/* running signal bar */}
                <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-surface">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-1/3 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
                    }}
                    animate={reduced ? { x: "0%" } : { x: ["-120%", "320%"] }}
                    transition={
                      reduced
                        ? undefined
                        : {
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                          }
                    }
                  />
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
