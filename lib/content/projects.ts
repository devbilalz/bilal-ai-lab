/**
 * S2 Mission Control + S9 Case File source data.
 *
 * STRUCTURE: "Gemini Gym" is the umbrella program at Turing (for Google). It
 * contains THREE components:
 *   - Generalized Agent APIs - the simulation environment
 *   - DBGen - synthetic world-generation engine
 *   - Benchmark Mutation Suite - robustness evaluation
 * Plus two separate Turing projects run alongside it:
 *   - SWE Trajectory Evaluation - human ground-truth grading of agent trajectories
 *   - RLHF / SFT - model fine-tuning across Gemini, Claude, Grok, ServiceNow AI
 */

export type ProjectStatus = "shipped" | "hardening" | "ongoing";

export interface Project {
  slug: string;
  label: string;
  role: string;
  summary: string;
  stats: { value: string; label: string }[];
  status: ProjectStatus;
  deepDive: boolean;
  /** True if this project is a component of the Gemini Gym umbrella. */
  inGym?: boolean;
  /** True for forward-looking focus areas (the "Current Focus" cluster). */
  horizon?: boolean;
  /** Live-process verb for horizon items (shown as a status label). */
  focusStatus?: string;
  /** For horizon items: the shipped case file that proves related depth. */
  relatedSlug?: string;
  relatedLabel?: string;
  telemetry?: {
    input: string;
    system: string;
    eval: string;
    proof: string;
  };
}

/** The umbrella program. */
export const geminiGym = {
  id: "gemini-gym",
  label: "Gemini Gym",
  tagline:
    "The training-and-evaluation program that teaches Google's Gemini to use real-world tools safely, at scale.",
  components: ["dbgen", "agent-apis", "benchmark-suite"],
} as const;

/** Forward-looking cluster: where the work is headed next. */
export const currentFocus = {
  id: "current-focus",
  label: "Current Focus",
  tagline: "Where the work is headed next.",
} as const;

export const projects: Project[] = [
  {
    slug: "dbgen",
    label: "DBGen",
    role: "World-generation engine",
    summary:
      "Turns a one-paragraph scenario brief into a full, schema-exact, narratively coherent world (Google Drive, Slack, Jira) plus a grading rubric, on demand and reproducibly, so training scenarios scale as a spec change rather than a manual authoring project.",
    stats: [
      { value: "3", label: "production SaaS surfaces" },
      { value: "3", label: "Gemini generations validated" },
    ],
    status: "hardening",
    deepDive: true,
    inGym: true,
    telemetry: {
      input: "scenario brief",
      system: "synthetic world",
      eval: "schema validation",
      proof: "case file",
    },
  },
  {
    slug: "agent-apis",
    label: "Generalized Agent APIs",
    role: "Agentic simulation environment",
    summary:
      "A deterministic, resettable sandbox of ~77 simulated real-world services (Gmail, Slack, Salesforce, GitHub, …) with machine-verifiable function-call schemas and a multi-stage validation pipeline, so Gemini trains and is graded on multi-turn tool use without touching live data.",
    stats: [
      { value: "77", label: "simulated real-world APIs" },
      { value: "3,200+", label: "automated tests" },
      { value: "~90%", label: "automated quality coverage" },
    ],
    status: "shipped",
    deepDive: true,
    inGym: true,
    telemetry: {
      input: "tool call",
      system: "API sandbox",
      eval: "3,200+ tests",
      proof: "case file",
    },
  },
  {
    slug: "benchmark-suite",
    label: "Benchmark Suite",
    role: "Robustness-evaluation harness",
    summary:
      "Evaluates model resilience by intentionally degrading tool presentations in agentic benchmarks (renamed functions, stripped docs, etc.) and measuring whether Gemini degrades more gracefully than GPT and Claude under identical constraints.",
    stats: [
      { value: "16", label: "mutation types" },
      { value: "10", label: "industry benchmarks" },
      { value: "231", label: "tasks (MCP Universe)" },
    ],
    status: "ongoing",
    deepDive: true,
    inGym: true,
    telemetry: {
      input: "benchmark task",
      system: "mutation harness",
      eval: "16 degradations",
      proof: "case file",
    },
  },
  {
    slug: "swe-evaluation",
    label: "SWE Trajectory Evaluation",
    role: "Human ground-truth grading",
    summary:
      "The human-referee layer: reads AI coding trajectories (Claude, Gemini, GPT) and verifies which of 15 quality problems are truly present, producing the trusted answer key used to measure how well models grade their own and each other's work.",
    stats: [
      { value: "15", label: "quality tags graded" },
      { value: "trace + step", label: "evaluation modes" },
    ],
    status: "ongoing",
    deepDive: true,
    telemetry: {
      input: "agent trace",
      system: "human referee",
      eval: "15 quality tags",
      proof: "case file",
    },
  },
  {
    slug: "rlhf-sft",
    label: "RLHF / SFT",
    role: "Model fine-tuning",
    summary:
      "Supervised fine-tuning and RLHF data curation across Gemini, Claude, Grok, and ServiceNow AI - producing code-centric training datasets that raised contextual accuracy and cut inference latency.",
    stats: [
      { value: "4", label: "model families" },
      { value: "+18%", label: "contextual accuracy" },
      { value: "-45ms", label: "inference latency" },
    ],
    status: "ongoing",
    deepDive: true,
    telemetry: {
      input: "curated data",
      system: "fine-tuning loop",
      eval: "+18% accuracy",
      proof: "case file",
    },
  },
];

/**
 * Directed edges of the pipeline. Within the Gym the data flows
 * DBGen → Agent APIs → Benchmark; trajectories feed RLHF (which loops back an
 * improved model), and the SWE evaluation supplies ground-truth labels.
 */
export const projectEdges: { from: string; to: string; label?: string }[] = [
  { from: "dbgen", to: "agent-apis", label: "worlds" },
  { from: "agent-apis", to: "benchmark-suite", label: "tools" },
  { from: "benchmark-suite", to: "rlhf-sft", label: "trajectories" },
  { from: "rlhf-sft", to: "agent-apis", label: "tuned model" },
  { from: "swe-evaluation", to: "rlhf-sft", label: "labels" },
];

/**
 * The "Current Focus" cluster - forward-looking directions, not shipped work.
 * Parallel (not sequential), so no internal edges and no numbering. Rendered as
 * a grouped band below the pipeline to show where the work is headed.
 */
export const horizonProjects: Project[] = [
  {
    slug: "focus-orchestration",
    label: "Multi-agent orchestration",
    role: "Where I'm headed",
    summary:
      "Systems where multiple specialized agents coordinate across tools and shared state to complete long-horizon tasks.",
    stats: [],
    status: "ongoing",
    deepDive: false,
    horizon: true,
    focusStatus: "orchestrating",
    relatedSlug: "agent-apis",
    relatedLabel: "Generalized Agent APIs",
  },
  {
    slug: "focus-synthetic",
    label: "Synthetic data generation",
    role: "Where I'm headed",
    summary:
      "Scaling realistic, schema-exact training worlds so evaluation and fine-tuning aren't bottlenecked on hand-authored fixtures.",
    stats: [],
    status: "ongoing",
    deepDive: false,
    horizon: true,
    focusStatus: "generating",
    relatedSlug: "dbgen",
    relatedLabel: "DBGen",
  },
  {
    slug: "focus-eval",
    label: "LLM evaluation frameworks",
    role: "Where I'm headed",
    summary:
      "Robustness and safety evaluation that surfaces brittleness before users do, and turns every eval run into training signal.",
    stats: [],
    status: "ongoing",
    deepDive: false,
    horizon: true,
    focusStatus: "evaluating",
    relatedSlug: "benchmark-suite",
    relatedLabel: "Benchmark Suite",
  },
];

export const projectBySlug = (slug: string) =>
  [...projects, ...horizonProjects].find((p) => p.slug === slug);
