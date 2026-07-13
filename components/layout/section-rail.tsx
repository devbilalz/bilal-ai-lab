"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { homeSections } from "@/lib/nav";
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const IDS = homeSections.map((s) => s.id);

/* ---- vein geometry (organic, curving spine) ---- */
const STEP = 42; // vertical spacing between nodes
const PAD = 12;
const CX = 18; // vein centre-x within the svg
const AMP = 7; // horizontal wiggle amplitude
const SVG_W = 38;
const HEIGHT = PAD * 2 + (homeSections.length - 1) * STEP;

const points = homeSections.map((_, i) => ({
  x: CX + AMP * Math.sin(i * 0.82 + 0.4),
  y: PAD + i * STEP,
}));

/** Catmull-Rom → cubic bezier so the vein flows smoothly through every node. */
function toPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

const FULL_PATH = toPath(points);

/**
 * The "vein" - a fixed right-side spine of the home-page sections. An organic
 * curving SVG path threads through each word; the vein lights up to the active
 * section (scroll progress) and the current node glows + pulses. Home only, lg+.
 */
export function SectionRail() {
  const pathname = usePathname();
  const active = useScrollSpy(IDS);
  const reduced = usePrefersReducedMotion();

  if (pathname !== "/") return null;

  const activeIndex = homeSections.findIndex((s) => s.id === active);
  const progressPath =
    activeIndex >= 1 ? toPath(points.slice(0, activeIndex + 1)) : "";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.history.pushState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 hidden -translate-y-1/2 xl:block"
      style={{ zIndex: "var(--z-raised)" }}
    >
      <div className="relative" style={{ height: HEIGHT }}>
        <svg
          aria-hidden
          width={SVG_W}
          height={HEIGHT}
          viewBox={`0 0 ${SVG_W} ${HEIGHT}`}
          className="absolute right-0 top-0 overflow-visible"
        >
          <defs>
            <linearGradient id="veinFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-soft)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>

          {/* faint full vein */}
          <path
            d={FULL_PATH}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* flowing energy: a dash travelling down the whole vein (the "wave") */}
          {!reduced && (
            <motion.path
              d={FULL_PATH}
              fill="none"
              stroke="var(--accent-soft)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="10 90"
              initial={{ strokeDashoffset: 100, opacity: 0.5 }}
              animate={{ strokeDashoffset: [100, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 3px var(--accent-glow))" }}
            />
          )}

          {/* traveling glow pulse riding the vein */}
          {!reduced && (
            <circle r={2.4} fill="var(--accent)" style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}>
              <animateMotion dur="3.4s" repeatCount="indefinite" path={FULL_PATH} />
            </circle>
          )}

          {/* lit progress vein */}
          {progressPath && (
            <path
              d={progressPath}
              fill="none"
              stroke="url(#veinFill)"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
            />
          )}

          {/* nodes */}
          {points.map((p, i) => {
            const isActive = i === activeIndex;
            const passed = activeIndex >= 0 && i <= activeIndex;
            return (
              <circle
                key={homeSections[i].id}
                cx={p.x}
                cy={p.y}
                r={isActive ? 3.6 : 2}
                fill={
                  isActive
                    ? "var(--accent)"
                    : passed
                      ? "var(--accent-soft)"
                      : "var(--border-strong)"
                }
                className={isActive ? "motion-safe:animate-pulse" : undefined}
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 6px var(--accent))" }
                    : undefined
                }
              />
            );
          })}
        </svg>

        {/* words riding the vein - a horizontal ripple travels through them */}
        {homeSections.map((s, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.span
              key={s.id}
              className="absolute -translate-y-1/2"
              style={{ top: points[i].y, right: SVG_W + 8 }}
              animate={reduced ? undefined : { x: [0, -5, 0] }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.16,
                    }
              }
            >
              <Link
                href={`/#${s.id}`}
                onClick={(e) => scrollToSection(e, s.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full px-2 py-1 text-right text-xs transition-colors duration-300 hover:bg-surface/70 hover:text-foreground",
                  isActive
                    ? "font-medium text-accent [text-shadow:0_0_12px_var(--accent-glow)]"
                    : "text-subtle",
                )}
              >
                {s.label}
              </Link>
            </motion.span>
          );
        })}
      </div>
    </nav>
  );
}
