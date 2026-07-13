"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { MousePointerClick } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content/projects";

const statusColor: Record<Project["status"], string> = {
  shipped: "var(--online)",
  hardening: "var(--warn)",
  ongoing: "var(--accent)",
};

/** Cyan accent for horizon (forward-looking) nodes. */
const HORIZON = "#22d3ee";

/**
 * S2.1 custom pipeline node. Renders a project as an "AI-OS module" card with a
 * status dot. Selected/dimmed states are driven by Mission Control. Affordances:
 * pointer cursor, hover lift + glow, an "inspect" hint on hover, and a subtle
 * "ping" ring (staggered per node) so it's obvious the modules are clickable.
 */
export function ProjectNode({ data, selected }: NodeProps) {
  const project = data.project as Project;
  const dimmed = data.dimmed as boolean;
  const ping = data.ping as boolean;
  const pingDelay = (data.pingDelay as number | undefined) ?? 0;
  const horizon = Boolean(project.horizon);
  const dot = horizon ? HORIZON : statusColor[project.status];

  return (
    <div
      className={cn(
        "group relative w-52 cursor-pointer rounded-lg border bg-surface/90 px-4 py-3 text-left backdrop-blur transition-all hover:-translate-y-0.5",
        horizon && "border-dashed",
        selected
          ? "border-accent shadow-[0_0_28px_var(--accent-glow)]"
          : "border-border-strong hover:border-accent/70 hover:shadow-[0_0_20px_var(--accent-glow)]",
        dimmed && "opacity-40",
      )}
    >
      {/* interactivity beacon: subtle staggered pulse on every module */}
      {ping && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-xl border"
          style={{ borderColor: horizon ? `${HORIZON}80` : "var(--accent-soft)" }}
          animate={{ opacity: [0.45, 0, 0.45], scale: [1, 1.05, 1] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: pingDelay,
          }}
        />
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!size-1.5 !border-0 !bg-border-strong"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-widest">
          <span className="text-subtle group-hover:hidden">
            {horizon ? "focus" : project.deepDive ? "case file →" : "module"}
          </span>
          <span
            className="hidden items-center gap-1 group-hover:inline-flex"
            style={{ color: horizon ? HORIZON : "var(--accent)" }}
          >
            <MousePointerClick className="size-3" />
            {horizon ? project.focusStatus ?? "explore" : "inspect"}
          </span>
        </span>
        <span className="relative flex size-2">
          {horizon && (
            <span
              className="absolute inline-flex size-2 animate-ping rounded-full opacity-60"
              style={{ background: dot }}
            />
          )}
          <span
            className="relative inline-flex size-2 rounded-full"
            style={{ background: dot }}
          />
        </span>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-foreground">
        {project.label}
      </p>
      <p className="mt-0.5 text-xs text-muted">{project.role}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-1.5 !border-0 !bg-border-strong"
      />
    </div>
  );
}
