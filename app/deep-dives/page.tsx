import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { BackHome } from "@/components/layout/back-home";
import { Reveal } from "@/components/animations/reveal";
import { deepDives } from "@/lib/content/deep-dives";

export const metadata: Metadata = {
  title: "Case Files",
  description:
    "Engineering case files across the Gemini Gym (Agent APIs, DBGen, Benchmark), SWE trajectory evaluation, and product work at Sphere, Duett, and JoinReflect: problem, architecture, tradeoffs, and results.",
};

/**
 * Case files grouped into bands so the flagship Google/Gemini work reads
 * distinctly from the LLM-eval work and the earlier product engineering, rather
 * than sitting in one undifferentiated grid.
 */
const groups: { id: string; label: string; blurb: string; slugs: string[] }[] = [
  {
    id: "gym",
    label: "Gemini Gym / Google",
    blurb: "The training-and-evaluation program behind Google's Gemini.",
    slugs: ["agent-apis", "dbgen", "benchmark-suite"],
  },
  {
    id: "eval",
    label: "LLM evaluation & tuning",
    blurb: "Ground-truth grading and the data supply chain for fine-tuning.",
    slugs: ["swe-evaluation", "rlhf-sft"],
  },
  {
    id: "product",
    label: "Product engineering",
    blurb: "Enterprise SaaS and healthcare platforms built end to end.",
    slugs: ["sphere", "duett", "joinreflect"],
  },
];

export default function DeepDivesPage() {
  return (
    <SectionShell
      id="deep-dives"
      eyebrow="Case Files"
      title="How I designed these systems"
      className="pt-28"
      back={<BackHome />}
    >
      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
              <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
                {group.label}
              </h2>
              <p className="font-mono text-[0.7rem] text-subtle">{group.blurb}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {group.slugs.map((slug, i) => {
                const d = deepDives.find((x) => x.slug === slug);
                if (!d) return null;
                return (
                  <Reveal key={d.slug} delay={i * 0.05}>
                    <Link
                      href={`/deep-dives/${d.slug}`}
                      className="flex h-full flex-col rounded-xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent"
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        {d.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-muted">{d.tagline}</p>
                      <span className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-subtle">
                        <span>{d.facts.period}</span>
                        <span className="text-accent">inspect →</span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
