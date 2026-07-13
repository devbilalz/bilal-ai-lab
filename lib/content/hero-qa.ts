/**
 * Guided question tour for the hero "inference console".
 *
 * Each hero model (core / tensor / kernel / atlas) has a scripted series of
 * questions the console auto-types into the input. The visitor presses Enter to
 * send; the answer streams in; then the next question auto-populates. Switching
 * models keeps the transcript but pulls the next questions from the new model's
 * scope.
 *
 * The FIRST item of every model's queue is the shared intro ("What do you
 * build?") - it is derived at runtime from the HeroModel itself (headline /
 * tagline / description / chips / CTA) so it never drifts from `hero-models.ts`.
 * The entries below are the ADDITIONAL, scope-specific questions.
 *
 * Copy mirrors Hero_Guided_Tour_QA_Professional_Copy.md: questions are framed
 * as a hiring manager's natural questions (evidence, depth, judgment, working
 * style) rather than a candidate pitch. Every claim here is already published
 * elsewhere on the site (metrics strip, case files, timeline) or in `site.ts`.
 */
import type { DescRun } from "./hero-models";
import { site } from "@/lib/site";

export type AnswerBlock =
  | { kind: "heading"; text: string }
  | { kind: "tagline"; text: string }
  | { kind: "text"; runs: DescRun[] }
  | { kind: "bullets"; items: DescRun[][] }
  | { kind: "stats"; items: { value: string; label: string }[] }
  | { kind: "note"; runs: DescRun[] };

export interface QAAnswer {
  blocks: AnswerBlock[];
  chips?: string[];
  ctas?: { label: string; href: string }[];
}

export interface QAItem {
  id: string;
  question: string;
  answer: QAAnswer;
}

/** small helpers to keep the content readable */
const t = (s: string): DescRun => ({ t: s });
const em = (s: string): DescRun => ({ t: s, em: true });

export const heroQA: Record<string, QAItem[]> = {
  core: [
    {
      id: "core-overview",
      question: "Give me the 60-second overview.",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("Six-plus years building production systems end to end. Today I work on the training and evaluation infrastructure behind "),
              em("Google's Gemini"),
              t(" at Turing: simulated tools, synthetic worlds, robustness benchmarks, and model-evaluation workflows. Before that I shipped backend and full-stack systems across enterprise SaaS and healthcare - including Sphere's AI and tax-compliance products and Duett.io's home-health marketplace."),
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "3", label: "product domains" },
              { value: "Google", label: "Gemini infra" },
            ],
          },
        ],
        ctas: [{ label: "See the trajectory", href: "/#timeline" }],
      },
    },
    {
      id: "core-standout",
      question: "Which project best shows your engineering depth?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("The "),
              em("Gemini Gym"),
              t(" at Turing. It's a deterministic training and evaluation environment for agentic tool use: "),
              em("77 simulated APIs"),
              t(", strict function-call schemas, regression suites, and validation rules - so Gemini can practice real-world tool use without touching live user data."),
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "77", label: "simulated APIs" },
              { value: "3200+", label: "automated tests" },
              { value: "42+", label: "validation rules" },
            ],
          },
        ],
        ctas: [
          { label: "Under the Hood", href: "/#mission-control" },
          { label: "Open case file", href: "/deep-dives/agent-apis" },
        ],
      },
    },
    {
      id: "core-why",
      question: "What signal should I take from this portfolio?",
      answer: {
        blocks: [
          {
            kind: "bullets",
            items: [
              [em("Systems depth: "), t("the strongest work isn't UI polish - it's infrastructure that makes AI behavior measurable, reproducible, and safer to evaluate.")],
              [em("Production range: "), t("the same engineering judgment shows up across LLM evals, tax compliance, healthcare marketplaces, and enterprise SaaS.")],
              [em("Reliability bias: "), t("schemas, validators, workers, cron jobs, and evidence chains are recurring patterns, not one-off tricks.")],
              [em("Proof over adjectives: "), t("every major claim points to a metric, case file, timeline entry, or recommendation.")],
            ],
          },
        ],
        ctas: [{ label: "See the evidence", href: "/#evidence" }],
      },
    },
    {
      id: "core-reach",
      question: "Are you available, and how do I reach you?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("Open to AI Infrastructure, Agentic AI, Platform Engineering, and Full-Stack roles - "),
              em("remote, hybrid, or on-site, worldwide"),
              t(", and open to relocation. The fastest way to start a serious conversation is email."),
            ],
          },
          {
            kind: "note",
            runs: [t("Email "), em(site.links.email), t(" - or open the resume for the compact version.")],
          },
        ],
        ctas: [
          { label: "Email me", href: `mailto:${site.links.email}` },
          { label: "Resume", href: "/resources" },
        ],
      },
    },
  ],

  tensor: [
    {
      id: "tensor-gym",
      question: "What exactly is the Gemini Gym?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("A deterministic simulation environment for training and evaluating "),
              em("Google's Gemini"),
              t(" on agentic, tool-using tasks. Instead of letting the model call live, flaky, rate-limited services, the Gym gives it "),
              em("77 faithfully simulated APIs"),
              t(" with strict schemas, resettable state, and validation layers - so every training and eval run is reproducible."),
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "77", label: "simulated APIs" },
              { value: "3200+", label: "tests" },
              { value: "42+", label: "FC rules" },
            ],
          },
        ],
        ctas: [{ label: "Agent APIs case file", href: "/deep-dives/agent-apis" }],
      },
    },
    {
      id: "tensor-eval",
      question: "Where do LLM evals go wrong if the infrastructure is weak?",
      answer: {
        blocks: [
          {
            kind: "bullets",
            items: [
              [em("Bad tool contracts: "), t("if schemas drift from code, the model is graded against a broken interface.")],
              [em("Clean-room benchmarks: "), t("ideal conditions hide brittleness that shows up in real tool-use environments.")],
              [em("Untrusted trajectories: "), t("final answers can look right even when the agent skipped tests, ignored instructions, or invented results.")],
            ],
          },
        ],
        ctas: [
          { label: "Benchmark suite", href: "/deep-dives/benchmark-suite" },
          { label: "SWE evaluation", href: "/deep-dives/swe-evaluation" },
        ],
      },
    },
    {
      id: "tensor-synth",
      question: "How do you generate training worlds?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("I worked on "),
              em("DBGen"),
              t(", a synthetic-world engine that turns a scenario prompt into schema-exact, internally-consistent worlds - Drive, Slack, Jira-style data - plus grading rubrics. The key idea: generated data is only useful when it's realistic, reproducible, and gradeable."),
            ],
          },
          {
            kind: "text",
            runs: [
              t("I've also worked on "),
              em("RLHF and SFT"),
              t(" fine-tuning loops, improving contextual accuracy by ~18% while cutting latency."),
            ],
          },
        ],
        ctas: [{ label: "DBGen case file", href: "/deep-dives/dbgen" }],
      },
    },
    {
      id: "tensor-stack",
      question: "What's your AI infrastructure stack?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("Python-first, with an emphasis on correctness, reproducibility, and evaluation quality across the training-to-eval pipeline."),
            ],
          },
        ],
        chips: [
          "Python",
          "FastAPI",
          "Pydantic",
          "Agentic AI",
          "Function Calling",
          "RLHF / SFT",
        ],
        ctas: [{ label: "Full expertise map", href: "/#skills" }],
      },
    },
  ],

  kernel: [
    {
      id: "kernel-scale",
      question: "What backend patterns show up across your work?",
      answer: {
        blocks: [
          {
            kind: "bullets",
            items: [
              [em("Validate at the boundary: "), t("strict schemas and typed contracts so bad data never reaches the core.")],
              [em("Move slow work out of requests: "), t("workers, schedulers, and event-driven paths for filings, syncs, ingestion, and agent jobs.")],
              [em("Model the domain clearly: "), t("tax jurisdictions, healthcare matching, and tool schemas all fail when the domain model is vague.")],
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "10K", label: "req/min sustained" },
              { value: "HIPAA", label: "compliant systems" },
            ],
          },
        ],
      },
    },
    {
      id: "kernel-hipaa",
      question: "Tell me about the HIPAA healthcare platform.",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("At "),
              em("Duett.io"),
              t(" I built a HIPAA-compliant healthcare marketplace connecting care coordinators with home-health providers across Central Indiana. The core was a provider-matching engine on Django and Flask, with predictive-analytics integration alongside data-science partners."),
            ],
          },
        ],
        ctas: [{ label: "Duett.io case file", href: "/deep-dives/duett" }],
      },
    },
    {
      id: "kernel-cloud",
      question: "What's your cloud and infrastructure experience?",
      answer: {
        blocks: [
          {
            kind: "bullets",
            items: [
              [em("AWS: "), t("Lambda and event-driven pipelines, plus containerized services on EKS/Kubernetes.")],
              [em("Data: "), t("PostgreSQL for transactional cores, Redis for caching, Pinecone for vector search.")],
              [em("Delivery: "), t("CI/CD, background workers, and scheduled cron jobs powering async automation.")],
            ],
          },
        ],
        chips: ["AWS Lambda", "Kubernetes", "PostgreSQL", "Redis", "Pinecone"],
      },
    },
    {
      id: "kernel-async",
      question: "How do you handle background and event-driven work?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("By keeping long-running work out of the request path. Across products I've worked with "),
              em("Kubernetes CronJobs and worker pools, Lambda chains, and background task queues"),
              t(" - for filings, data syncs, ingestion, and long-running agent workflows."),
            ],
          },
        ],
        ctas: [{ label: "Sphere tax platform", href: "/deep-dives/sphere" }],
      },
    },
  ],

  atlas: [
    {
      id: "atlas-lead",
      question: "How do you lead when the system is ambiguous?",
      answer: {
        blocks: [
          {
            kind: "bullets",
            items: [
              [em("Stay close to the architecture: "), t("roadmap decisions are better when the tradeoffs are visible in the code and data model.")],
              [em("Create momentum for the team: "), t("mentored ~5 engineers at Sphere; currently work in a 6-person Turing delivery context.")],
              [em("Translate ambiguity into deliverables: "), t("turn vague AI and product goals into APIs, workflows, dashboards, validators, and shipped systems.")],
            ],
          },
          {
            kind: "stats",
            items: [
              { value: "6-7", label: "engineers led" },
              { value: "CEO/CTO", label: "roadmap partner" },
            ],
          },
        ],
      },
    },
    {
      id: "atlas-shipped",
      question: "Walk me through something you shipped end-to-end.",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("At "),
              em("Sphere"),
              t(" I helped build an AI-powered global tax-compliance platform - from the data model and tax engine through filings, third-party integrations (Stripe, accounting, and government systems), and the React/Next.js front end, deployed on Kubernetes."),
            ],
          },
        ],
        ctas: [{ label: "Sphere case file", href: "/deep-dives/sphere" }],
      },
    },
    {
      id: "atlas-range",
      question: "What's your full-stack range?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("Comfortable across the full product path in both Python and JavaScript ecosystems - backend APIs, data models, integrations, async work, and polished front ends."),
            ],
          },
        ],
        chips: [
          "Python & TypeScript",
          "FastAPI / Django",
          "Ruby on Rails",
          "React / Next.js",
          "PostgreSQL",
          "AWS",
        ],
        ctas: [{ label: "Full expertise map", href: "/#skills" }],
      },
    },
    {
      id: "atlas-work",
      question: "What are you like to work with?",
      answer: {
        blocks: [
          {
            kind: "text",
            runs: [
              t("Direct, ownership-driven, and evidence-backed. Colleagues have described me as a strong problem solver and a genuine team player who ships."),
            ],
          },
          {
            kind: "note",
            runs: [
              t("Two Sphere recommendations are already in the Evidence Vault - they say more than a self-description should."),
            ],
          },
        ],
        ctas: [{ label: "Read recommendations", href: "/#evidence" }],
      },
    },
  ],
};
