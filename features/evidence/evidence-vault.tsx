"use client";

import type { CSSProperties } from "react";
import { Award, Folder, Quote, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { evidence, type EvidenceItem } from "@/lib/content/evidence";

/**
 * S6 - third-party proof, rendered as a static directory listing over the same
 * ~/bilal-zahid filesystem the nav header uses. No clicking: every file's full
 * contents are shown inline. Each item is one full-width "file" hanging off the
 * parent folder via a tree connector (recommendations + honors).
 */

const KIND: Record<
  EvidenceItem["kind"],
  { label: string; Icon: LucideIcon; color: string }
> = {
  education: { label: "credential", Icon: Award, color: "var(--accent)" },
  honor: { label: "honor", Icon: Award, color: "var(--warn)" },
  recommendation: { label: "reference", Icon: Quote, color: "var(--online)" },
};

export function EvidenceVault() {
  return (
    <div className="w-full">
      {/* Folder header - the parent directory these files hang off */}
      <Reveal>
        <div className="flex items-center justify-between gap-3 rounded-t-xl border border-border bg-background-elevated/70 px-4 py-2.5 font-mono text-xs backdrop-blur">
          <div className="flex min-w-0 items-center gap-1.5">
            <Folder className="size-3.5 shrink-0 text-accent" />
            <span className="truncate">
              <span className="text-accent">~/</span>
              <span className="text-muted">bilal-zahid</span>
              <span className="text-subtle">/</span>
              <span className="text-foreground">references</span>
            </span>
          </div>
          <span className="shrink-0 text-subtle">{evidence.length} files</span>
        </div>
      </Reveal>

      {/* File list - vertical, one full-width file per row */}
      <div className="divide-y divide-border rounded-b-xl border border-t-0 border-border bg-surface/30">
        {evidence.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08}>
            <FileRow item={item} last={i === evidence.length - 1} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function FileRow({ item, last }: { item: EvidenceItem; last: boolean }) {
  const { Icon, color, label } = KIND[item.kind];

  return (
    <div
      style={{ "--tile": color } as CSSProperties}
      data-orbit-zone="evidence"
      data-orbit-hint="proof node"
      data-orbit-place="left"
      className="group relative flex gap-3 p-4 transition-colors hover:bg-surface/50 sm:gap-4 sm:p-5"
    >
      {/* lit left edge on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "var(--tile)" }}
      />

      {/* tree connector */}
      <span
        aria-hidden
        className="mt-0.5 shrink-0 select-none font-mono text-sm text-subtle"
      >
        {last ? "└─" : "├─"}
      </span>

      <div className="min-w-0 flex-1">
        {/* file header line */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{
              color,
              background: "color-mix(in srgb, var(--tile) 14%, transparent)",
              boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--tile) 28%, transparent)",
            }}
          >
            <Icon className="size-4" strokeWidth={1.9} />
          </span>
          <span className="truncate font-mono text-sm text-foreground">
            {item.fileName}
          </span>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider"
            style={{
              color,
              background: "color-mix(in srgb, var(--tile) 14%, transparent)",
            }}
          >
            {item.ext}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-subtle">
            {label}
          </span>
        </div>

        {/* body: verbatim quote for references, context otherwise */}
        {item.quote ? (
          <blockquote className="relative mt-3 rounded-xl border border-border bg-background/50 p-4 pl-10 text-sm leading-relaxed text-muted">
            <Quote
              className="absolute left-3.5 top-4 size-4"
              style={{ color }}
              strokeWidth={2}
            />
            <span className="italic">{item.quote}</span>
            {item.attribution && (
              <footer className="mt-3 font-mono text-xs not-italic text-subtle">
                - {item.attribution}
              </footer>
            )}
          </blockquote>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {item.context}
          </p>
        )}

        {/* real metadata + source */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.meta.map((m) => (
            <span
              key={m}
              className="rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-[0.66rem] text-muted"
            >
              {m}
            </span>
          ))}
          {item.source && (
            <span className="font-mono text-[0.62rem] text-subtle">
              · source:{" "}
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-accent"
                >
                  {item.source}
                </a>
              ) : (
                item.source
              )}
              {item.sourceNote && (
                <span className="text-subtle"> ({item.sourceNote})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
