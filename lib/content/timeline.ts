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
    id: "ta",
    period: "Jul 2018 - May 2019",
    company: "FAST-NUCES",
    url: "https://www.nu.edu.pk",
    domain: "nu.edu.pk",
    role: "Teaching Assistant",
    stage: "Foundations",
    summary:
      "Supported instructors in delivering core computer-science coursework: ran and graded assessments, clarified concepts one-on-one, and guided students through hands-on problem solving. Where I first learned to break hard systems down into ideas people could actually build on.",
    stack: [],
  },
  {
    id: "joinreflect",
    period: "Mar 2020 - Jan 2021",
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
    period: "Jan 2021 - Aug 2022",
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
    period: "Sep 2022 - Sep 2024",
    company: "Sphere",
    role: "Senior Full-Stack Engineer",
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
    period: "Jun 2024 - Present",
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
];
