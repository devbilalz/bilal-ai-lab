"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { TerminalText } from "@/components/animations/terminal-text";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * The hero's one Easter egg (locked): the `$ whoami` line is quietly clickable.
 * Clicking it prints a fake `ls /home/bilal` that maps to the site's real
 * sections. No hint, no fanfare - it just rewards curiosity about an element
 * already in plain sight, staying coherent with the terminal/OS metaphor.
 */
const ENTRIES: { name: string; href: string; dir: boolean }[] = [
  { name: "projects", href: "/#mission-control", dir: true },
  { name: "architecture", href: "/system-design", dir: true },
  { name: "resume", href: "/resources", dir: false },
  { name: "timeline", href: "/#timeline", dir: true },
  { name: "contact", href: "/#contact", dir: true },
];

export function WhoamiReveal() {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Run whoami"
        className="cursor-pointer rounded transition-colors hover:text-foreground"
      >
        <TerminalText text="whoami" prompt="$" className="text-sm text-muted" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            animate={
              reduced ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }
            }
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 inline-block text-left font-mono text-[0.78rem] leading-relaxed">
              <p className="text-subtle">
                <span className="text-accent">$</span> ls /home/bilal
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {ENTRIES.map((e) => (
                  <Link
                    key={e.name}
                    href={e.href}
                    onClick={() => setOpen(false)}
                    className="text-accent-soft transition-colors hover:text-accent hover:underline"
                  >
                    {e.name}
                    {e.dir ? "/" : ""}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
