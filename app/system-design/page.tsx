import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { BackHome } from "@/components/layout/back-home";
import { Reveal } from "@/components/animations/reveal";

export const metadata: Metadata = {
  title: "System Design",
  description:
    "Opinionated notes on API design, database design, async workers, AI infrastructure, and scaling - how I design systems around failure first.",
};

interface DesignSection {
  title: string;
  lead: string;
  points: string[];
  examples?: string[];
  pull: string;
}

const sections: DesignSection[] = [
  {
    title: "API design",
    lead: "An API is a contract before it is code. I design the promise first - typed payloads, explicit versions, and idempotent behavior - because every other system builds its life around that contract, and for AI systems the contract is what the model actually learns.",
    points: [
      "Contracts over cleverness: strict, typed payloads that fail loudly instead of guessing.",
      "Version APIs when a product lives long enough to change, so the frontend can evolve without breaking callers.",
      "Make webhooks idempotent and replayable - a retried Stripe or QuickBooks event should never double-charge or double-file.",
      "For AI systems, generate tool schemas from the implementation so the interface a model sees can't silently drift from the code.",
    ],
    examples: [
      "Gemini function-call schemas",
      "Rails API v1/v2/v3",
      "Stripe / QuickBooks / HMRC webhooks",
    ],
    pull: "An API is not a route. It's a promise other systems build their lives around.",
  },
  {
    title: "Database design",
    lead: "The schema is where vague product language becomes something real and enforceable. I model the domain's truth first, then let privacy and change-rate shape the boundaries - because the shape of the data decides what the rest of the system can and can't do.",
    points: [
      "Model domain truth first; the schema is the source of reality, not an afterthought of the ORM.",
      "Represent volatile domains (tax jurisdictions) as handlers and domain entities, so adding one doesn't rewrite the engine.",
      "Separate sensitive data (healthcare matching) around privacy needs, so protection is structural rather than bolted on.",
      "For synthetic worlds, project generated records into schema-exact databases so they're indistinguishable from a real account at the API level.",
    ],
    examples: [
      "Jurisdiction handler pattern",
      "HIPAA-scoped matching data",
      "Schema-exact world projection",
    ],
    pull: "The schema is where vague product language becomes reality.",
  },
  {
    title: "Async & workers",
    lead: "If a user has to wait for an integration to think, the architecture is leaking. Long-running work belongs off the request path - and I pick the simplest tool that's durable enough for the failure modes that actually matter.",
    points: [
      "Keep filings, syncs, FX rates, backfills, and generation out of the request path with workers and cron.",
      "Use direct-to-object-storage for uploads and artifacts so media never routes through app servers.",
      "Know when simple background tasks are enough and when durable queues are worth the operational cost.",
      "Scale workers on their own schedule, separate from the API that serves users.",
    ],
    examples: [
      "Kubernetes workers + CronJobs (tax platform)",
      "Rails Sidekiq jobs",
      "Airbyte Lambda pipeline",
      "FastAPI BackgroundTasks",
    ],
    pull: "If a user has to wait for your integration to think, the architecture is leaking.",
  },
  {
    title: "AI infrastructure",
    lead: "AI systems fail quietly when the surrounding infrastructure is vague. My bias is to make the environment measurable before judging the model - validate the contracts, control the world, and turn every evaluation into signal the training loop can use.",
    points: [
      "Validate tool contracts before training, so a broken schema never becomes learned model behavior.",
      "Simulate live systems for safety, determinism, and reproducibility instead of testing against production APIs.",
      "Generate synthetic worlds and their grading rubrics together, so the data is gradeable by construction.",
      "Evaluate robustness under degraded conditions, and use disciplined human labels as ground truth for agent trajectories.",
    ],
    examples: [
      "6-layer schema validation",
      "Deterministic tool-use gym",
      "World + rubric generation",
      "Robustness mutation harness",
    ],
    pull: "AI systems fail quietly when the surrounding infrastructure is vague, so I make the environment measurable before I judge the model.",
  },
  {
    title: "Scaling & reliability",
    lead: "Scaling isn't only about traffic. Sometimes it's more jurisdictions, more tools, more integrations, and more ways to be wrong. I design around failure modes first and keep outputs defensible, because a system I can't explain is a system I can't trust.",
    points: [
      "Scale workers independently from APIs so a backfill spike never degrades user requests.",
      "Design by failure mode: name what can lie, retry, die halfway, or grade the wrong thing - then bound it.",
      "Keep provenance and logs wherever output has to be trusted, so any result can be traced back to its source.",
      "Avoid public claims that can't be defended; a metric you can't explain is a liability, not proof.",
    ],
    examples: [
      "Independent worker scaling",
      "Per-record provenance",
      "Sim2real parity checks",
    ],
    pull: "Scaling is not only more traffic. Sometimes it's more jurisdictions, more tools, more edge cases, and more ways to be wrong.",
  },
];

export default function SystemDesignPage() {
  return (
    <SectionShell
      id="system-design"
      eyebrow="System Design"
      title="How I approach system design"
      className="pt-28"
      back={<BackHome />}
    >
      <Reveal>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">
          I don&apos;t start system design with boxes. I start with what can go
          wrong: the API that lies, the model that guesses, the webhook that
          retries twice, the worker that dies halfway through a filing, the eval
          that blames the model when the tool schema was broken. Good systems
          make those failures visible, bounded, and recoverable - and everything
          below follows from that one bias.
        </p>
      </Reveal>

      <div className="mt-14 space-y-12">
        {sections.map((s, i) => (
          <Reveal key={s.title}>
            <div className="border-t border-border pt-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {s.title}
                </h2>
              </div>

              <p className="mt-4 max-w-3xl leading-relaxed text-muted">
                {s.lead}
              </p>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>

              {s.examples && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.examples.map((e) => (
                    <span
                      key={e}
                      className="rounded-md border border-border bg-surface/40 px-2.5 py-1 font-mono text-xs text-subtle"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}

              <blockquote className="mt-6 border-l-2 border-accent pl-4 text-base italic text-foreground">
                {s.pull}
              </blockquote>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 rounded-2xl border border-accent/30 bg-accent/[0.06] p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Closing principle
          </p>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-foreground">
            The systems I trust are not the ones that never fail. They&apos;re
            the ones that make failure small, inspectable, and useful enough to
            improve the next run.
          </p>
          <Link
            href="/#mission-control"
            className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
          >
            See these principles in the systems I&apos;ve built &rarr;
          </Link>
        </div>
      </Reveal>
    </SectionShell>
  );
}
