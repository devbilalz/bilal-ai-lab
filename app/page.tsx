import { BootWow } from "@/features/hero/boot-wow";
import { Hero } from "@/features/hero/hero";
import { SectionShell } from "@/components/layout/section-shell";
import { Placeholder } from "@/components/common/placeholder";
import { MissionControl } from "@/features/mission-control/mission-control";
import { Timeline } from "@/features/timeline/timeline";
import { SkillsMap } from "@/features/skills/skills-map";
import { MetricsStrip } from "@/features/metrics/metrics-strip";
import { EvidenceVault } from "@/features/evidence/evidence-vault";
import { Principles } from "@/features/principles/principles";
import { CurrentlyBuilding } from "@/features/building/currently-building";
import { Contact } from "@/features/contact/contact";

/**
 * Home - single-scroll narrative. S1-S8 + S13 are real; S11 (Code Lab) stays an
 * honest placeholder pending repo-curation. Deep Dives / System Design / Resources
 * live on dedicated routes.
 */
export default function Home() {
  return (
    <>
      <BootWow />
      <Hero />

      <SectionShell
        id="mission-control"
        eyebrow="Mission Control"
        title="What I've built, and how it connects"
      >
        <MissionControl />
      </SectionShell>

      <SectionShell id="timeline" eyebrow="Career Path" title="How I've grown">
        <Timeline />
      </SectionShell>

      <SectionShell id="skills" eyebrow="Expertise Map" title="Where I go deep">
        <SkillsMap />
      </SectionShell>

      <SectionShell id="metrics" eyebrow="Metrics" title="Scale of the work">
        <MetricsStrip />
      </SectionShell>

      <SectionShell id="evidence" eyebrow="Evidence Vault" title="Why trust the claims">
        <EvidenceVault />
      </SectionShell>

      <SectionShell id="principles" eyebrow="Principles" title="How I think">
        <Principles />
      </SectionShell>

      <SectionShell id="building" eyebrow="Currently Building" title="Where I'm headed">
        <CurrentlyBuilding />
      </SectionShell>

      <SectionShell id="code-lab" eyebrow="Code Lab" title="Active engineering">
        <Placeholder
          node="S11"
          label="Grouped GitHub activity via build-time fetch. Awaiting repo-curation decision (which public repos to feature, or demote this section)."
        />
      </SectionShell>

      <SectionShell id="contact" eyebrow="Let's Build" title="Let's build something">
        <Contact />
      </SectionShell>
    </>
  );
}
