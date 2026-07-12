import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/animations/reveal";
import { Placeholder } from "@/components/common/placeholder";
import { deepDives, deepDiveBySlug } from "@/lib/content/deep-dives";
import { ApiCatalog } from "@/features/deep-dive/api-catalog";
import { DeepDiveBack } from "@/components/layout/deep-dive-back";

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
  if (!dd) return { title: "Deep Dive" };
  return { title: `${dd.title} - Deep Dive`, description: dd.tagline };
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

export default async function DeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dd = deepDiveBySlug(slug);
  if (!dd) notFound();

  return (
    <SectionShell id={dd.slug} className="max-w-3xl pt-28">
      <DeepDiveBack slug={dd.slug} />

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
        Deep Dive
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{dd.title}</h1>
      <p className="mt-3 text-lg text-muted">{dd.tagline}</p>

      <div className="mt-12 space-y-8">
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
              node="S9.challenges"
              label="Deeper engineering war-stories (what broke, what was tried first, what changed) - to capture from Bilal, not invented."
            />
          )}
        </Block>

        <Block title="Results">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {dd.results.map((r) => (
              <div key={r.label} className="rounded-xl border border-border bg-surface/40 p-4">
                <dt className="text-2xl font-semibold text-foreground">{r.value}</dt>
                <dd className="mt-1 text-xs text-subtle">{r.label}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="My contribution">
          {dd.contribution ? (
            <p className="text-muted">{dd.contribution}</p>
          ) : (
            <Placeholder
              node="S9.contribution"
              label="What Bilal personally built vs. the team - to be drawn honestly with Bilal before this ships publicly."
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
              node="S9.lessons"
              label="2-4 real lessons per project (what surprised me / what I'd do differently) - to capture from Bilal."
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
