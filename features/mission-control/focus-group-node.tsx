"use client";

import type { NodeProps } from "@xyflow/react";

/**
 * The "Current Focus" band - a non-interactive container grouping the
 * forward-looking focus areas (where the work is headed). Dashed, cyan-tinted,
 * and visually lighter than the Gemini Gym so it reads as direction, not
 * shipped work. Size comes from the node's style width/height.
 */
export function FocusGroupNode({ data }: NodeProps) {
  return (
    <div className="pointer-events-none h-full w-full rounded-2xl border border-dashed border-[#22d3ee]/40 bg-[#22d3ee]/[0.03]">
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="size-2 rounded-full bg-[#22d3ee]" />
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#67e8f9]">
          Current Focus
        </span>
        <span className="rounded-full border border-border-strong bg-background-elevated px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-muted">
          where I&apos;m headed
        </span>
        <span className="font-mono text-[0.62rem] text-subtle">
          {data.label as string}
        </span>
      </div>
    </div>
  );
}
