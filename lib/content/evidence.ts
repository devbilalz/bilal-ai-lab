/**
 * S6 Evidence Vault content. Every entry is a verifiable claim rendered as a
 * "file" in the ~/bilal-zahid/evidence directory (extends the filesystem motif
 * from the nav header). Quotes are VERBATIM from the source (LinkedIn), never
 * paraphrased, and all metadata (dates, grade, source) is real - no fabricated
 * file sizes, timestamps, or resolutions.
 */

export interface EvidenceItem {
  id: string;
  kind: "education" | "honor" | "recommendation";
  /** Filename shown on the tile (representational, part of the filesystem motif). */
  fileName: string;
  /** Short uppercase type badge on the tile (PDF, CERT, TXT). */
  ext: string;
  /** Human title - never a bare filename. */
  title: string;
  /** Context caption - never a bare title (dev plan acceptance criteria). */
  context: string;
  /** Real metadata chips only (dates, grade, place). Never fabricated. */
  meta: string[];
  /** For recommendations: the VERBATIM quote + attribution. */
  quote?: string;
  attribution?: string;
  /** Where the claim can be verified (real source). */
  source?: string;
}

export const evidence: EvidenceItem[] = [
  {
    id: "rec-adrian",
    kind: "recommendation",
    fileName: "sarstedt_recommendation.txt",
    ext: "TXT",
    title: "Adrian Sarstedt - managed Bilal directly",
    context: "Managed Bilal directly for roughly 2 years.",
    quote:
      "Bilal is an excellent full-stack engineer, problem solver, and communicator. I was lucky to have him on my team for roughly 2 years, during which time he worked on several Ruby on Rails, Node, Python, and React projects. His ability to take high-level objectives and deliver was truly special. I cannot recommend him enough.",
    attribution: "Adrian Sarstedt · Co-Founder & CTO, Sphere",
    meta: ["Feb 2024", "~2 years"],
    source: "LinkedIn recommendation",
  },
  {
    id: "rec-miguel",
    kind: "recommendation",
    fileName: "neto_recommendation.txt",
    ext: "TXT",
    title: "Miguel Neto - colleague at Sphere",
    context: "Worked with Bilal on the same team at Sphere.",
    quote:
      "It was a pleasure working with Bilal at Sphere. He played a key role in the initial steps of building Sphere's tax platform. Bilal is an experienced Python and React developer. He's easy to work with and a great team player. He would be an asset to any team, and I highly recommend him!",
    attribution: "Miguel Neto · Software Engineer, Investor & Entrepreneur",
    meta: ["Sept 2024", "Sphere"],
    source: "LinkedIn recommendation",
  },
  {
    id: "deans-list",
    kind: "honor",
    fileName: "deans-list_6-semesters.cert",
    ext: "CERT",
    title: "Dean's List - 6 semesters",
    context:
      "Recognized for academic standing across the 1st, 3rd, 4th, 5th, 7th, and 8th semesters at FAST-NUCES.",
    meta: ["6 semesters", "FAST-NUCES"],
    source: "LinkedIn",
  },
];
