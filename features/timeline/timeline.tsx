"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { timeline, type TimelineStage } from "@/lib/content/timeline";
import { CompanyLogo } from "@/components/common/company-logo";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/** Company name: external site if known, else the deep dive, else plain text. */
function CompanyName({ stage }: { stage: TimelineStage }) {
  const nameClass =
    "font-mono text-[0.95rem] font-medium text-accent-soft [text-shadow:0_0_14px_var(--accent-glow)] transition-colors hover:text-accent";

  if (stage.url) {
    return (
      <a
        href={stage.url}
        target="_blank"
        rel="noreferrer"
        className={`group/name inline-flex items-center gap-0.5 ${nameClass}`}
      >
        @{stage.company}
        <ArrowUpRight className="size-3 opacity-60 transition-transform group-hover/name:translate-x-0.5 group-hover/name:-translate-y-0.5" />
      </a>
    );
  }
  if (stage.deepDive) {
    return (
      <Link href={`/deep-dives/${stage.deepDive}`} className={nameClass}>
        @{stage.company}
      </Link>
    );
  }
  return (
    <span className="font-mono text-[0.95rem] font-medium text-accent-soft [text-shadow:0_0_14px_var(--accent-glow)]">
      @{stage.company}
    </span>
  );
}

/**
 * S3 Career Timeline. A scroll-driven vertical spine "charges" as you scroll
 * through the section; each stage reveals in. Reduced motion => fully static list.
 */
export function Timeline() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative pl-8 sm:pl-10">
      {/* spine track */}
      <div className="absolute left-[9px] top-2 h-full w-px bg-border sm:left-[11px]" />
      {/* charged spine */}
      {!reduced && (
        <motion.div
          className="absolute left-[9px] top-2 h-full w-px origin-top bg-accent sm:left-[11px]"
          style={{ scaleY }}
        />
      )}

      <ol className="space-y-12">
        {timeline.map((stage, i) => (
          <motion.li
            key={stage.id}
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
          >
            <span className="absolute -left-8 top-1.5 flex size-[19px] items-center justify-center rounded-full border border-accent bg-background sm:-left-10">
              <span className="size-2 rounded-full bg-accent" />
            </span>

            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
              {stage.stage}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              {stage.role && (
                <h3 className="text-lg font-semibold">{stage.role}</h3>
              )}
              {stage.company && (
                <span className="inline-flex items-center gap-2">
                  <CompanyLogo
                    name={stage.company}
                    domain={stage.domain}
                    size={24}
                  />
                  <CompanyName stage={stage} />
                  {stage.via && (
                    <span className="font-mono text-[0.7rem] text-subtle">
                      {stage.via}
                    </span>
                  )}
                </span>
              )}
              {stage.period && (
                <span className="font-mono text-xs text-subtle">
                  {stage.period}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted">{stage.summary}</p>
            {stage.stack.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {stage.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.7rem] text-subtle"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
            {stage.deepDive && (
              <Link
                href={`/deep-dives/${stage.deepDive}`}
                className="mt-3 inline-flex text-sm font-medium text-accent hover:underline"
              >
                Deep dive →
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
