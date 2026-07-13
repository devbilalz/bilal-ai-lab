"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { principles } from "@/lib/content/principles";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { BrainBackground } from "./brain-background";

/**
 * S7 Principles - single-word values, not sentences. Same interaction language
 * as the old Field Notes: colored panels that expand on hover/focus and collapse
 * to slim spines, each owning a hue. Pagination dots under the row make it clear
 * there are multiple items and let you scrub between them. The final entry is an
 * honest growing edge, tagged distinctly.
 */
export function Principles() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div className="relative">
      <BrainBackground />

      <div className="relative">
        <div className="flex flex-col gap-3 md:h-[240px] md:flex-row md:gap-2.5">
          {principles.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p.word}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${p.word}: ${p.note}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActive(i);
                }}
                style={{
                  flexGrow: isActive ? 6 : 1,
                  borderColor: isActive ? `${p.accent}66` : "var(--border)",
                  background: isActive
                    ? `linear-gradient(135deg, ${p.accent}22, color-mix(in srgb, var(--surface) 70%, transparent) 55%)`
                    : undefined,
                  boxShadow:
                    isActive && !reduced
                      ? `0 0 44px ${p.accent}26, inset 0 0 0 1px ${p.accent}1f`
                      : undefined,
                }}
                className="group relative isolate cursor-pointer overflow-hidden rounded-2xl border bg-surface/40 outline-none backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-accent md:min-w-0 md:basis-0"
              >
                {/* colored top edge that lights up when active */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
                    opacity: isActive ? 1 : 0.25,
                  }}
                />

                {/* Expanded content - always on mobile, on desktop only when active */}
                <div
                  className={`flex h-full flex-col justify-center p-5 transition-opacity duration-300 sm:p-6 ${
                    isActive
                      ? "md:opacity-100"
                      : "md:pointer-events-none md:opacity-0"
                  }`}
                >
                  {p.growth && (
                    <span
                      className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest"
                      style={{
                        borderColor: `${p.accent}66`,
                        color: p.accent,
                      }}
                    >
                      <span
                        className="inline-block size-1.5 rounded-full"
                        style={{ background: p.accent }}
                      />
                      growing edge
                    </span>
                  )}
                  <h3
                    className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    style={{ textShadow: isActive ? `0 0 24px ${p.accent}44` : undefined }}
                  >
                    {p.word}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted md:max-w-md">
                    {p.note}
                  </p>
                </div>

                {/* Collapsed spine - desktop only, when not active */}
                <div
                  aria-hidden
                  className={`absolute inset-0 hidden flex-col items-center justify-between p-4 ${
                    isActive ? "" : "md:flex"
                  }`}
                >
                  <span className="h-2" />
                  <div className="flex flex-1 items-center justify-center">
                    <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground/85 [writing-mode:vertical-rl] rotate-180">
                      {p.word}
                    </span>
                  </div>
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination dots - make it clear there are multiple values + scrub */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {principles.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.word}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.word}`}
                aria-current={isActive ? "true" : undefined}
                className="group grid place-items-center p-1"
              >
                <motion.span
                  className="block h-2 rounded-full"
                  style={{
                    background: isActive ? p.accent : "var(--border-strong)",
                    boxShadow: isActive ? `0 0 10px ${p.accent}` : undefined,
                  }}
                  animate={{ width: isActive ? 22 : 8 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
