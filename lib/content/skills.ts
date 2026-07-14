/**
 * S4 Skills Map. Grouped exactly as the finalized resume's Technical Skills
 * (AI/LLM first). Each skill carries an "applied at" context so no skill is a
 * bare tag - it maps to a real place it was used.
 */

export interface Skill {
  name: string;
  appliedAt: string;
  /** Simple Icons slug for the official brand logo (omit for concepts). */
  icon?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ai-llm",
    label: "AI / LLM",
    skills: [
      { name: "Agentic AI", appliedAt: "Turing - Gemini Gym simulation environment" },
      { name: "Function Calling", appliedAt: "Turing - 75+ tool schemas, FC validator" },
      { name: "RLHF", appliedAt: "Turing - Gemini, Grok, ServiceNow AI fine-tuning" },
      { name: "SFT", appliedAt: "Turing - code-centric training datasets" },
      { name: "LLM Evaluation", appliedAt: "Turing - benchmark mutation suite" },
      { name: "Prompt Engineering", appliedAt: "Turing - training/eval pipelines" },
      { name: "Synthetic Data Generation", appliedAt: "Turing - DBGen world engine" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Python", appliedAt: "Turing, Duett, Sphere - primary language", icon: "python" },
      { name: "TypeScript", appliedAt: "Sphere - React/Next.js platforms", icon: "typescript" },
      { name: "JavaScript", appliedAt: "Sphere, Duett - frontend", icon: "javascript" },
      { name: "Ruby", appliedAt: "Sphere - EdTech platform (Rails)", icon: "ruby" },
      { name: "SQL", appliedAt: "All roles - relational data" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "FastAPI", appliedAt: "Turing, Sphere - Python services", icon: "fastapi" },
      { name: "Django", appliedAt: "Duett, JoinReflect - platform backends", icon: "django" },
      { name: "Ruby on Rails", appliedAt: "Sphere - EdTech learning platform", icon: "rubyonrails" },
      { name: "REST APIs", appliedAt: "All roles" },
      { name: "Microservices", appliedAt: "JoinReflect, Sphere" },
      { name: "Event-Driven Architecture", appliedAt: "Sphere - AWS Lambda automation" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    skills: [
      { name: "AWS", appliedAt: "Sphere, Duett - Lambda, RDS, S3, EC2" },
      { name: "Docker", appliedAt: "Sphere, Benchmark suite isolation", icon: "docker" },
      { name: "Kubernetes", appliedAt: "Container orchestration", icon: "kubernetes" },
      { name: "CI/CD", appliedAt: "Gemini Gym - Ruff, MyPy, pre-commit" },
      { name: "Observability", appliedAt: "Sphere - CloudWatch" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "PostgreSQL", appliedAt: "Sphere, Duett, JoinReflect", icon: "postgresql" },
      { name: "MongoDB", appliedAt: "Sphere", icon: "mongodb" },
      { name: "Pinecone", appliedAt: "Sphere - vector search" },
      { name: "Redis", appliedAt: "Sphere - EdTech caching", icon: "redis" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", appliedAt: "Sphere, Duett - dashboards", icon: "react" },
      { name: "Next.js", appliedAt: "Sphere - analytics platform", icon: "nextdotjs" },
      { name: "Tailwind CSS", appliedAt: "This portfolio", icon: "tailwindcss" },
    ],
  },
];
