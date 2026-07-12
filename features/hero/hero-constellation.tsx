"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * The hero's one signature moment: a faint node graph that "activates" behind
 * the name - lines draw themselves in, nodes breathe, and the whole network
 * drifts and tilts gently toward the cursor so it feels alive. Deliberately
 * understated (low opacity, single accent) so it reinforces the AI-infra story
 * without competing with the type. Fully static under reduced motion.
 */
const NODES: { x: number; y: number }[] = [
  { x: 70, y: 66 },
  { x: 150, y: 150 },
  { x: 120, y: 34 },
  { x: 300, y: 56 },
  { x: 250, y: 186 },
  { x: 400, y: 116 },
  { x: 486, y: 58 },
  { x: 566, y: 150 },
  { x: 512, y: 200 },
  { x: 372, y: 198 },
];

const LINKS: [number, number][] = [
  [0, 2],
  [0, 1],
  [1, 4],
  [2, 3],
  [3, 5],
  [4, 9],
  [5, 6],
  [6, 7],
  [5, 9],
  [7, 8],
  [3, 0],
];

export function HeroConstellation() {
  const reduced = usePrefersReducedMotion();

  // Normalized pointer position (-0.5 .. 0.5) relative to the viewport.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 55, damping: 18, mass: 0.7 });
  const spy = useSpring(py, { stiffness: 55, damping: 18, mass: 0.7 });

  const x = useTransform(spx, [-0.5, 0.5], [-22, 22]);
  const y = useTransform(spy, [-0.5, 0.5], [-15, 15]);
  const rotateY = useTransform(spx, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(spy, [-0.5, 0.5], [7, -7]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        style={
          reduced
            ? undefined
            : { x, y, rotateX, rotateY, transformPerspective: 900 }
        }
        className="h-[240px] w-[640px] max-w-[92vw] opacity-70"
      >
        <svg viewBox="0 0 640 240" className="h-full w-full" fill="none">
          {LINKS.map(([a, b], i) => (
            <motion.line
              key={`l-${i}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="var(--accent)"
              strokeWidth={1}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.22 }}
              transition={
                reduced
                  ? undefined
                  : { duration: 1.3, delay: 0.5 + i * 0.11, ease: "easeInOut" }
              }
            />
          ))}
          {NODES.map((n, i) => (
            <motion.circle
              key={`n-${i}`}
              cx={n.x}
              cy={n.y}
              r={2.4}
              fill="var(--accent)"
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              animate={
                reduced
                  ? { opacity: 0.5 }
                  : { opacity: [0.28, 0.85, 0.28], scale: 1 }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      scale: {
                        duration: 0.5,
                        delay: 0.4 + i * 0.09,
                        ease: "easeOut",
                      },
                      opacity: {
                        duration: 3.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.32,
                      },
                    }
              }
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
