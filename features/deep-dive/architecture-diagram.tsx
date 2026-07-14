"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { ChevronRight, CornerDownRight, RotateCcw } from "lucide-react";
import type { Diagram } from "@/lib/content/diagrams";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * A schematic pipeline: horizontal on desktop, vertical on mobile. Nodes stagger
 * in and the connectors point right (desktop) or down (mobile). Purely visual -
 * it re-expresses the Architecture section, it doesn't add new claims.
 */
export function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch">
        {diagram.steps.map((step, i) => (
          <Fragment key={step.label}>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex-1 rounded-xl border border-border bg-surface/40 p-3.5 transition-colors hover:border-accent/60"
            >
              <span className="font-mono text-[0.6rem] text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-sm font-semibold leading-tight text-foreground">
                {step.label}
              </p>
              {step.sub && (
                <p className="mt-1 text-[0.72rem] leading-snug text-muted">{step.sub}</p>
              )}
            </motion.div>

            {i < diagram.steps.length - 1 && (
              <div className="flex items-center justify-center text-subtle sm:px-0.5">
                <ChevronRight className="size-4 rotate-90 sm:rotate-0" aria-hidden />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {diagram.inject && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-warn/40 bg-warn/[0.05] px-3.5 py-2.5">
          <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-warn" aria-hidden />
          <p className="text-[0.78rem] leading-snug text-muted">{diagram.inject}</p>
        </div>
      )}

      {diagram.loop && (
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-accent/40 bg-accent/[0.05] px-3.5 py-2.5"
        >
          <motion.span
            aria-hidden
            className="shrink-0 text-accent"
            animate={reduced ? undefined : { rotate: -360 }}
            transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <RotateCcw className="size-3.5" />
          </motion.span>
          <p className="text-[0.78rem] leading-snug text-muted">{diagram.loop}</p>
        </motion.div>
      )}

      {diagram.outputs && diagram.outputs.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
            produces
          </span>
          <div className="flex flex-wrap gap-2">
            {diagram.outputs.map((o) => (
              <div
                key={o.label}
                className="rounded-lg border border-accent/30 bg-accent/[0.06] px-3 py-1.5"
              >
                <span className="text-sm font-semibold text-foreground">{o.label}</span>
                {o.sub && <span className="ml-2 text-[0.72rem] text-muted">{o.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {diagram.caption && (
        <p className="mt-3 text-xs leading-relaxed text-subtle">{diagram.caption}</p>
      )}
    </div>
  );
}
