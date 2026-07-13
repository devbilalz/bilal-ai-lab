/**
 * Hero "inference console" content. Each model is a real framing of the SAME
 * career (nothing invented - every figure traces to the locked resume), named
 * like a foundation-model family so switching feels like querying a different
 * model. `Bilal Core` is the general flagship default; the others specialize.
 *
 * `description` is stored as runs so a phrase can be emphasized (em) while the
 * rest streams in as plain word-clusters.
 */
export interface DescRun {
  t: string;
  em?: boolean;
}

export interface HeroModel {
  id: string;
  name: string;
  role: string;
  spec: string;
  prompt: string;
  headline: string;
  tagline: string;
  description: DescRun[];
  chips: string[];
  /**
   * Where the "Explore My Work" CTA points for this framing - each model sends
   * the visitor to the most relevant proof (a section anchor or timeline stage).
   */
  ctaHref: string;
}

const PROMPT = "What do you build?";

export const heroModels: HeroModel[] = [
  {
    id: "core",
    name: "Bilal Core",
    role: "General",
    spec: "full-stack + AI · 6+ yrs",
    prompt: PROMPT,
    headline: "Reliable systems, from model to product",
    tagline: "AI Infrastructure · Distributed Systems · Full-Stack Leadership",
    description: [
      {
        t: "Production software across the stack - from the training and evaluation infrastructure behind ",
      },
      { t: "Google's Gemini", em: true },
      {
        t: " at Turing to HIPAA-compliant healthcare platforms and full-stack products. 6+ years across AI, enterprise SaaS, and healthcare, leading teams and shipping systems that hold up in the real world.",
      },
    ],
    chips: [
      "Google Gemini",
      "3 Industries",
      "Team Leadership",
      "End-to-End",
    ],
    ctaHref: "/#mission-control",
  },
  {
    id: "tensor",
    name: "Bilal Tensor",
    role: "AI Infrastructure",
    spec: "LLM evaluation · training infra",
    prompt: PROMPT,
    headline: "Infrastructure that makes LLMs reliable",
    tagline: "AI Infrastructure · Agentic AI · Platform Engineering",
    description: [
      {
        t: "The training and evaluation infrastructure behind ",
      },
      { t: "Google's Gemini", em: true },
      {
        t: " at Turing - simulated tools, synthetic worlds, and robustness benchmarks that make agentic models measurable and reliable. 6+ years shipping production AI and full-stack systems end to end.",
      },
    ],
    chips: [
      "Google Gemini",
      "Enterprise SaaS",
      "Healthcare",
      "AI Infrastructure",
    ],
    ctaHref: "/#mission-control",
  },
  {
    id: "kernel",
    name: "Bilal Kernel",
    role: "Backend Systems",
    spec: "distributed systems · cloud",
    prompt: PROMPT,
    headline: "Backends built for scale",
    tagline: "Backend Engineering · Distributed Systems · Cloud Architecture",
    description: [
      {
        t: "Backend systems and cloud infrastructure at scale - from HIPAA-compliant healthcare platforms sustaining ",
      },
      { t: "10,000 requests per minute", em: true },
      {
        t: " to serverless, event-driven automation. 6+ years building production APIs, microservices, and distributed data pipelines across AI, enterprise SaaS, and healthcare.",
      },
    ],
    chips: ["10K Req/Min", "HIPAA Compliance", "Microservices", "AWS"],
    ctaHref: "/#stage-joinreflect",
  },
  {
    id: "atlas",
    name: "Bilal Atlas",
    role: "Full-Stack Lead",
    spec: "architecture · team delivery",
    prompt: PROMPT,
    headline: "Full-stack delivery, led end to end",
    tagline: "Full-Stack Engineering · Technical Leadership · Team Delivery",
    description: [
      {
        t: "Full-stack engineering led from architecture through delivery - 6+ years shipping production Python and JavaScript systems, leading teams of ",
      },
      { t: "6-7 engineers", em: true },
      {
        t: ", and shaping technical direction with executive stakeholders across AI, enterprise SaaS, and healthcare.",
      },
    ],
    chips: [
      "Team Leadership",
      "Python & JS",
      "3 Industries",
      "End-to-End",
    ],
    ctaHref: "/#stage-sphere",
  },
];
