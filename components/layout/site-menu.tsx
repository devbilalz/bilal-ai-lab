"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waypoints, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { sitePages } from "@/lib/nav";
import { deepDives } from "@/lib/content/deep-dives";
import { setDeepDiveOrigin } from "@/lib/nav-history";
import { goToSection } from "@/lib/scroll-to-section";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * F7 - the single entry point to everything, framed as the system's routing
 * map. Opening it feels like a model resolving a query: a boot scan sweeps
 * the panel, destinations stream in token-by-token (blur -> focus), and each
 * row lights an "activation" bar on hover. In-page sections + dedicated pages
 * (with their sub-pages), each with a one-line description so expanded content
 * is never missed.
 */

const panelV: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

const listV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } },
};

const itemV: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipsV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

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

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/" && goToSection("top")) {
      e.preventDefault();
    }
    close();
  };

  const destinations = 1 + sitePages.length + deepDives.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-orbit-zone="system-map"
        data-orbit-hint="route map"
        data-orbit-place="left"
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:bg-surface"
      >
        <Waypoints className="size-4 text-accent transition-transform group-hover:rotate-90" />
        System Map
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="backdrop"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 overflow-y-auto overscroll-contain bg-background/85 backdrop-blur-md"
                style={{ zIndex: "var(--z-modal)" }}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                onClick={close}
              >
              {/* Faint neural grid so the void reads as a system canvas. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)," +
                    "linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                }}
              />
              {/* Ambient corner bloom. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50rem 40rem at 8% -6%, rgba(124,92,255,0.12), transparent 60%)," +
                    "radial-gradient(45rem 38rem at 104% 8%, rgba(34,211,238,0.08), transparent 58%)",
                }}
              />
              {/* Boot scan line - sweeps once on open. */}
              {!reduced && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent shadow-[0_0_16px_var(--accent-glow)]"
                  initial={{ top: "-2%", opacity: 0 }}
                  animate={{ top: ["-2%", "102%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.05, ease: "easeInOut", delay: 0.08 }}
                />
              )}

              <motion.div
                variants={panelV}
                initial={reduced ? false : "hidden"}
                animate="visible"
                exit={reduced ? { opacity: 0 } : "exit"}
                className="relative mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-5 sm:px-6 sm:py-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Console header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-accent">bilal@system</span>
                    <span className="text-subtle">:</span>
                    <span className="text-muted">~</span>
                    <span className="text-subtle">$ route --map</span>
                    <motion.span
                      aria-hidden
                      className="ml-0.5 inline-block h-3.5 w-[7px] bg-accent"
                      animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="group flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[0.68rem] text-subtle transition-colors hover:border-accent hover:text-foreground"
                  >
                    ESC
                    <X className="size-3.5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>

                <div className="mt-8 flex flex-1 flex-col gap-8 sm:mt-10 sm:gap-10">
                  {/* Main page - a single destination (the full walkthrough
                      already lives on the right-side rail, so no duplicate list) */}
                  <div>
                    <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-subtle">
                      <span className="text-accent">{"//"}</span> Main
                    </p>
                    <motion.ul variants={listV} className="mt-4">
                      <motion.li
                        variants={itemV}
                        className="group/card relative overflow-hidden rounded-xl border border-border bg-surface/40 px-4 py-4 transition-colors focus-within:border-accent hover:border-accent"
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/[0.07] to-transparent transition-transform duration-700 group-hover/card:translate-x-full" />
                        <Link
                          href="/#top"
                          onClick={goHome}
                          className="group relative flex flex-col"
                        >
                          <span className="flex items-center gap-2 font-mono text-base font-medium text-foreground group-hover:text-accent">
                            <span className="text-accent">~</span> / home
                            <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </span>
                          <span className="mt-1 text-xs text-muted">
                            The full walkthrough - inference, systems, trajectory, evidence.
                          </span>
                        </Link>
                      </motion.li>
                    </motion.ul>
                  </div>

                  {/* Dedicated pages */}
                  <div>
                    <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-subtle">
                      <span className="text-accent">{"//"}</span> Case files
                    </p>
                    <motion.ul variants={listV} className="mt-4 space-y-3">
                      {sitePages.map((p) => (
                        <motion.li
                          key={p.href}
                          variants={itemV}
                          className="group/card relative overflow-hidden rounded-xl border border-border bg-surface/40 px-4 py-3 transition-colors focus-within:border-accent hover:border-accent"
                        >
                          {/* hover sweep */}
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/[0.07] to-transparent transition-transform duration-700 group-hover/card:translate-x-full" />
                          <Link
                            href={p.href}
                            onClick={close}
                            className="group relative flex flex-col"
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
                            <motion.div
                              variants={chipsV}
                              className="relative mt-3 flex flex-wrap gap-1.5"
                            >
                              {deepDives.map((d) => (
                                <motion.span key={d.slug} variants={itemV}>
                                  <Link
                                    href={`/deep-dives/${d.slug}`}
                                    onClick={() => {
                                      setDeepDiveOrigin("deep-dives");
                                      close();
                                    }}
                                    className="inline-block rounded-md border border-border-strong bg-background-elevated px-2 py-1 font-mono text-[0.68rem] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_0_14px_var(--accent-glow)]"
                                  >
                                    {d.title}
                                  </Link>
                                </motion.span>
                              ))}
                            </motion.div>
                          )}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>

                {/* Console footer */}
                <div className="mt-10 border-t border-border pt-4 font-mono text-[0.68rem] text-subtle">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span>
                      <span className="text-accent">{destinations}</span> routes
                      resolved
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CornerDownLeft className="size-3" />
                      select a destination
                    </span>
                  </div>
                  <p className="mt-2 text-[0.66rem] leading-relaxed">
                    Context Engine: signals in · fallback-safe state · adaptive interface
                  </p>
                </div>
              </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
