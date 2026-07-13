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
  horizonProjects,
  projectEdges,
  projectBySlug,
  geminiGym,
  currentFocus,
  type Project,
} from "@/lib/content/projects";
import { setDeepDiveOrigin } from "@/lib/nav-history";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ProjectNode } from "./project-node";
import { GymGroupNode } from "./gym-group-node";
import { FocusGroupNode } from "./focus-group-node";

const nodeTypes = {
  project: ProjectNode,
  gymGroup: GymGroupNode,
  focusGroup: FocusGroupNode,
};

/**
 * Positions. Gym + focus children are relative to their group; standalone Turing
 * projects are absolute. Wide horizontal gaps between modules leave room for the
 * edge labels ("worlds", "tools") to render clearly between them.
 *
 * The shipped pipeline and the forward-looking "Current Focus" cluster are TWO
 * fully independent boards - each owns its own selection and its own hanging
 * detail card, so selecting a focus area never disturbs the pipeline (and vice
 * versa).
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
const focusChildPos: Record<string, { x: number; y: number }> = {
  "focus-orchestration": { x: 24, y: 56 },
  "focus-synthetic": { x: 320, y: 56 },
  "focus-eval": { x: 616, y: 56 },
};
const FOCUS_GROUP_H = 190;

/* ------------------------------------------------------------------ canvas -- */

function MapCanvas({
  nodes,
  edges,
  height,
  onSelect,
  onClear,
  ariaLabel,
}: {
  nodes: Node[];
  edges: Edge[];
  height: number;
  onSelect: (id: string) => void;
  onClear: () => void;
  ariaLabel: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="relative overflow-hidden rounded-xl border border-border bg-background-elevated"
      style={{ height }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          if (node.type !== "project") return; // group containers aren't selectable
          onSelect(node.id);
        }}
        onPaneClick={onClear}
        fitView
        fitViewOptions={{ padding: 0.06 }}
        minZoom={0.2}
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
  );
}

/* ------------------------------------------------------------ detail card -- */

function DetailPanel({
  active,
  onClose,
  idleLabel,
  idleTagline,
  idleHint,
}: {
  active: Project | null;
  onClose: () => void;
  idleLabel: string;
  idleTagline: string;
  idleHint: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative lg:sticky lg:top-24">
      <AnimatePresence mode="popLayout">
        {active ? (
          <motion.div
            key={active.slug}
            style={{ transformOrigin: "top center" }}
            initial={
              reduced ? false : { opacity: 0, y: -12, scaleY: 0.28, rotate: -3 }
            }
            animate={{ opacity: 1, y: 0, scaleY: 1, rotate: 0 }}
            exit={
              reduced
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scaleY: 0.4,
                    y: -8,
                    transition: { duration: 0.22, ease: "easeIn" },
                  }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 0.28, ease: "easeOut" },
                    y: { type: "spring", stiffness: 220, damping: 22 },
                    scaleY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    rotate: { type: "spring", stiffness: 120, damping: 12 },
                  }
            }
            className="relative pt-6"
          >
            {/* peg + strings the placard hangs from */}
            <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_2px_var(--accent-glow)]" />
            <span className="absolute left-[calc(50%-34px)] top-1.5 h-5 w-px bg-border-strong" />
            <span className="absolute left-[calc(50%+34px)] top-1.5 h-5 w-px bg-border-strong" />

            <div className="relative rounded-xl border border-accent/40 bg-surface/85 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_40px_var(--accent-glow)] backdrop-blur">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-3 top-3 text-subtle transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <p
                className="pr-6 font-mono text-[0.65rem] uppercase tracking-widest"
                style={{ color: active.horizon ? "#22d3ee" : "var(--accent)" }}
              >
                {active.role}
                {active.inGym ? " · Gemini Gym" : ""}
              </p>
              <h3 className="mt-1 text-[1.05rem] font-semibold">
                {active.label}
              </h3>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">
                {active.summary}
              </p>

              {active.stats.length > 0 && (
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
              )}

              {active.horizon && active.focusStatus && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/[0.08] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-[#67e8f9]">
                  <span className="inline-block size-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" />
                  {active.focusStatus}
                </div>
              )}

              {active.deepDive ? (
                <Link
                  href={`/deep-dives/${active.slug}`}
                  onClick={() => setDeepDiveOrigin("mission-control")}
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  Open case file
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                active.horizon &&
                active.relatedSlug && (
                  <Link
                    href={`/deep-dives/${active.relatedSlug}`}
                    onClick={() => setDeepDiveOrigin("mission-control")}
                    className="mt-5 flex items-center gap-1 text-sm font-medium text-[#67e8f9] hover:underline"
                  >
                    Related work: {active.relatedLabel}
                    <ArrowRight className="size-3.5" />
                  </Link>
                )
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
              {idleLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {idleTagline}
            </p>
            <p className="mt-3 text-sm text-subtle">{idleHint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------- pipeline board -- */

function PipelineBoard() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

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

    const projectNodes: Node[] = projects.map((p, i) => {
      const inGym = Boolean(p.inGym);
      return {
        id: p.slug,
        type: "project",
        position: inGym ? gymChildPos[p.slug] : standalonePos[p.slug],
        ...(inGym ? { parentId: geminiGym.id, extent: "parent" as const } : {}),
        data: {
          project: p,
          dimmed: hasInteracted && selected !== null && selected !== p.slug,
          ping: !hasInteracted && !reduced,
          pingDelay: i * 0.4,
        },
        selected: selected === p.slug,
        draggable: false,
      };
    });

    return [group, ...projectNodes];
  }, [selected, hasInteracted, reduced]);

  const edges: Edge[] = useMemo(
    () =>
      projectEdges.map((e) => {
        const on =
          selected !== null && (e.from === selected || e.to === selected);
        return {
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          label: e.label,
          animated: on && !reduced,
          labelShowBg: true,
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
          labelStyle: { fill: "var(--fg-muted)", fontSize: 10 },
          labelBgStyle: { fill: "var(--bg-elevated)" },
          style: {
            stroke: on ? "var(--accent)" : "var(--border-strong)",
            strokeWidth: on ? 2 : 1.2,
            opacity: hasInteracted && selected !== null && !on ? 0.2 : 1,
          },
        };
      }),
    [selected, reduced, hasInteracted],
  );

  const active = selected ? projectBySlug(selected) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem] lg:items-start">
      <MapCanvas
        nodes={nodes}
        edges={edges}
        height={560}
        ariaLabel="Gemini Gym pipeline"
        onSelect={(id) => {
          setHasInteracted(true);
          setSelected(id);
        }}
        onClear={() => {
          setHasInteracted(true);
          setSelected(null);
        }}
      />
      <DetailPanel
        active={active}
        onClose={() => setSelected(null)}
        idleLabel={geminiGym.label}
        idleTagline={geminiGym.tagline}
        idleHint="Select any module in the pipeline to hang its details here."
      />
    </div>
  );
}

/* -------------------------------------------------------------- focus board -- */

function FocusBoard() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const nodes: Node[] = useMemo(() => {
    const focusGroup: Node = {
      id: currentFocus.id,
      type: "focusGroup",
      position: { x: 0, y: 0 },
      data: { label: currentFocus.tagline },
      style: { width: 848, height: FOCUS_GROUP_H },
      selectable: false,
      draggable: false,
      zIndex: 0,
    };

    const horizonNodes: Node[] = horizonProjects.map((p, i) => ({
      id: p.slug,
      type: "project",
      position: focusChildPos[p.slug],
      parentId: currentFocus.id,
      extent: "parent" as const,
      data: {
        project: p,
        dimmed: hasInteracted && selected !== null && selected !== p.slug,
        ping: !hasInteracted && !reduced,
        pingDelay: i * 0.4,
      },
      selected: selected === p.slug,
      draggable: false,
    }));

    return [focusGroup, ...horizonNodes];
  }, [selected, hasInteracted, reduced]);

  // Non-directional dashed connectors: the three tracks are concurrent, not a
  // pipeline, so no arrowheads - just a shared rail that reads as "in parallel".
  const focusEdges: Edge[] = useMemo(() => {
    const base = {
      type: "straight" as const,
      animated: !reduced,
      style: {
        stroke: "#22d3ee",
        strokeWidth: 1.4,
        strokeDasharray: "5 5",
        opacity: 0.6,
      },
      labelShowBg: true,
      labelBgPadding: [5, 2] as [number, number],
      labelBgBorderRadius: 4,
      labelStyle: { fill: "#67e8f9", fontSize: 10 },
      labelBgStyle: { fill: "var(--bg-elevated)" },
    };
    return [
      {
        id: "fo-fs",
        source: "focus-orchestration",
        target: "focus-synthetic",
        label: "in parallel",
        ...base,
      },
      {
        id: "fs-fe",
        source: "focus-synthetic",
        target: "focus-eval",
        ...base,
      },
    ];
  }, [reduced]);

  const active = selected ? projectBySlug(selected) ?? null : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem] lg:items-start">
      <MapCanvas
        nodes={nodes}
        edges={focusEdges}
        height={FOCUS_GROUP_H + 60}
        ariaLabel="Current focus - where the work is headed"
        onSelect={(id) => {
          setHasInteracted(true);
          setSelected(id);
        }}
        onClear={() => {
          setHasInteracted(true);
          setSelected(null);
        }}
      />
      <DetailPanel
        active={active}
        onClose={() => setSelected(null)}
        idleLabel={currentFocus.label}
        idleTagline={currentFocus.tagline}
        idleHint="Select a focus area to see where it's headed and the related shipped work."
      />
    </div>
  );
}

export function MissionControl() {
  return (
    <div className="space-y-4">
      <PipelineBoard />
      <FocusBoard />
    </div>
  );
}
