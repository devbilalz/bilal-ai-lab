"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skillGroups, type Skill } from "@/lib/content/skills";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Irregular "broken glass" shard outlines, cycled per chip. The chip is two
 * clipped layers: a gradient-filled outer (the jagged edge) and a slightly
 * smaller inner surface, so the edge reads like a rough shard rather than a
 * plain pill border.
 */
const SHARDS = [
  "polygon(4% 0, 100% 7%, 96% 100%, 0 90%)",
  "polygon(0 9%, 93% 0, 100% 88%, 7% 100%)",
  "polygon(2% 0, 100% 3%, 97% 96%, 0 100%)",
  "polygon(0 0, 96% 6%, 100% 100%, 5% 94%)",
  "polygon(5% 2%, 100% 0, 95% 93%, 0 100%)",
];

/** Stable, pure shard choice derived from the skill name. */
function shardFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % 997;
  return SHARDS[h % SHARDS.length];
}

function SkillChip({
  skill,
  isActive,
  onSelect,
}: {
  skill: Skill;
  isActive: boolean;
  onSelect: () => void;
}) {
  const shard = shardFor(skill.name);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "group block p-[1.5px] transition-transform duration-200 hover:-translate-y-0.5",
        isActive
          ? "bg-gradient-to-br from-accent to-accent-soft"
          : "bg-gradient-to-br from-border-strong to-border hover:from-accent/70 hover:to-accent-soft/70",
      )}
      style={{ clipPath: shard }}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors",
          isActive
            ? "bg-accent/15 text-foreground"
            : "bg-surface text-muted group-hover:text-foreground",
        )}
        style={{ clipPath: shard }}
      >
        {skill.icon && (
          // Official brand logo via Simple Icons CDN; hides itself if missing.
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
    </button>
  );
}

/**
 * S4 Skills Map. Grouped clusters (AI/LLM first). Selecting a skill reveals the
 * real place it was applied - every skill maps to a concrete context, no bare
 * tags and no star ratings. Fully keyboard accessible.
 */
export function SkillsMap() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<Skill | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-7">
        {skillGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-2.5 font-mono text-[0.65rem] uppercase tracking-widest text-subtle">
              {group.label}
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <SkillChip
                    skill={skill}
                    isActive={active?.name === skill.name}
                    onSelect={() =>
                      setActive(active?.name === skill.name ? null : skill)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Applied-context popover (S4.2) */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="min-h-[7rem] rounded-xl border border-border bg-surface/50 p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.name ?? "empty"}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active ? (
                <>
                  <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                    {active.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://cdn.simpleicons.org/${active.icon}`}
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
                    where it was applied
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold">{active.name}</h3>
                  <p className="mt-2 text-sm text-muted">{active.appliedAt}</p>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Select any skill to see the real project it was applied on.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
