/**
 * S3 Career Timeline. Stages match the finalized resume exactly (reverse of the
 * resume's reverse-chronological order, here shown as a growth arc, earliest
 * first). Dates and roles are as locked in the master resume.
 */

export interface TimelineStage {
  id: string;
  period: string;
  company: string;
  /** Public company site (opens in a new tab). Omit when there is no live site. */
  url?: string;
  /** Domain used to fetch the company favicon/logo. Omit => monogram fallback. */
  domain?: string;
  /** Optional staffing-partner attribution, shown subtly next to the company. */
  via?: string;
  role: string;
  /** Narrative-stage label, the growth arc. */
  stage: string;
  summary: string;
  stack: string[];
  /** Optional deep-dive slug this stage links to. */
  deepDive?: string;
}

export const timeline: TimelineStage[] = [
  {
    id: "joinreflect",
    period: "03/2020 - 01/2021",
    company: "JoinReflect",
    url: "https://joinreflect.com",
    domain: "joinreflect.com",
    via: "via Devsinc",
    role: "Software Engineer",
    stage: "Software Engineering",
    summary:
      "Engineered a digital mental-health platform matching patients to the right therapists and coordinating their care: secure, scalable microservices with an intelligent recommendation algorithm and calendar orchestration.",
    stack: ["Django", "React", "PostgreSQL", "AWS"],
    deepDive: "joinreflect",
  },
  {
    id: "duett",
    period: "01/2021 - 08/2022",
    company: "Duett.io",
    url: "https://duett.io",
    domain: "duett.io",
    via: "via Devsinc",
    role: "Senior Software Engineer",
    stage: "Healthcare Systems",
    summary:
      "Built a HIPAA-compliant healthcare marketplace connecting care coordinators with home-health providers across Central Indiana; a provider-matching engine on Django and Flask, with predictive-analytics integration alongside data-science partners.",
    stack: ["Django", "Flask", "React", "AWS", "PostgreSQL"],
    deepDive: "duett",
  },
  {
    id: "sphere",
    period: "09/2022 - 09/2024",
    company: "Sphere",
    role: "Senior FullStack Engineer",
    stage: "Enterprise AI",
    summary:
      "Engineered core platform capabilities across three enterprise SaaS products: EdTech, AI-powered revenue operations, and global indirect-tax compliance, architecting cloud-native systems and intelligent workflow automation. Drove technical roadmap directly with the CEO and CTO.",
    stack: [
      "Python (FastAPI)",
      "Ruby on Rails",
      "React / Next.js",
      "AWS Lambda",
      "Salesforce",
      "Pinecone",
    ],
    deepDive: "sphere",
  },
  {
    id: "turing",
    period: "06/2024 - Present",
    company: "Turing",
    url: "https://www.turing.com",
    domain: "turing.com",
    role: "Google Services · LLM Python Developer",
    stage: "LLM Infrastructure",
    summary:
      "Core engineer on Google's Gemini training and evaluation infrastructure, the internal 'Gemini Gym', with parallel LLM fine-tuning and evaluation for xAI's Grok and ServiceNow AI. Built the agentic simulation environment, the DBGen world-generation engine, and the robustness-benchmark suite.",
    stack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Agentic AI",
      "Function Calling",
      "RLHF / SFT",
    ],
    deepDive: "agent-apis",
  },
  {
    id: "next",
    period: "",
    company: "",
    role: "What's next",
    stage: "The Horizon",
    summary:
      "Agentic AI systems, multi-agent orchestration, synthetic-data generation, and LLM evaluation frameworks: building the infrastructure that makes frontier models reliable in production.",
    stack: [],
  },
];
