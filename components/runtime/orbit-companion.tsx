"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useThemeRuntime } from "@/components/providers/theme-provider";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy";
import { resolveOrbitMessage, type OrbitZone } from "@/lib/orbit-signals";

const sectionIds = [
  "top",
  "mission-control",
  "metrics",
  "timeline",
  "skills",
  "principles",
  "beyond",
  "evidence",
  "contact",
];

type Mood = "idle" | "curious" | "focused" | "excited" | "waiting";

function isOrbitZone(value: string | undefined): value is OrbitZone {
  return Boolean(value);
}

function moodFor(section: string | null, zone: OrbitZone | null): Mood {
  if (zone === "hero-send") return "excited";
  if (zone === "hero-input") return "curious";
  if (zone === "mission-control" || section === "mission-control") return "focused";
  if (zone === "contact" || zone === "footer-links" || section === "contact") return "excited";
  if (zone || section === "metrics" || section === "skills") return "curious";
  return "idle";
}

/* ---- realistic ram-air canopy geometry (SVG) ---- */
const N_CELLS = 9;
// Symmetric fabric stripes drawn from the live theme accent tokens, so the
// canopy re-tints with every phase (night / dawn / day / dusk) like the app.
const cellFill = (i: number) =>
  Math.round(Math.abs(i - (N_CELLS - 1) / 2)) % 2 === 0 ? "var(--accent)" : "var(--accent-soft)";
const VBW = 200;
const VBH = 150;
const PAD = 18; // keep the canopy off the viewBox edges so tips aren't clipped
const SPAN = VBW - PAD * 2;
const CX = VBW / 2;

const nrm = (x: number) => (x - CX) / (SPAN / 2);
const topEdge = (x: number) => 30 + 28 * nrm(x) * nrm(x);
const thickness = (x: number) => 40 * (1 - 0.4 * nrm(x) * nrm(x));
const botEdge = (x: number) => topEdge(x) + thickness(x);
const bx = (i: number) => PAD + (i / N_CELLS) * SPAN;

function cellPath(i: number) {
  const xl = bx(i);
  const xr = bx(i + 1);
  const xm = (xl + xr) / 2;
  const tl = topEdge(xl);
  const tr = topEdge(xr);
  const bl = botEdge(xl);
  const br = botEdge(xr);
  const roundL = i === 0;
  const roundR = i === N_CELLS - 1;

  let d = `M ${xl} ${tl} Q ${xm} ${topEdge(xm) - 5} ${xr} ${tr} `;
  // right edge (round the outer wingtip on the last cell)
  d += roundR ? `Q ${xr + 8} ${(tr + br) / 2} ${xr} ${br} ` : `L ${xr} ${br} `;
  // scalloped bottom
  d += `Q ${xm} ${botEdge(xm) + 7} ${xl} ${bl} `;
  // left edge (round the outer wingtip on the first cell)
  if (roundL) d += `Q ${xl - 8} ${(tl + bl) / 2} ${xl} ${tl} `;
  return `${d}Z`;
}

// Top rim arc (for the highlight), following the puffy cell tops.
const TOP_ARC = (() => {
  let d = `M ${bx(0)} ${topEdge(bx(0))}`;
  for (let i = 1; i <= N_CELLS; i++) {
    const xm = (bx(i - 1) + bx(i)) / 2;
    d += ` Q ${xm} ${topEdge(xm) - 5} ${bx(i)} ${topEdge(bx(i))}`;
  }
  return d;
})();

// Suspension risers attach across the bot the way real rigging does: a pair to
// each shoulder, a pair to the head sides, and a pair to the head centre.
const RISERS = [
  { x: CX - 52, y: 150 }, // left shoulder
  { x: CX - 30, y: 146 }, // left head-side
  { x: CX - 10, y: 143 }, // head centre (left)
  { x: CX + 10, y: 143 }, // head centre (right)
  { x: CX + 30, y: 146 }, // right head-side
  { x: CX + 52, y: 150 }, // right shoulder
];
const LINES_PER_RISER = 2;
const CANOPY_LINES = Array.from({ length: RISERS.length * LINES_PER_RISER }, (_, j) => {
  const ox = PAD + ((j + 0.5) / (RISERS.length * LINES_PER_RISER)) * SPAN;
  const riser = RISERS[Math.floor(j / LINES_PER_RISER)];
  return { x1: ox, y1: botEdge(ox) - 1, x2: riser.x, y2: riser.y };
});

function Canopy({ walking, reduced }: { walking: boolean; reduced: boolean }) {
  return (
    <motion.svg
      viewBox={`0 0 ${VBW} ${VBH}`}
      className="w-[7.5rem] overflow-visible drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)]"
      style={{ transformOrigin: "50% 0%" }}
      animate={reduced ? undefined : { scaleX: walking ? [1, 1.05, 1] : 1, scaleY: walking ? [1, 1.03, 1] : 1 }}
      transition={{ duration: 0.72, repeat: walking ? Infinity : 0, ease: "easeInOut" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="orbit-canopy-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      {/* suspension lines fanning to the six risers */}
      <g stroke="rgba(220,225,235,0.5)" strokeWidth={0.7}>
        {CANOPY_LINES.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>

      {/* fabric cells (colour + puffy shading) */}
      {Array.from({ length: N_CELLS }, (_, i) => {
        const d = cellPath(i);
        return (
          <g key={i}>
            <path d={d} fill={cellFill(i)} stroke="rgba(0,0,0,0.2)" strokeWidth={0.8} strokeLinejoin="round" />
            <path d={d} fill="url(#orbit-canopy-shade)" />
          </g>
        );
      })}

      {/* crisp top rim highlight */}
      <path d={TOP_ARC} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth={0.9} strokeLinecap="round" />
    </motion.svg>
  );
}

/** The rolled-up end of the scroll - the only thing visible when folded. */
function ScrollRoll() {
  return (
    <span
      aria-hidden
      className="relative block h-[0.55rem] w-[3.2rem] rounded-full border border-border-strong bg-gradient-to-b from-accent-soft to-accent shadow-[0_2px_6px_-1px_var(--accent)]"
    >
      <span className="absolute right-1 top-1/2 size-[0.3rem] -translate-y-1/2 rounded-full border border-border-strong/70 bg-background-elevated/70" />
      <span className="absolute left-1 top-1/2 h-px w-3 -translate-y-1/2 bg-white/25" />
    </span>
  );
}

/**
 * Vertical hint banner that hangs from the canopy on a string. It starts as a
 * rolled scroll and smoothly unrolls upward to reveal the hint stacked one
 * word per line (a "rail"). All colors come from theme tokens. It stays out of
 * layout flow, so folding never nudges the bot.
 */
function Banner({
  message,
  open,
  walking,
  reduced,
}: {
  message: string;
  open: boolean;
  walking: boolean;
  reduced: boolean;
}) {
  // The banner reads top-to-bottom, so any horizontal arrow becomes a down arrow.
  const words = message
    .replace(/->|→|➜|➡|»/g, "↓")
    .split(/\s+/)
    .filter(Boolean);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setFullHeight(contentRef.current.offsetHeight);
  }, [message]);

  const revealHeight = open ? fullHeight : 0;

  return (
    <div className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center pb-1">
      {/* banner group - sways as a whole (gentle idle, faster on scroll) */}
      <motion.div
        className="flex flex-col items-center"
        style={{ transformOrigin: "50% 100%" }}
        animate={
          reduced || !open
            ? { rotate: 0, skewX: 0 }
            : {
                rotate: walking ? [-2, 2, -2] : [-0.8, 0.8, -0.8],
                skewX: walking ? [-3.5, 3.5, -3.5] : [-1.4, 1.4, -1.4],
              }
        }
        transition={{ duration: walking ? 0.95 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* the parchment paper that unrolls upward from the roll */}
        <motion.div
          className="flex flex-col justify-end overflow-hidden"
          animate={{ height: revealHeight, opacity: open ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { height: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
        >
          <div
            ref={contentRef}
            className="relative flex flex-col items-center gap-[0.15rem] px-2.5 pb-1 pt-1.5"
          >
            {/* side rails */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
            <motion.div
              key={message}
              className="flex flex-col items-center gap-[0.15rem]"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap text-center font-mono text-[0.72rem] font-medium leading-tight tracking-tight text-foreground [text-shadow:0_0_6px_var(--background),0_0_6px_var(--background)]"
                >
                  {word}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* rolled end sits just above the string; always visible */}
        <ScrollRoll />
      </motion.div>

      {/* tether string down to the canopy */}
      <span className="h-3.5 w-px bg-gradient-to-b from-border-strong to-border-strong/20" />
    </div>
  );
}

function Parachute({
  message,
  open,
  walking,
  reduced,
}: {
  message: string;
  open: boolean;
  walking: boolean;
  reduced: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <Banner message={message} open={open} walking={walking} reduced={reduced} />
      <Canopy walking={walking} reduced={reduced} />
    </div>
  );
}

function OrbitBody({
  lookX,
  lookY,
  mood,
  walking,
  pointAngle,
  reduced,
}: {
  lookX: number;
  lookY: number;
  mood: Mood;
  walking: boolean;
  pointAngle: number;
  reduced: boolean;
}) {
  const eyeX = Math.max(-2, Math.min(2, lookX * 2));
  const eyeY = Math.max(-1.4, Math.min(1.4, lookY * 1.4));
  const happy = mood === "excited";
  const focused = mood === "focused";
  const mouth = happy
    ? "h-1.5 w-4 rounded-b-full border-b-2 border-background"
    : focused
      ? "h-0.5 w-4 rounded-full bg-background"
      : "h-1 w-3 rounded-full bg-background/85";

  // Left hand grips the parachute line; the right hand points at the target.
  const leftArm = [147, 151, 147];
  const armSpeed = 2.6;

  // Legs dangle gently, then kick like paddling while scrolling.
  const leftLeg = walking ? [24, -24, 24] : [4, -4, 4];
  const rightLeg = walking ? [-24, 24, -24] : [-4, 4, -4];
  const legSpeed = walking ? 0.4 : 3;

  const bobSpeed = 2.6;

  return (
    <div className="relative h-[5.4rem] w-[4.1rem]">
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-2 h-12 w-16 -translate-x-1/2 rounded-[1.7rem] bg-accent-soft/34 blur-md"
        animate={reduced ? undefined : { opacity: [0.32, 0.58, 0.32], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.span
        aria-hidden
        className="absolute left-[0.15rem] top-[2.35rem] h-7 w-2.5 origin-top rounded-full bg-gradient-to-b from-accent-soft to-accent-soft/55 shadow-[inset_0_0_8px_rgba(255,255,255,0.2)]"
        animate={reduced ? undefined : { rotate: leftArm }}
        transition={{ duration: armSpeed, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -bottom-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent-soft shadow-[0_0_10px_var(--accent-glow)]" />
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute right-[0.35rem] top-[2.35rem] h-8 w-2.5 origin-top rounded-full bg-gradient-to-b from-accent-soft to-accent-soft/55 shadow-[inset_0_0_8px_rgba(255,255,255,0.2)]"
        animate={{ rotate: pointAngle }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <motion.span
          className="absolute -bottom-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent-soft shadow-[0_0_10px_var(--accent-glow)]"
          animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>

      <motion.div
        className="absolute left-1/2 top-0 grid h-12 w-14 -translate-x-1/2 place-items-center rounded-[1.45rem] border border-border-strong bg-gradient-to-b from-accent-soft via-accent-soft/80 to-accent shadow-[0_0_26px_-8px_var(--accent)]"
        animate={
          reduced
            ? undefined
            : {
                y: [0, -2, 0],
                rotate: mood === "curious" ? [-2, 2, -2] : 0,
              }
        }
        transition={{ duration: bobSpeed, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -left-1.5 top-1/2 h-5 w-2 -translate-y-1/2 rounded-full bg-accent/80" />
        <span className="absolute -right-1.5 top-1/2 h-5 w-2 -translate-y-1/2 rounded-full bg-accent/80" />
        <div className="relative flex h-7 w-10 flex-col items-center justify-center gap-1 rounded-[1rem] bg-foreground/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
          <div className="flex items-center justify-center gap-2">
            {[0, 1].map((eye) => (
              <motion.span
                key={eye}
                className="h-2.5 w-1.5 rounded-full bg-background"
                style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
                animate={reduced ? undefined : { scaleY: [1, 1, 0.12, 1, 1] }}
                transition={{
                  duration: mood === "waiting" ? 2.5 : 3.8,
                  repeat: Infinity,
                  times: [0, 0.86, 0.9, 0.94, 1],
                  delay: eye * 0.03,
                }}
              />
            ))}
          </div>
          <motion.span
            className={mouth}
            animate={reduced ? undefined : { opacity: focused ? [0.8, 1, 0.8] : 1 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[1rem] left-1/2 h-9 w-9 -translate-x-1/2 rounded-b-[2rem] rounded-t-xl border border-border-strong bg-gradient-to-b from-accent-soft/55 to-background-elevated shadow-[inset_0_0_14px_rgba(255,255,255,0.08)]"
        animate={reduced ? undefined : { y: [0, 1, 0] }}
        transition={{ duration: bobSpeed, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-1/2 top-2 h-2 w-4 -translate-x-1/2 rounded-full bg-background/70" />
      </motion.div>

      <motion.span
        aria-hidden
        className="absolute bottom-0 left-[1.05rem] h-4 w-2 origin-top rounded-full bg-accent/85"
        animate={reduced ? undefined : { rotate: leftLeg }}
        transition={{ duration: legSpeed, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -bottom-0.5 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full bg-accent-soft" />
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute bottom-0 right-[1.05rem] h-4 w-2 origin-top rounded-full bg-accent/85"
        animate={reduced ? undefined : { rotate: rightLeg }}
        transition={{ duration: legSpeed, repeat: Infinity, ease: "easeInOut", delay: walking ? 0.25 : 0 }}
      >
        <span className="absolute -bottom-0.5 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-full bg-accent-soft" />
      </motion.span>
    </div>
  );
}

const airStreaks = [
  { x: -44, h: 24, delay: 0.0, opacity: 0.4, width: 2, dx: -14 },
  { x: -34, h: 34, delay: 0.22, opacity: 0.6, width: 3, dx: -10 },
  { x: -24, h: 28, delay: 0.36, opacity: 0.5, width: 2.5, dx: -16 },
  { x: -14, h: 40, delay: 0.1, opacity: 0.72, width: 3.5, dx: -6 },
  { x: -4, h: 30, delay: 0.28, opacity: 0.58, width: 2.5, dx: -3 },
  { x: 6, h: 42, delay: 0.04, opacity: 0.75, width: 3.5, dx: 4 },
  { x: 16, h: 30, delay: 0.24, opacity: 0.58, width: 2.5, dx: 8 },
  { x: 26, h: 36, delay: 0.14, opacity: 0.62, width: 3, dx: 12 },
  { x: 36, h: 26, delay: 0.32, opacity: 0.48, width: 2.5, dx: 14 },
  { x: 44, h: 22, delay: 0.44, opacity: 0.4, width: 2, dx: 16 },
];

const airDots = [
  { x: -30, delay: 0.12, dx: -10 },
  { x: -8, delay: 0.34, dx: -3 },
  { x: 14, delay: 0.2, dx: 8 },
  { x: 32, delay: 0.5, dx: 12 },
];

function AirStream() {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[11rem] w-[10rem] -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {airStreaks.map((streak, index) => (
        <motion.span
          key={`s-${index}`}
          className="absolute bottom-0 rounded-full bg-gradient-to-t from-transparent via-accent-soft to-transparent blur-[0.6px]"
          style={{
            left: `calc(50% + ${streak.x}px)`,
            height: `${streak.h}px`,
            width: `${streak.width}px`,
          }}
          animate={{
            y: [34, -158],
            x: [0, streak.dx],
            rotate: [0, streak.dx * 0.4],
            opacity: [0, streak.opacity, 0],
          }}
          transition={{ duration: 0.58, delay: streak.delay, repeat: Infinity, ease: "easeIn" }}
        />
      ))}
      {airDots.map((dot, index) => (
        <motion.span
          key={`d-${index}`}
          className="absolute bottom-0 size-1 rounded-full bg-accent-soft shadow-[0_0_8px_var(--accent)]"
          style={{ left: `calc(50% + ${dot.x}px)` }}
          animate={{ y: [20, -148], x: [0, dot.dx], opacity: [0, 0.85, 0], scale: [0.5, 1, 0.4] }}
          transition={{ duration: 0.74, delay: dot.delay, repeat: Infinity, ease: "easeIn" }}
        />
      ))}
    </motion.div>
  );
}

export function OrbitCompanion() {
  const { mode, phase, resolvedTheme, sunProgress, weather, weatherStatus } = useThemeRuntime();
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const activeSection = useScrollSpy(sectionIds);
  const section = pathname === "/" ? activeSection : null;
  const [zone, setZone] = useState<OrbitZone | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [walking, setWalking] = useState(false);
  const [poke, setPoke] = useState(false);
  const [spins, setSpins] = useState(0);
  const [pointAngle, setPointAngle] = useState(-90);
  const [bannerOpen, setBannerOpen] = useState(true);
  const foldTimer = useRef(0);

  // Any interaction (pointer move, scroll, hint change) unfurls the banner and
  // resets a fold timer; ~3s of stillness rolls it back up.
  const bumpBanner = useCallback(() => {
    setBannerOpen(true);
    window.clearTimeout(foldTimer.current);
    foldTimer.current = window.setTimeout(() => setBannerOpen(false), 3000);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    bumpBanner();
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(foldTimer.current);
    };
  }, [bumpBanner]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      setPointer({ x: nx * 2, y: ny * 2 });
      bumpBanner();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [bumpBanner]);

  useEffect(() => {
    let previousY = window.scrollY;
    let idleTimer = 0;
    const onScroll = () => {
      const nextY = window.scrollY;
      if (Math.abs(nextY - previousY) > 2) {
        setWalking(true);
        bumpBanner();
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => setWalking(false), 280);
      }
      previousY = nextY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [bumpBanner]);

  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const zoneElement = target.closest<HTMLElement>("[data-orbit-zone]");
      if (!zoneElement) return;
      setZone(isOrbitZone(zoneElement.dataset.orbitZone) ? zoneElement.dataset.orbitZone : null);
      setHint(zoneElement.dataset.orbitHint ?? null);
      const rect = zoneElement.getBoundingClientRect();
      const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
      const angle = Math.max(-130, Math.min(-50, -90 + (dy / (window.innerHeight / 2)) * 40));
      setPointAngle(angle);
    };
    const onPointerOut = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const related = event.relatedTarget;
      const leavingZone = target.closest<HTMLElement>("[data-orbit-zone]");
      if (!leavingZone) return;
      if (related instanceof Element && leavingZone.contains(related)) return;
      setZone(null);
      setHint(null);
      setPointAngle(-90);
    };
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  useEffect(() => {
    if (section) {
      document.documentElement.dataset.runtimeSection = section;
    }
  }, [section]);

  const message = useMemo(
    () =>
      resolveOrbitMessage({
        section,
        zone,
        hint,
        pathname,
        mode,
        phase,
        resolvedTheme,
        sunProgress,
        weatherStatus,
        hasWeather: Boolean(weather),
      }),
    [hint, mode, pathname, phase, resolvedTheme, section, sunProgress, weather, weatherStatus, zone],
  );

  useEffect(() => {
    bumpBanner();
  }, [message, bumpBanner]);

  const mood = poke ? "excited" : moodFor(section, zone);

  const onPoke = () => {
    setPoke(true);
    setSpins((s) => s + 1);
    window.setTimeout(() => setPoke(false), 1400);
  };

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed left-5 top-1/2 z-[var(--z-overlay)] hidden -translate-y-1/2 md:block">
      <motion.div
        aria-live="polite"
        className="relative flex flex-col items-center"
        style={{ transformOrigin: "50% 6%" }}
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: 1,
                rotate: walking ? [0, 6, 0, -6, 0] : [0, 2.6, 0, -2.6, 0],
                y: walking ? [0, -9, 0] : [0, -4, 0],
              }
        }
        transition={{
          opacity: { duration: 0.5, ease: "easeOut" },
          rotate: { duration: walking ? 1.15 : 3, repeat: Infinity, ease: "easeInOut" },
          y: { duration: walking ? 0.95 : 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <AnimatePresence>{walking && !reduced && <AirStream />}</AnimatePresence>

        <Parachute message={message} open={bannerOpen} walking={walking} reduced={reduced} />

        <button
          type="button"
          onClick={onPoke}
          aria-label="Orbit companion"
          className="group pointer-events-auto -mt-1 block h-[5.4rem] w-[4.1rem] rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="pointer-events-none block h-full w-full origin-[50%_20%] transition-transform duration-300 ease-out group-hover:scale-[1.05] group-active:scale-95">
            <motion.span
              className="block h-full w-full"
              animate={reduced ? undefined : { rotate: spins * 360, scale: poke ? [1, 1.14, 1] : 1 }}
              transition={{
                rotate: { duration: 0.8, ease: [0.34, 1.32, 0.6, 1] },
                scale: { duration: 0.65, ease: "easeInOut" },
              }}
            >
              <OrbitBody
                lookX={pointer.x}
                lookY={pointer.y}
                mood={mood}
                walking={walking}
                pointAngle={pointAngle}
                reduced={reduced}
              />
            </motion.span>
          </span>
        </button>
      </motion.div>
    </div>
  );
}
