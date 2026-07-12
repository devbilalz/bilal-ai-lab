import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "@/components/animations/reveal";
import { HeroConstellation } from "./hero-constellation";
import { WhoamiReveal } from "./whoami-reveal";

const credibility = [
  "Google Gemini",
  `${site.yearsExperience} Years`,
  "Enterprise SaaS",
  "Healthcare",
  "AI Infrastructure",
];

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
      <WhoamiReveal />

      <div className="relative mt-5">
        <HeroConstellation />
        <Reveal delay={0.45}>
          <h1 className="name-sheen relative text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            {site.person}
          </h1>
        </Reveal>
      </div>

      <Reveal delay={0.6}>
        <p className="mt-6 text-balance font-mono text-sm uppercase tracking-[0.18em] text-accent sm:text-base">
          {site.tagline}
        </p>
      </Reveal>

      <Reveal delay={0.7}>
        <p className="mt-6 max-w-2xl text-balance text-lg text-muted sm:text-xl">
          I build the infrastructure that makes large language models reliable -
          the training pipelines, simulation environments, and evaluation
          systems behind{" "}
          <span className="font-semibold text-foreground [text-shadow:0_0_24px_var(--accent-glow)]">
            Google&apos;s Gemini
          </span>{" "}
          at Turing. {site.yearsExperience} years shipping production AI and
          full-stack platforms end-to-end.
        </p>
      </Reveal>

      <Reveal delay={0.8}>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {credibility.map((c) => (
            <li
              key={c}
              className="rounded-full border border-border-strong/70 bg-surface/40 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-widest text-subtle"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.9}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#mission-control"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            Explore My Work
          </Link>
          <Link
            href="/resources"
            className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Resume
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
