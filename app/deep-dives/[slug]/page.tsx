import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/animations/reveal";
import { Placeholder } from "@/components/common/placeholder";
import { deepDives, deepDiveBySlug } from "@/lib/content/deep-dives";
import { ApiCatalog } from "@/features/deep-dive/api-catalog";
import { ArchitectureDiagram } from "@/features/deep-dive/architecture-diagram";
import { diagrams } from "@/lib/content/diagrams";
import { DeepDiveBack } from "@/components/layout/deep-dive-back";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dd = deepDiveBySlug(slug);
  if (!dd) return { title: "Case File" };
  const title = `${dd.title} - Case File`;
  const url = `${site.url}/deep-dives/${dd.slug}`;
  return {
    title,
    description: dd.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: dd.tagline,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dd.tagline,
    },
  };
}

function statusColor(status: string) {
  const s = status.toLowerCase();
  if (s === "shipped") return "text-online";
  if (s === "hardening") return "text-warn";
  return "text-accent";
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </Reveal>
  );
}

/**
 * Splits genuine metrics (big-number cards) from qualitative facts (labelled
 * rows) so a phrase like "Ground truth" never masquerades as a hard number.
 */
function ResultsGrid({
  results,
  note,
}: {
  results: { value: string; label: string; kind?: "metric" | "fact" }[];
  note?: string;
}) {
  const metrics = results.filter((r) => r.kind !== "fact");
  const facts = results.filter((r) => r.kind === "fact");

  return (
    <div className="space-y-4">
      {metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {metrics.map((r) => (
            <div key={r.label} className="rounded-xl border border-border bg-surface/40 p-4">
              <dt className="text-2xl font-semibold text-foreground">{r.value}</dt>
              <dd className="mt-1 text-xs text-subtle">{r.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {facts.length > 0 && (
        <ul className="space-y-2">
          {facts.map((r) => (
            <li
              key={r.label}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-border bg-surface/20 px-4 py-2.5"
            >
              <span className="text-sm font-semibold text-foreground">{r.value}</span>
              <span className="text-sm text-muted">{r.label}</span>
            </li>
          ))}
        </ul>
      )}

      {note && (
        <p className="border-l-2 border-border-strong pl-3 text-xs leading-relaxed text-subtle">
          {note}
        </p>
      )}
    </div>
  );
}

export default async function DeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dd = deepDiveBySlug(slug);
  if (!dd) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: dd.title,
    description: dd.tagline,
    url: `${site.url}/deep-dives/${dd.slug}`,
    author: { "@type": "Person", name: site.person, url: site.url },
    keywords: dd.facts.stack.join(", "),
    about: dd.facts.org,
  };

  return (
    <SectionShell id={dd.slug} className="max-w-3xl pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DeepDiveBack slug={dd.slug} />

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
        Case File
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{dd.title}</h1>
      <p className="mt-3 text-lg text-muted">{dd.tagline}</p>

      {/* Quick-facts strip: gives context to anyone landing here from a shared
          link, without having to bounce back to the timeline. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
        <span className="text-muted">{dd.facts.org}</span>
        <span className="text-subtle">/</span>
        <span className="text-subtle">{dd.facts.period}</span>
        <span className="text-subtle">/</span>
        <span className={`inline-flex items-center gap-1.5 ${statusColor(dd.facts.status)}`}>
          <span className="size-1.5 rounded-full bg-current" />
          {dd.facts.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {dd.facts.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-border-strong bg-surface/40 px-2 py-0.5 font-mono text-[0.7rem] text-muted"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <Block title="My contribution">
          {dd.contribution ? (
            <p className="text-muted">{dd.contribution}</p>
          ) : (
            <Placeholder
              node="contribution"
              label="Personal contribution vs. the team - pending."
            />
          )}
        </Block>

        <Block title="Problem">
          <p className="text-muted">{dd.problem}</p>
        </Block>

        <Block title="Constraints">
          <ul className="space-y-2">
            {dd.constraints.map((c) => (
              <li key={c} className="flex gap-3 text-muted">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Architecture">
          <div className="grid gap-4 sm:grid-cols-2">
            {dd.architecture.map((a) => (
              <div key={a.title} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm text-muted">{a.body}</p>
              </div>
            ))}
          </div>
        </Block>

        {diagrams[dd.slug] && (
          <Block title="How it flows">
            <ArchitectureDiagram diagram={diagrams[dd.slug]} />
          </Block>
        )}

        {dd.slug === "agent-apis" && <ApiCatalog />}

        {dd.gallery && dd.gallery.length > 0 && (
          <Block title="Product screens">
            <div className="grid gap-5 sm:grid-cols-2">
              {dd.gallery.map((g) => (
                <figure
                  key={g.src}
                  className="overflow-hidden rounded-xl border border-border bg-surface/40"
                >
                  {/* Real product screenshot; avif, small, no optimization needed. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full border-b border-border bg-background-elevated object-cover"
                  />
                  <figcaption className="p-4 text-xs text-subtle">
                    {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Block>
        )}

        <Block title="Results">
          <ResultsGrid results={dd.results} note={dd.resultsNote} />
        </Block>

        <Block title="Technical decisions & tradeoffs">
          <div className="space-y-4">
            {dd.tradeoffs.map((t) => (
              <div key={t.decision} className="rounded-xl border border-border bg-surface/40 p-5">
                <p className="text-sm font-semibold text-foreground">{t.decision}</p>
                <p className="mt-1 text-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    chose:
                  </span>{" "}
                  <span className="text-foreground">{t.chose}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{t.why}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Challenges / what was hard">
          {dd.challenges ? (
            <ul className="space-y-2">
              {dd.challenges.map((c) => (
                <li key={c} className="flex gap-3 text-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn" />
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder
              node="challenges"
              label="Deeper engineering war-stories (what broke, what was tried first, what changed) - pending."
            />
          )}
        </Block>

        <Block title="Lessons learned">
          {dd.lessons ? (
            <ul className="space-y-2">
              {dd.lessons.map((l) => (
                <li key={l} className="flex gap-3 text-muted">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {l}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder
              node="lessons"
              label="2-4 real lessons per project (what surprised me / what I'd do differently) - pending."
            />
          )}
        </Block>

        <div className="border-t border-border pt-8">
          <Link href="/system-design" className="text-sm font-medium text-accent hover:underline">
            How I approach system design generally →
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
