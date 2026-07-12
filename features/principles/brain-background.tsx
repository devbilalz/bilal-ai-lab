"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * Decorative "brain" - a loose neural graph laid out as two lobes, with nodes
 * that fire (opacity pulse) and signals that travel along synapses. Purely
 * ambient: pointer-events-none, sits behind the section content.
 */
const nodes: [number, number][] = [
  [118, 96],
  [88, 142],
  [140, 150],
  [112, 198],
  [168, 206],
  [198, 120],
  [228, 92],
  [280, 140],
  [248, 158],
  [300, 196],
  [238, 206],
  [196, 178],
  [158, 112],
  [268, 112],
];

const edges: [number, number][] = [
  [0, 1],
  [0, 12],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 11],
  [2, 11],
  [12, 5],
  [5, 11],
  [5, 6],
  [6, 13],
  [13, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [8, 11],
  [6, 7],
  [5, 13],
];

/** Synapses that carry a travelling pulse. */
const signals: [number, number][] = [
  [0, 12],
  [12, 5],
  [5, 6],
  [6, 13],
  [13, 7],
  [8, 9],
];

export function BrainBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[380px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        {/* soft cognitive glow */}
        <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

        <svg
          viewBox="0 0 400 300"
          className="relative size-full opacity-[0.18]"
          fill="none"
        >
          {edges.map(([a, b], i) => (
            <line
              key={`e${i}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              stroke="var(--accent)"
              strokeWidth={0.8}
              strokeOpacity={0.55}
            />
          ))}

          {nodes.map(([x, y], i) =>
            reduced ? (
              <circle key={`n${i}`} cx={x} cy={y} r={2.6} fill="var(--accent)" />
            ) : (
              <motion.circle
                key={`n${i}`}
                cx={x}
                cy={y}
                r={2.6}
                fill="var(--accent)"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: (i % 7) * 0.35,
                  ease: "easeInOut",
                }}
              />
            ),
          )}

          {!reduced &&
            signals.map(([a, b], i) => (
              <motion.circle
                key={`s${i}`}
                r={2.2}
                fill="var(--accent)"
                style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
                initial={{ cx: nodes[a][0], cy: nodes[a][1], opacity: 0 }}
                animate={{
                  cx: [nodes[a][0], nodes[b][0]],
                  cy: [nodes[a][1], nodes[b][1]],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.9,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
        </svg>
      </div>
    </div>
  );
}
