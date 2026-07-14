/**
 * Single source of truth for identity + links (F6).
 * Real values from the finalized resume / LinkedIn.
 * TODO markers are placeholders awaiting confirmation (see dev plan §8).
 */

/**
 * Canonical site origin, resolved for the deploy target:
 *   1. NEXT_PUBLIC_SITE_URL  — set this to the custom domain once it's live.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production URL (server).
 *   3. VERCEL_URL — the per-deployment URL (previews).
 *   4. fallback placeholder domain.
 * Only used in server contexts (metadata, sitemap, robots, JSON-LD), so the
 * server-only VERCEL_* vars are safe here.
 */
function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "https://bilalzahid.vercel.app";
  return fromEnv.replace(/\/+$/, "");
}

export const site = {
  name: "Bilal Zahid",
  person: "Bilal Zahid",
  title: "LLM Infrastructure Engineer",
  tagline: "AI Infrastructure · Agentic AI · Platform Engineering",
  url: resolveSiteUrl(),
  description:
    "Bilal Zahid - LLM Infrastructure & full-stack engineer. Architected training and evaluation infrastructure behind Google's Gemini at Turing. 6+ years building production AI systems.",
  yearsExperience: "6+",
  location: "Open to relocation · Remote-friendly",
  // Confirmed handles from resume/LinkedIn
  links: {
    github: "https://github.com/devbilalz",
    linkedin: "https://www.linkedin.com/in/dev-bilal-z/",
    email: "bilalzahid.dev@gmail.com",
    phone: "+92 306 6979386",
  },
  // Path to the master resume PDF served from /public.
  resume: "/resumes/Bilal_Zahid_Resume.pdf",
  // Role-availability statement (S13.1).
  availability:
    "Available worldwide for AI Infrastructure, Agentic AI, Platform Engineering, and Full-Stack Engineering opportunities - remote, hybrid, or on-site. Open to relocation.",
  keywords: [
    "Bilal Zahid",
    "Bilal Zahid AI",
    "Bilal Zahid Gemini",
    "Bilal Zahid LLM",
    "Bilal Zahid Full Stack",
    "LLM Infrastructure Engineer",
    "Agentic AI Engineer",
    "AI Platform Engineer",
  ],
} as const;
