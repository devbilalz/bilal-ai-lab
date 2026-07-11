import { Reveal } from "@/components/animations/reveal";
import { Placeholder } from "@/components/common/placeholder";
import { principles, personalInterest } from "@/lib/content/principles";

/**
 * S7 Engineering Principles. Deliberately the calmest section - subtle fade only.
 * S7.2 personal-interest line renders a Placeholder until Bilal supplies a real one.
 */
export function Principles() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="rounded-xl border border-border bg-surface/40 p-5">
              <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {personalInterest ? (
        <p className="text-sm text-muted">{personalInterest}</p>
      ) : (
        <Placeholder
          node="S7.2"
          label="One real personal-interest line - awaiting from Bilal."
        />
      )}
    </div>
  );
}
