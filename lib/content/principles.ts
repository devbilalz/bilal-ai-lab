/**
 * S7 Engineering Principles + S8 Currently Building.
 * Principles are drafted from the resume's demonstrated engineering approach
 * (validation-first, systems ownership, truthful metrics). The personal-interest
 * line (S7.2) is intentionally left null until Bilal supplies a real one.
 */

export const principles: { title: string; body: string }[] = [
  {
    title: "Validate at the source, not downstream",
    body: "A broken tool schema teaches a model bad habits before training even starts. Build the checks that catch defects where they originate - the 6-layer validator caught issues Google's own SDK silently accepted.",
  },
  {
    title: "Own the system end-to-end",
    body: "From architecture through delivery. The most valuable engineering isn't a feature - it's the infrastructure and the boundaries drawn around it so it scales cleanly to the next case.",
  },
  {
    title: "Make it deterministic and reproducible",
    body: "Resettable sandboxes, frozen specs, replayable runs. If you can't run the same test twice with identical starting conditions, you can't trust the result - or improve on it.",
  },
  {
    title: "Every claim needs evidence",
    body: "Numbers trace to a source or they don't ship. A metric you can't defend in an interview is worse than no metric at all.",
  },
];

/** S7.2 - one real personal-interest line. */
export const personalInterest =
  "Outside the terminal, I reset through travel, good food, and long walks - drawn to better habits, sharper systems, stubborn side projects, and how good teams make hard things look calm.";

/** S8 - Currently Building focus areas (from resume/plan). No star ratings. */
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
