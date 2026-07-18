import { BootWow } from "@/features/hero/boot-wow";
import { Hero } from "@/features/hero/hero";
import { SectionShell } from "@/components/layout/section-shell";
import { MissionControl } from "@/features/mission-control/mission-control";
import { Timeline } from "@/features/timeline/timeline";
import { SkillsMap } from "@/features/skills/skills-map";
import { MetricsStrip } from "@/features/metrics/metrics-strip";
import { EvidenceVault } from "@/features/evidence/evidence-vault";
import { Principles } from "@/features/principles/principles";
import { BeyondTheCode } from "@/features/beyond/beyond";

/**
 * Home - single-scroll narrative. "Under the Hood" maps the Gemini Gym pipeline
 * and where the work is headed; metrics quantify the outcomes before the growth
 * arc; principles fold in the hard-won lessons; Evidence closes the case.
 * Contact lives in the footer. Case Files / System Design / Resources live on
 * dedicated routes.
 *
 * `GUTTER` leaves a right gutter on each section so the fixed section rail
 * (shown at xl+) never overlaps content.
 */
const GUTTER = "xl:pr-20";

export default function Home() {
  return (
    <>
      <BootWow />
      <Hero />

      <SectionShell
        id="mission-control"
        eyebrow="Under the Hood"
        title="What I've built, and where it's headed"
        className={GUTTER}
        orbitZone="mission-control"
        orbitHint="trace the system"
        orbitPlace="left"
      >
        <MissionControl />
      </SectionShell>

      <SectionShell
        id="metrics"
        eyebrow="Metrics"
        title="The impact, in numbers"
        className={GUTTER}
        orbitZone="metrics"
        orbitHint="impact signal"
        orbitPlace="right"
      >
        <MetricsStrip />
      </SectionShell>

      <SectionShell
        id="timeline"
        eyebrow="Trajectory"
        title="How I've grown"
        className={GUTTER}
        orbitZone="timeline"
        orbitHint="growth curve"
        orbitPlace="left"
      >
        <Timeline />
      </SectionShell>

      <SectionShell
        id="skills"
        eyebrow="Expertise Map"
        title="Where I specialize"
        className={GUTTER}
        orbitZone="skills"
        orbitHint="capability cluster"
        orbitPlace="right"
      >
        <SkillsMap />
      </SectionShell>

      <SectionShell
        id="principles"
        eyebrow="Principles"
        title="How I think"
        className={GUTTER}
        orbitZone="principles"
        orbitHint="decision rule"
        orbitPlace="left"
      >
        <Principles />
      </SectionShell>

      <SectionShell
        id="beyond"
        eyebrow="Beyond the code"
        title="Off the clock"
        className={GUTTER}
        orbitZone="beyond"
        orbitHint="human signal"
        orbitPlace="right"
      >
        <BeyondTheCode />
      </SectionShell>

      <SectionShell
        id="evidence"
        eyebrow="Feedback & Honors"
        title="What others say"
        className={GUTTER}
        orbitZone="evidence"
        orbitHint="proof beats claims"
        orbitPlace="left"
      >
        <EvidenceVault />
      </SectionShell>
    </>
  );
}
