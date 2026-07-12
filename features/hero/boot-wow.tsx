"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { site } from "@/lib/site";

/**
 * S1.1 Boot sequence + S1.2 Knowledge-graph "wow" moment.
 *
 * The single maximalist animation on the site. It is an OVERLAY: the Hero
 * beneath it is always server-rendered, so credibility text and LCP never
 * depend on this playing. Rules honored:
 *  - Plays once per page load: it replays on every reload / hard reload, but
 *    NOT on client-side navigations back to home within the same load (an
 *    in-memory flag resets only when the JS context is recreated on reload).
 *  - Fully skippable (button, click, Escape).
 *  - Reduced-motion => does not mount at all (static hero shows instantly).
 */

/** Resets on every full page load; persists across in-app (SPA) navigations. */
let bootPlayedThisLoad = false;

const BOOT_LINES = [
  "$ boot bilal-zahid --profile=production",
  "› mounting knowledge base ................. ok",
  "› loading Gemini Gym · DBGen · Benchmark ... ok",
  "› indexing 6+ years of production systems .. ok",
  "› systems online.",
];

const KEYWORDS = [
  "Gemini", "RLHF", "SFT", "Agentic AI", "Function Calling", "DBGen",
  "Pydantic", "Tool Use", "Benchmark", "Simulation", "Python", "FastAPI",
  "Evaluation", "Synthetic Data", "Multi-Agent", "AWS", "Docker", "Protobuf",
  "Trajectories", "Sim2Real", "Schemas", "Robustness", "Grok", "ServiceNow",
];

/** Deterministic pseudo-random so positions are stable across renders. */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Phase = "boot" | "graph" | "done";

export function BootWow() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("boot");
  const [line, setLine] = useState(0);

  // Decide whether to play - after first paint (rAF), so the overlay never
  // blocks the hero's LCP. The in-memory flag makes it replay on every reload
  // but stay quiet on client-side navigations back to home.
  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => {
      if (!bootPlayedThisLoad) setActive(true);
    });
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  const finish = useCallback(() => {
    setActive(false);
    bootPlayedThisLoad = true;
  }, []);

  // Boot line stepper.
  useEffect(() => {
    if (!active || phase !== "boot") return;
    if (line >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase("graph"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLine((l) => l + 1), 320);
    return () => clearTimeout(t);
  }, [active, phase, line]);

  // Graph phase auto-completes.
  useEffect(() => {
    if (!active || phase !== "graph") return;
    const t = setTimeout(finish, 2600);
    return () => clearTimeout(t);
  }, [active, phase, finish]);

  // Escape to skip.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  const nodes = useMemo(
    () =>
      KEYWORDS.map((word, i) => ({
        word,
        // start scattered across the viewport box (0..100 in each axis)
        sx: 8 + seeded(i) * 84,
        sy: 10 + seeded(i + 50) * 80,
      })),
    [],
  );

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="boot-wow"
          className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background"
          style={{ zIndex: "var(--z-modal)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          aria-hidden
        >
          {/* radial accent glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 45%, var(--accent-glow), transparent 70%)",
            }}
          />

          {/* Phase: boot lines */}
          {phase === "boot" && (
            <div className="relative w-full max-w-lg px-6 font-mono text-sm text-muted">
              {BOOT_LINES.slice(0, line).map((l, i) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    i === BOOT_LINES.length - 1 ? "text-online" : undefined
                  }
                >
                  {l}
                </motion.p>
              ))}
              <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
            </div>
          )}

          {/* Phase: knowledge-graph coalesce → wordmark */}
          {phase === "graph" && (
            <div className="relative h-full w-full">
              {nodes.map((n, i) => (
                <motion.span
                  key={n.word}
                  className="absolute font-mono text-xs text-accent-soft"
                  initial={{
                    left: `${n.sx}%`,
                    top: `${n.sy}%`,
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    left: "50%",
                    top: "50%",
                    opacity: [0, 1, 1, 0],
                    scale: [0.6, 1, 1, 0.3],
                  }}
                  transition={{
                    duration: 2.2,
                    times: [0, 0.25, 0.7, 1],
                    delay: seeded(i) * 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ translateX: "-50%", translateY: "-50%" }}
                >
                  {n.word}
                </motion.span>
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-3xl font-semibold tracking-tight sm:text-5xl">
                  {site.name}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  knowledge base loaded
                </p>
              </motion.div>
            </div>
          )}

          {/* Skip control */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
            className="absolute bottom-6 right-6 rounded-full border border-border-strong px-4 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
