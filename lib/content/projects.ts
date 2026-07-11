/**
 * S2 Mission Control + S9 Deep Dive source data.
 *
 * STRUCTURE (per Bilal): "Gemini Gym" is the umbrella program at Turing (for
 * Google). It contains THREE components:
 *   - Generalized Agent APIs (google-agents-api-gen) - the simulation environment
 *   - DBGen - synthetic world-generation engine
 *   - Benchmark Mutation Suite - robustness evaluation
 * Plus two separate Turing projects run alongside it:
 *   - SWE Trajectory Evaluation - human ground-truth grading of agent trajectories
 *   - RLHF / SFT - model fine-tuning across Gemini, Grok, ServiceNow AI
 *
 * Every field is grounded in `Turing Projects Overview/` docs + the resume.
 * No invented metrics.
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
}

/** The umbrella program. */
export const geminiGym = {
  id: "gemini-gym",
  label: "Gemini Gym",
  tagline:
    "The training-and-evaluation program that teaches Google's Gemini to use real-world tools safely, at scale.",
  components: ["dbgen", "agent-apis", "benchmark-suite"],
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
  },
  {
    slug: "agent-apis",
    label: "Generalized Agent APIs",
    role: "Agentic simulation environment",
    summary:
      "A deterministic, resettable sandbox of ~77 simulated real-world services (Gmail, Slack, Salesforce, GitHub, …) with machine-verifiable function-call schemas and a 6-layer validation pipeline, so Gemini trains and is graded on multi-turn tool use without touching live data.",
    stats: [
      { value: "77", label: "simulated real-world APIs" },
      { value: "3,200+", label: "automated tests" },
      { value: "~90%", label: "automated quality coverage" },
    ],
    status: "shipped",
    deepDive: true,
    inGym: true,
  },
  {
    slug: "benchmark-suite",
    label: "Benchmark Suite",
    role: "Robustness-evaluation harness",
    summary:
      "Takes existing agentic benchmarks and deliberately degrades how tools are presented (renamed functions, stripped docs, forced text tool-calls, modality shifts), then measures whether Gemini degrades gracefully - benchmarking it head-to-head against GPT-5 and Claude under identical adversarial conditions.",
    stats: [
      { value: "16", label: "mutation types" },
      { value: "10", label: "industry benchmarks" },
      { value: "231", label: "tasks (MCP Universe)" },
    ],
    status: "ongoing",
    deepDive: true,
    inGym: true,
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
  },
  {
    slug: "rlhf-sft",
    label: "RLHF / SFT",
    role: "Model fine-tuning",
    summary:
      "Supervised fine-tuning and RLHF data curation across Gemini, Grok, and ServiceNow AI - producing code-centric training datasets that raised contextual accuracy and cut inference latency.",
    stats: [
      { value: "+18%", label: "contextual accuracy" },
      { value: "-45ms", label: "inference latency" },
    ],
    status: "ongoing",
    deepDive: false,
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

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
