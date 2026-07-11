/**
 * S5 Metrics Strip. Every number traces to a source doc or the resume.
 * `evidence` points at the Deep Dive / section that substantiates it (evidence chain).
 * NOTE: the "4 major AI platforms" figure from the old plan is intentionally
 * NOT used here until reconciled - we use the concrete, defensible model list.
 */

export interface Metric {
  /** Numeric part, animated with CountUp. */
  value: number;
  /** Prefix (e.g. "~") and suffix (e.g. "+", "%", "ms") rendered around value. */
  prefix?: string;
  suffix?: string;
  label: string;
  /** Anchor or route the metric links to for proof. */
  evidence: string;
}

export const metrics: Metric[] = [
  { value: 6, suffix: "+", label: "years building production systems", evidence: "/#timeline" },
  { value: 77, label: "simulated real-world APIs", evidence: "/deep-dives/agent-apis" },
  { value: 3200, suffix: "+", label: "automated tests", evidence: "/deep-dives/agent-apis" },
  { value: 42, suffix: "+", label: "function-call validation rules", evidence: "/deep-dives/agent-apis" },
  { value: 10, label: "industry benchmarks stress-tested", evidence: "/deep-dives/benchmark-suite" },
  { value: 15, label: "quality tags in SWE trajectory eval", evidence: "/deep-dives/swe-evaluation" },
];
