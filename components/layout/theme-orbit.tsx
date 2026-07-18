"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Moon, Sparkles, Sun, Sunrise, Sunset } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { themeModes, phaseMeta, type ThemeMode, type TimePhase } from "@/lib/theme-time";
import { useThemeRuntime } from "@/components/providers/theme-provider";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

const phaseIcons = {
  morning: Sunrise,
  day: Sun,
  evening: Sunset,
  night: Moon,
} satisfies Record<TimePhase, typeof Sun>;

function ModeGlyph({ mode, phase }: { mode: ThemeMode; phase: TimePhase }) {
  const Icon = phaseIcons[mode === "auto" ? phase : mode];
  return <Icon className="size-3.5" aria-hidden />;
}

export function ThemeOrbit() {
  const { mode, phase, sunProgress, setMode } = useThemeRuntime();
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = phaseMeta[phase];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = mode === "auto" ? current.shortLabel : phaseMeta[mode].shortLabel;
  const sunArc = Math.round(sunProgress * 100);
  const modeLabel = mode === "auto" ? "Auto sky" : `Locked ${phaseMeta[mode].shortLabel}`;

  return (
    <div
      ref={rootRef}
      className="relative"
      data-orbit-zone="context"
      data-orbit-hint="sky controls"
      data-orbit-place="left"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Context Engine: ${label}`}
        onClick={() => setOpen((value) => !value)}
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border-strong bg-background/55 px-3 py-1.5 text-sm text-foreground backdrop-blur-md transition-all hover:border-accent hover:bg-surface/80 hover:shadow-[0_0_26px_-10px_var(--accent)]"
      >
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 35% 50%, var(--celestial-glow), transparent 58%)",
          }}
        />
        <span className="relative grid size-5 place-items-center rounded-full border border-border bg-surface text-accent">
          <ModeGlyph mode={mode} phase={phase} />
        </span>
        <span className="relative hidden font-mono text-[0.72rem] sm:inline">
          {label}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Choose context engine mode"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+0.65rem)] z-[var(--z-modal)] w-72 overflow-hidden rounded-2xl border border-border bg-background-elevated/95 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl"
          >
            <div className="px-3 pb-2 pt-2">
              <p className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-widest text-subtle">
                <Sparkles className="size-3 text-accent" aria-hidden />
                Atmosphere
              </p>
              <p className="mt-1 text-xs text-muted">
                Run the sky automatically, or lock a phase.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <div className="rounded-lg border border-border bg-background/55 px-2.5 py-2">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-subtle">
                    Mode
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-foreground">
                    {modeLabel}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background/55 px-2.5 py-2">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-subtle">
                    Active
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-foreground">
                    {current.shortLabel}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background/55 px-2.5 py-2">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-subtle">
                    Sun Arc
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground">{sunArc}%</p>
                </div>
                <div className="rounded-lg border border-border bg-background/55 px-2.5 py-2">
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-subtle">
                    Motion
                  </p>
                  <p className="mt-1 text-xs font-medium text-foreground">
                    {reduced ? "reduced" : "ambient"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {themeModes.map((item) => {
                const selected = mode === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={() => {
                      setMode(item.value);
                      setOpen(false);
                    }}
                    className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-accent transition-colors group-hover/item:border-accent">
                      <ModeGlyph mode={item.value} phase={phase} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {item.description}
                      </span>
                    </span>
                    {selected && <Check className="size-4 text-online" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
