"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content/projects";

const statusColor: Record<Project["status"], string> = {
  shipped: "var(--online)",
  hardening: "var(--warn)",
  ongoing: "var(--accent)",
};

/**
 * S2.1 custom pipeline node. Renders a project as an "AI-OS module" card with a
 * status dot. Selected/dimmed states are driven by Mission Control.
 */
export function ProjectNode({ data, selected }: NodeProps) {
  const project = data.project as Project;
  const dimmed = data.dimmed as boolean;

  return (
    <div
      className={cn(
        "w-52 rounded-lg border bg-surface/90 px-4 py-3 text-left backdrop-blur transition-all",
        selected
          ? "border-accent shadow-[0_0_28px_var(--accent-glow)]"
          : "border-border-strong",
        dimmed && "opacity-40",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-1.5 !border-0 !bg-border-strong"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-subtle">
          {project.deepDive ? "deep dive →" : "module"}
        </span>
        <span className="relative flex size-2">
          <span
            className="relative inline-flex size-2 rounded-full"
            style={{ background: statusColor[project.status] }}
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
