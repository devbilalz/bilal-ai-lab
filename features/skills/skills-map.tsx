"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skillGroups, type Skill } from "@/lib/content/skills";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Per-cluster accent so each domain reads as its own constellation. */
const GROUP_COLORS: Record<string, string> = {
  "ai-llm": "#7c5cff",
  languages: "#22d3ee",
  backend: "#34d399",
  cloud: "#38bdf8",
  databases: "#f472b6",
  frontend: "#fbbf24",
};

/**
 * Irregular "broken glass" shard outlines, cycled per chip so each tag reads
 * like a rough shard rather than a plain pill.
 */
const SHARDS = [
  "polygon(4% 0, 100% 7%, 96% 100%, 0 90%)",
  "polygon(0 9%, 93% 0, 100% 88%, 7% 100%)",
  "polygon(2% 0, 100% 3%, 97% 96%, 0 100%)",
  "polygon(0 0, 96% 6%, 100% 100%, 5% 94%)",
  "polygon(5% 2%, 100% 0, 95% 93%, 0 100%)",
];

function shardFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % 997;
  return SHARDS[h % SHARDS.length];
}

/** Split "Turing, Sphere - primary language" into places + what. */
function parseApplied(s: string): { places: string[]; detail: string } {
  const idx = s.indexOf(" - ");
  if (idx === -1) return { places: [], detail: s };
  const places = s
    .slice(0, idx)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return { places, detail: s.slice(idx + 3).trim() };
}

type Active = { skill: Skill; color: string };

function SkillChip({
  skill,
  color,
  isActive,
  reduced,
  onSelect,
}: {
  skill: Skill;
  color: string;
  isActive: boolean;
  reduced: boolean;
  onSelect: () => void;
}) {
  const shard = shardFor(skill.name);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      initial="rest"
      animate="rest"
      whileHover={reduced ? undefined : "on"}
      whileTap={{ scale: 0.96 }}
      className="group relative block transition-transform duration-200 hover:-translate-y-0.5"
      style={{ clipPath: shard, ["--c" as string]: color }}
    >
      {/* colored shard edge */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-30 group-hover:opacity-80",
        )}
        style={{
          clipPath: shard,
          background: "linear-gradient(135deg, var(--c), transparent 85%)",
        }}
      />
      {/* inner surface */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-[1.5px]",
          isActive ? "bg-[color-mix(in_srgb,var(--c)_16%,var(--color-surface))]" : "bg-surface",
        )}
        style={{ clipPath: shard }}
      />
      {/* hover shimmer sweep */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-[1.5px] z-0"
          style={{
            clipPath: shard,
            background:
              "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.18) 50%, transparent 58%)",
          }}
          variants={{ rest: { x: "-130%" }, on: { x: "130%" } }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      )}
      {/* content */}
      <span
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
          isActive ? "text-foreground" : "text-muted group-hover:text-foreground",
        )}
      >
        {skill.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://cdn.simpleicons.org/${skill.icon}`}
            alt=""
            aria-hidden
            width={14}
            height={14}
            loading="lazy"
            className="size-3.5 shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {skill.name}
      </span>
    </motion.button>
  );
}

/**
 * S4 Skills Map. Clustered by domain (AI/LLM first), each cluster in its own
 * accent. Selecting a skill opens a "readout" panel: where it was applied,
 * which places, and the concrete context - no giant redundant title, since the
 * chosen chip is already lit.
 */
export function SkillsMap() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<Active | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-7">
        {skillGroups.map((group) => {
          const color = GROUP_COLORS[group.id] ?? "#7c5cff";
          return (
            <div key={group.id}>
              <p
                className="mb-2.5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-subtle"
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                {group.label}
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <SkillChip
                      skill={skill}
                      color={color}
                      reduced={reduced}
                      isActive={active?.skill.name === skill.name}
                      onSelect={() =>
                        setActive(
                          active?.skill.name === skill.name
                            ? null
                            : { skill, color },
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Applied-context readout (S4.2) */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div
          className="relative min-h-[9rem] overflow-hidden rounded-xl border bg-surface/50 p-5"
          style={{
            borderColor: active ? `${active.color}66` : "var(--color-border)",
            ["--c" as string]: active?.color ?? "var(--accent)",
          }}
        >
          {/* top hairline + corner bloom in the cluster color */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, var(--c), transparent)",
              opacity: active ? 0.9 : 0.2,
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 size-24 rounded-full blur-2xl transition-opacity duration-300"
            style={{ background: "var(--c)", opacity: active ? 0.25 : 0 }}
          />

          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.skill.name}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <p
                  className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em]"
                  style={{ color: "var(--c)" }}
                >
                  {active.skill.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://cdn.simpleicons.org/${active.skill.icon}`}
                      alt=""
                      aria-hidden
                      width={16}
                      height={16}
                      className="size-4"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  applied context
                </p>

                {(() => {
                  const { places, detail } = parseApplied(active.skill.appliedAt);
                  return (
                    <>
                      {places.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {places.map((p) => (
                            <li
                              key={p}
                              className="rounded-md border px-2 py-0.5 font-mono text-[0.68rem]"
                              style={{
                                borderColor: `${active.color}55`,
                                color: "var(--color-foreground)",
                                background: `${active.color}14`,
                              }}
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground">
                        {detail}
                      </p>
                      <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-subtle">
                        {active.skill.name}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex h-full flex-col justify-center"
              >
                <p className="text-sm text-muted">
                  Tap any skill to trace where it was actually applied.
                </p>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-subtle">
                  no bare tags - every skill maps to real work
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
