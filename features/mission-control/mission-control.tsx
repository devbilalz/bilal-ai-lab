"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import {
  projects,
  projectEdges,
  projectBySlug,
  geminiGym,
} from "@/lib/content/projects";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ProjectNode } from "./project-node";
import { GymGroupNode } from "./gym-group-node";

const nodeTypes = { project: ProjectNode, gymGroup: GymGroupNode };

/**
 * Positions. Gym components are relative to the group; standalone are absolute.
 * Wide horizontal gaps between the three Gym modules leave room for the edge
 * labels ("worlds", "tools") to render clearly between them.
 */
const gymChildPos: Record<string, { x: number; y: number }> = {
  dbgen: { x: 24, y: 78 },
  "agent-apis": { x: 320, y: 78 },
  "benchmark-suite": { x: 616, y: 78 },
};
const standalonePos: Record<string, { x: number; y: number }> = {
  "rlhf-sft": { x: 616, y: 350 },
  "swe-evaluation": { x: 24, y: 350 },
};

export function MissionControl() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  const nodes: Node[] = useMemo(() => {
    const group: Node = {
      id: geminiGym.id,
      type: "gymGroup",
      position: { x: 0, y: 0 },
      data: { label: "training + evaluation program" },
      style: { width: 848, height: 214 },
      selectable: false,
      draggable: false,
      zIndex: 0,
    };

    const projectNodes: Node[] = projects.map((p) => {
      const inGym = Boolean(p.inGym);
      return {
        id: p.slug,
        type: "project",
        position: inGym ? gymChildPos[p.slug] : standalonePos[p.slug],
        ...(inGym ? { parentId: geminiGym.id, extent: "parent" as const } : {}),
        data: { project: p, dimmed: selected !== null && selected !== p.slug },
        selected: selected === p.slug,
        draggable: false,
      };
    });

    return [group, ...projectNodes];
  }, [selected]);

  const edges: Edge[] = useMemo(
    () =>
      projectEdges.map((e) => {
        const active =
          selected !== null && (e.from === selected || e.to === selected);
        return {
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          label: e.label,
          animated: active && !reduced,
          labelShowBg: true,
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
          labelStyle: { fill: "var(--fg-muted)", fontSize: 10 },
          labelBgStyle: { fill: "var(--bg-elevated)" },
          style: {
            stroke: active ? "var(--accent)" : "var(--border-strong)",
            strokeWidth: active ? 2 : 1.2,
            opacity: selected !== null && !active ? 0.2 : 1,
          },
        };
      }),
    [selected, reduced],
  );

  const active = selected ? projectBySlug(selected) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="relative h-[600px] overflow-hidden rounded-xl border border-border bg-background-elevated">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            if (node.id === geminiGym.id) return;
            setSelected(node.id);
          }}
          onPaneClick={() => setSelected(null)}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          minZoom={0.3}
          maxZoom={1.75}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          panOnDrag
          zoomOnDoubleClick
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="var(--border)" />
          <Controls
            showInteractive={false}
            className="!border-border !bg-background-elevated [&_button]:!border-border [&_button]:!bg-surface [&_button]:!fill-muted"
          />
        </ReactFlow>
      </div>

      {/*
        Detail lives in its own column (never over the map, so no node is ever
        hidden). When a module is selected the panel "hangs" in from a peg and
        swings to rest like a placard; height is driven by content.
      */}
      <div className="lg:sticky lg:top-24">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.slug}
              style={{ transformOrigin: "top center" }}
              initial={reduced ? false : { rotate: -5, y: -14, opacity: 0 }}
              animate={{
                rotate: reduced ? 0 : [-5, 3.5, -1.8, 0.7, 0],
                y: 0,
                opacity: 1,
              }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, rotate: -3 }}
              transition={{ duration: reduced ? 0.2 : 0.95, ease: "easeOut" }}
              className="relative pt-6"
            >
              {/* peg + strings the placard hangs from */}
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_2px_var(--accent-glow)]" />
              <span className="absolute left-[calc(50%-34px)] top-1.5 h-5 w-px bg-border-strong" />
              <span className="absolute left-[calc(50%+34px)] top-1.5 h-5 w-px bg-border-strong" />

              <div className="relative rounded-xl border border-accent/40 bg-surface/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_40px_var(--accent-glow)] backdrop-blur">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="absolute right-3 top-3 text-subtle transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>

                <p className="pr-6 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                  {active.role}
                  {active.inGym ? " · Gemini Gym" : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{active.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {active.summary}
                </p>

                <dl className="mt-4 flex flex-wrap gap-2">
                  {active.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg bg-background-elevated px-3 py-2"
                    >
                      <dt className="text-sm font-semibold text-foreground">
                        {s.value}
                      </dt>
                      <dd className="text-[0.7rem] leading-tight text-subtle">
                        {s.label}
                      </dd>
                    </div>
                  ))}
                </dl>

                {active.deepDive && (
                  <Link
                    href={`/deep-dives/${active.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    Read the deep dive
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-dashed border-border-strong bg-surface/30 p-5"
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">
                {geminiGym.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {geminiGym.tagline}
              </p>
              <p className="mt-3 text-sm text-subtle">
                Select any module in the map to hang its details here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
