/**
 * Navigation model.
 * - `homeSections`: in-page anchors on the single-scroll home. Drive the
 *   right-side "necklace" rail (scroll progress) and the menu's "On this page".
 * - `sitePages`: dedicated routes with expanded content, surfaced in the menu so
 *   nothing (like System Design) gets missed at the bottom of a scroll.
 */
export const homeSections = [
  { id: "top", label: "Inference", desc: "Query the model - what do I build?" },
  { id: "mission-control", label: "Mission Control", desc: "The Gemini Gym pipeline, mapped." },
  { id: "timeline", label: "Career Path", desc: "How I grew into AI infrastructure." },
  { id: "skills", label: "Expertise", desc: "Where I specialize." },
  { id: "metrics", label: "Metrics", desc: "The scale of the work." },
  { id: "evidence", label: "Evidence", desc: "Why the claims hold up." },
  { id: "principles", label: "Principles", desc: "How I think about engineering." },
  { id: "building", label: "Building", desc: "Where I'm headed next." },
  { id: "code-lab", label: "Engineering Notes", desc: "Lessons from real systems." },
  { id: "contact", label: "Contact", desc: "Let's build something." },
] as const;

export const sitePages = [
  {
    label: "Case Files",
    href: "/deep-dives",
    desc: "Trace the problem, architecture, tradeoffs, and proof.",
  },
  {
    label: "System Design",
    href: "/system-design",
    desc: "How I approach API, data, scaling, and LLM-eval design.",
  },
  {
    label: "Résumé",
    href: "/resources",
    desc: "Preview or download the one-page resume (PDF).",
  },
] as const;
