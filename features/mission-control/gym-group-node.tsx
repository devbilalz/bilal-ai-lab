"use client";

import type { NodeProps } from "@xyflow/react";

/**
 * S2 - the "Gemini Gym" umbrella container. Non-interactive background node that
 * visually groups its three components (Agent APIs, DBGen, Benchmark Suite).
 * Size comes from the node's style width/height set in Mission Control.
 */
export function GymGroupNode({ data }: NodeProps) {
  return (
    <div className="pointer-events-none h-full w-full rounded-2xl border border-accent/35 bg-accent/[0.04]">
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="size-2 rounded-full bg-accent" />
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent">
          Gemini Gym
        </span>
        <span className="rounded-full border border-border-strong bg-background-elevated px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-muted">
          for Google
        </span>
        <span className="font-mono text-[0.62rem] text-subtle">
          {data.label as string}
        </span>
      </div>
    </div>
  );
}
