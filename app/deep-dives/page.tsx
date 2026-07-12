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

export default function DeepDivesPage() {
  return (
    <SectionShell
      id="deep-dives"
      eyebrow="Case Files"
      title="How the systems actually work"
      className="pt-28"
      back={<BackHome />}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {deepDives.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.05}>
            <Link
              href={`/deep-dives/${d.slug}`}
              className="flex h-full flex-col rounded-xl border border-border bg-surface/40 p-6 transition-colors hover:border-accent"
            >
              <h2 className="text-lg font-semibold text-foreground">{d.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{d.tagline}</p>
              <span className="mt-4 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                inspect →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
