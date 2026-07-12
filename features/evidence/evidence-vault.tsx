import { Reveal } from "@/components/animations/reveal";
import { evidence } from "@/lib/content/evidence";

const kindLabel: Record<string, string> = {
  education: "education",
  honor: "honor",
  recommendation: "recommendation",
};

/**
 * S6 Evidence Vault. Renders the verifiable claims we have (education, honors,
 * recommendations). Every card carries a context caption - no bare titles.
 */
export function EvidenceVault() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {evidence.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-surface/40 p-5">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                {kindLabel[item.kind]}
              </span>
              <h3 className="mt-1.5 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              {item.quote ? (
                <blockquote className="mt-2 text-sm italic text-muted">
                  “{item.quote}”
                </blockquote>
              ) : null}
              <p className="mt-2 text-sm text-muted">{item.context}</p>
              {item.attribution && (
                <p className="mt-2 font-mono text-xs text-subtle">
                  - {item.attribution}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
