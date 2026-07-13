/**
 * S7 Principles (single-word values) + the personal "beyond the code" data.
 *
 * Principles are deliberately WORDS, not sentences - each carries a short tag and
 * folds in a hard-won lesson from real systems. The final entry is an honest
 * growing edge, not a strength.
 */

export interface Principle {
  /** Single-word principle. */
  word: string;
  /** Short descriptor - a phrase, never a full sentence. */
  note: string;
  /** Per-item accent so the panels read as a colored spectrum. */
  accent: string;
  /** True for the honest growing-edge entry (styled distinctly). */
  growth?: boolean;
}

export const principles: Principle[] = [
  {
    word: "Ownership",
    note: "Architecture through delivery, end to end.",
    accent: "#8b5cf6",
  },
  {
    word: "Validation",
    note: "Catch defects at the source, not downstream.",
    accent: "#22d3ee",
  },
  {
    word: "Reproducibility",
    note: "Resettable, replayable, deterministic.",
    accent: "#34d399",
  },
  {
    word: "Evidence",
    note: "Every number traces to a real source.",
    accent: "#f59e0b",
  },
  {
    word: "Grounding",
    note: "AI output a human can trust and correct.",
    accent: "#fb7185",
  },
  {
    word: "Delegation",
    note: "A growing edge: hand off sooner, own less.",
    accent: "#a78bfa",
    growth: true,
  },
];

/** S7.2 - one real personal-interest line (source for the "Beyond the code" section). */
export const personalInterest =
  "Outside the terminal, I reset through travel, good food, and long walks - drawn to better habits, sharper systems, stubborn side projects, and how good teams make hard things look calm.";

/** S8 - Currently Building focus areas, now surfaced inside Under the Hood. */
export interface BuildingItem {
  title: string;
  body: string;
  /** Live-process verb shown as an animated status label. */
  status: string;
}

export const currentlyBuilding: BuildingItem[] = [
  {
    title: "Multi-agent orchestration",
    body: "Systems where multiple specialized agents coordinate across tools and shared state to complete long-horizon tasks.",
    status: "orchestrating",
  },
  {
    title: "Synthetic data generation",
    body: "Scaling realistic, schema-exact training worlds so evaluation and fine-tuning aren't bottlenecked on hand-authored fixtures.",
    status: "generating",
  },
  {
    title: "LLM evaluation frameworks",
    body: "Robustness and safety evaluation that surfaces brittleness before users do, and turns every eval run into training signal.",
    status: "evaluating",
  },
];
