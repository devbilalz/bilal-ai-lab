/**
 * S6 Evidence Vault content. Only claims verifiable from the LinkedIn snapshot /
 * resume are marked ready. Scanned document files (certificate, transcript,
 * recommendation letters) are NOT yet supplied - those render a Placeholder.
 */

export interface EvidenceItem {
  id: string;
  kind: "education" | "honor" | "recommendation";
  title: string;
  /** Context caption - never a bare title (dev plan acceptance criteria). */
  context: string;
  /** For recommendations: the quote + attribution. */
  quote?: string;
  attribution?: string;
}

export const evidence: EvidenceItem[] = [
  {
    id: "degree",
    kind: "education",
    title: "BS Computer Science - FAST-NUCES",
    context: "National University of Computer & Emerging Sciences, Lahore · 2016-2020 · Grade A+",
  },
  {
    id: "deans-list",
    kind: "honor",
    title: "Dean's List - 6 semesters",
    context: "Awarded across the 1st, 3rd, 4th, 5th, 7th, and 8th semesters at FAST-NUCES.",
  },
  {
    id: "rec-miguel",
    kind: "recommendation",
    title: "Recommendation - Sphere",
    context: "Colleague at Sphere",
    quote:
      "An experienced Python and React developer who played a key role in the initial steps of building Sphere's tax platform. Easy to work with and a great team player.",
    attribution: "Miguel Neto · Sphere",
  },
  {
    id: "rec-adrian",
    kind: "recommendation",
    title: "Recommendation - managed directly",
    context: "Managed Bilal directly for ~2 years",
    quote:
      "An excellent full-stack engineer, problem solver, and communicator. Worked on several Ruby on Rails, Node, Python, and React projects; his ability to take high-level objectives and deliver was truly special.",
    attribution: "Adrian Sarstedt",
  },
];

/** Whether scanned document files exist in /public/evidence yet. */
export const hasDocumentFiles = false;
