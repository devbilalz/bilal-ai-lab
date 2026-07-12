import { Reveal } from "@/components/animations/reveal";

interface Note {
  tag: string;
  title: string;
  body: string;
}

const notes: Note[] = [
  {
    tag: "AI infra",
    title: "Validation beats prompt polish",
    body: "The highest-leverage fix in an AI system usually isn't a better prompt - it's a stricter contract. A tool schema the model can misread teaches bad habits before training even starts, so I validate contracts at the source. The 6-layer validator behind the Gemini Gym caught schema defects Google's own SDK silently accepted.",
  },
  {
    tag: "Evaluation",
    title: "How to know a simulator is trustworthy",
    body: "A mock that merely looks close enough is a liability - the model learns the mock, not the world. The real test is sim2real parity: run the same calls against the simulator and the live service and prove the behavior matches, including odd query syntax, pagination, and error states. Only then is a simulator infrastructure rather than a demo.",
  },
  {
    tag: "Backend",
    title: "When BackgroundTasks stop being enough",
    body: "In-process background tasks are perfect early on and quietly dangerous later: they vanish on a crash and can't be retried or observed. The signal to move to durable workers and cron is when the work becomes money or compliance - filings, backfills, historical syncs - where losing a job silently is unacceptable. The tax platform's Kubernetes workers and CronJobs existed for exactly that reason.",
  },
  {
    tag: "Domain modeling",
    title: "What tax compliance taught me about schemas",
    body: "Indirect-tax rules change constantly and vary by jurisdiction, so one giant rules file would rot within a quarter. Modeling each jurisdiction as a handler kept the engine open to new regions without a rewrite, and separated volatile domain logic from stable platform code. The lesson generalizes: put the parts most likely to change behind the cleanest boundary.",
  },
  {
    tag: "Applied AI",
    title: "Why AI suggestions need source quotes",
    body: "A CRM suggestion is useless if a sales rep can't see where it came from. Grounding every proposed field update in the exact transcript quote turned a black-box model output into something a human could trust, correct, and feed back into the loop. Source-grounding is what separates an AI feature people adopt from one they quietly disable.",
  },
];

export function EngineeringNotes() {
  return (
    <div>
      <Reveal>
        <p className="max-w-2xl text-muted">
          Not every serious system can be public. These are short, sharp notes
          from systems I&apos;ve built - what broke, what scaled, and what I
          would design differently now.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {notes.map((n) => (
          <Reveal key={n.title}>
            <article className="group h-full rounded-2xl border border-border bg-surface/40 p-5 transition-colors hover:border-border-strong sm:p-6">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                {n.tag}
              </span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {n.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{n.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
