/**
 * Schematic architecture flows for the flagship case files. Kept data-driven so
 * the case-file page can render a diagram without hard-coding layout per slug.
 * Every step maps to something described in the Architecture section - no new
 * claims are introduced here.
 */

export interface DiagramStep {
  label: string;
  sub?: string;
}

export interface Diagram {
  /** Left-to-right (desktop) / top-to-bottom (mobile) pipeline stages. */
  steps: DiagramStep[];
  /** Terminal artifacts the pipeline produces. */
  outputs?: DiagramStep[];
  /** A cross-cutting concern shown as an "injected into the flow" band. */
  inject?: string;
  /** A feedback edge: the pipeline output loops back to an earlier stage. */
  loop?: string;
  /** One-line honest caption under the diagram. */
  caption?: string;
}

export const diagrams: Record<string, Diagram> = {
  "agent-apis": {
    steps: [
      { label: "LLM agent", sub: "multi-turn tool use" },
      { label: "Typed tool interface", sub: "schema generated from code" },
      { label: "Validation layer", sub: "rejects malformed contracts" },
      { label: "Simulated services", sub: "stateful, resettable" },
      { label: "Logged trajectories", sub: "captured for replay + scoring" },
    ],
    inject: "A fault-injection layer can trigger errors, auth failures, and edge cases to test recovery.",
    caption:
      "No live user data is ever touched, and the same test replays with identical starting conditions.",
  },
  dbgen: {
    steps: [
      { label: "Scenario brief", sub: "one short paragraph" },
      { label: "Coherent backstory", sub: "people, projects, dates that fit" },
      { label: "Generate records", sub: "internally consistent" },
      { label: "Consistency checks", sub: "records reference each other" },
      { label: "Export in real schema", sub: "reads like a real account" },
    ],
    outputs: [
      { label: "Populated world", sub: "Drive / Slack / Jira" },
      { label: "Grading rubric", sub: "ships with the world" },
    ],
    caption: "A saved brief regenerates the same world, with full traceability from any record to its source.",
  },
  "benchmark-suite": {
    steps: [
      { label: "Existing benchmark", sub: "used unmodified" },
      { label: "Interception layer", sub: "adapts calls, no source edits" },
      { label: "Perturb tool presentation", sub: "one change at a time" },
      { label: "Model responds", sub: "compared across frontier models" },
      { label: "Restore + grade", sub: "stays comparable to baselines" },
    ],
    outputs: [
      { label: "Labeled trajectories", sub: "feed back into the training loop" },
    ],
    caption: "The benchmark's own source is never edited, and each change is reversed before scoring.",
  },
  "swe-evaluation": {
    steps: [
      { label: "AI coding trajectory", sub: "+ each model's self-flags" },
      { label: "Consolidate flags", sub: "small tooling pipeline" },
      { label: "Verify vs visible evidence", sub: "words, tool names, bash only" },
      { label: "Per-tag verdict", sub: "violated / not-violated" },
      { label: "Ground-truth answer key", sub: "15 tags, trace + step" },
    ],
    inject:
      "When a violation can't be proven from the visible evidence, mark it not-violated - never guess.",
    caption: "Reviewers verify the models' own flags rather than grading from a blank page.",
  },
  "rlhf-sft": {
    steps: [
      { label: "Code-centric examples", sub: "sourced + filtered" },
      { label: "Shape to real prompts", sub: "inference-fidelity, not lab format" },
      { label: "Rubric-aligned labeling", sub: "review loops align reviewers" },
      { label: "Training-ready dataset", sub: "per model family" },
      { label: "Model-eval feedback", sub: "targets real failure modes" },
    ],
    loop: "Evaluation results re-target the next round of curation instead of guessing what to fix.",
    outputs: [
      { label: "Gemini · Claude · Grok · ServiceNow AI", sub: "4 model families" },
    ],
    caption: "Curation treated as infrastructure: cleaner signal per example over raw volume.",
  },
  sphere: {
    steps: [
      { label: "API documentation", sub: "the source material" },
      { label: "Crawl docs", sub: "serverless on AWS Lambda" },
      { label: "Embed + retrieve", sub: "OpenAI + Pinecone" },
      { label: "Generate manifest", sub: "Airbyte low-code connector" },
      { label: "New source online", sub: "no hand-built connector" },
    ],
    caption:
      "One of Sphere's platforms - the doc-to-connector factory, treating documentation as source and the connector spec as compiled output.",
  },
  duett: {
    steps: [
      { label: "Care-plan intake", sub: "patient needs + constraints" },
      { label: "Provider-matching engine", sub: "Django + Flask" },
      { label: "Score + rank", sub: "availability, specialty, location" },
      { label: "Predictive-analytics scoring", sub: "partner models plugged in" },
      { label: "Matched referral", sub: "hours, not days" },
    ],
    inject: "HIPAA-safe handling of protected health information, end to end.",
    caption: "Matching intelligence lives inside real coordinator workflows, not a separate experiment.",
  },
  joinreflect: {
    steps: [
      { label: "Patient needs", sub: "what would actually help" },
      { label: "Recommendation algorithm", sub: "predicts therapist fit" },
      { label: "Matched therapist", sub: "fit over directory search" },
      { label: "Calendar orchestration", sub: "across independent providers" },
      { label: "Booked, coordinated care", sub: "feels simple to the patient" },
    ],
    inject: "Sensitive health data isolated across scalable Django microservices.",
    caption: "The complexity moved into the system, so booking feels simple for the patient.",
  },
};
