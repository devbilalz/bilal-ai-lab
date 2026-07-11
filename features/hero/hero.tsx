import Link from "next/link";
import { site } from "@/lib/site";
import { TerminalText } from "@/components/animations/terminal-text";
import { Reveal } from "@/components/animations/reveal";

/**
 * S1.3 / S1.4 - Hero. Credibility stated in plain text FIRST (name, title,
 * Gemini, years, stack), styled with a `whoami →` terminal wrapper.
 * The boot sequence (S1.1) and knowledge-graph "wow" moment (S1.2) mount
 * above this in a later step; the hero must stand on its own without them.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <TerminalText
        text={`whoami → ${site.person}`}
        prompt="$"
        className="text-sm text-muted"
      />

      <Reveal delay={0.15}>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          {site.title}
        </h1>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-5 max-w-2xl text-balance text-lg text-muted sm:text-xl">
          Architected the training and evaluation infrastructure behind{" "}
          <span className="font-semibold text-foreground [text-shadow:0_0_24px_var(--accent-glow)]">
            Google&apos;s Gemini
          </span>{" "}
          at Turing. {site.yearsExperience} years building production AI and
          full-stack systems end-to-end.
        </p>
      </Reveal>

      <Reveal delay={0.35}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#mission-control"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            View the work
          </Link>
          <Link
            href="/resources"
            className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Résumé
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
