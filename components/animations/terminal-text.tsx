"use client";

import { useEffect, useState } from "react";
import { animate } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * F9 - typewriter reveal for terminal-style lines (e.g. the `whoami →` credibility
 * line). Driven by Motion's `animate` so setState only fires inside the async
 * onUpdate callback. Under reduced motion, renders the full text immediately.
 */
export function TerminalText({
  text,
  prompt = "$",
  speed = 28,
  className,
}: {
  text: string;
  prompt?: string;
  speed?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(0, text.length, {
      duration: (text.length * speed) / 1000,
      ease: "linear",
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [text, speed, reduced]);

  const shown = reduced ? text.length : count;
  const done = shown >= text.length;

  return (
    <span className={cn("font-mono", className)}>
      {prompt && <span className="text-accent">{prompt} </span>}
      {text.slice(0, shown)}
      {!done && <span className="animate-pulse text-accent">▊</span>}
    </span>
  );
}
