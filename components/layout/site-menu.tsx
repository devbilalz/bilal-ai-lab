"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Waypoints, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { homeSections, sitePages } from "@/lib/nav";
import { deepDives } from "@/lib/content/deep-dives";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * F7 - the single entry point to everything. A "Menu" button that opens a
 * full site map: in-page sections + dedicated pages (with their sub-pages), each
 * with a one-line description so deeper content is never missed.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:bg-surface"
      >
        <Waypoints className="size-4 text-accent transition-transform group-hover:rotate-90" />
        System Map
      </button>

      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="backdrop"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-background/85 backdrop-blur-md"
              style={{ zIndex: "var(--z-modal)" }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              onClick={close}
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    Navigate
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mt-10 grid flex-1 gap-12 md:grid-cols-2">
                  {/* In-page sections */}
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-widest text-subtle">
                      Get to know me
                    </p>
                    <ul className="mt-4 space-y-1">
                      {homeSections.map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/#${s.id}`}
                            onClick={close}
                            className="group flex items-baseline justify-between gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-surface"
                          >
                            <span className="text-base font-medium text-foreground group-hover:text-accent">
                              {s.label}
                            </span>
                            <span className="text-right text-xs text-subtle">
                              {s.desc}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dedicated pages */}
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-widest text-subtle">
                      Go deeper
                    </p>
                    <ul className="mt-4 space-y-3">
                      {sitePages.map((p) => (
                        <li
                          key={p.href}
                          className="rounded-lg border border-border bg-surface/40 px-4 py-3 transition-colors focus-within:border-accent hover:border-accent"
                        >
                          <Link
                            href={p.href}
                            onClick={close}
                            className="group flex flex-col"
                          >
                            <span className="flex items-center gap-2 text-base font-medium text-foreground group-hover:text-accent">
                              {p.label}
                              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                            </span>
                            <span className="mt-0.5 text-xs text-muted">
                              {p.desc}
                            </span>
                          </Link>
                          {p.href === "/deep-dives" && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {deepDives.map((d) => (
                                <Link
                                  key={d.slug}
                                  href={`/deep-dives/${d.slug}`}
                                  onClick={close}
                                  className="rounded-md border border-border-strong bg-background-elevated px-2 py-1 font-mono text-[0.68rem] text-muted transition-colors hover:text-accent"
                                >
                                  {d.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
