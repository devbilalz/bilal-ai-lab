import type { Metadata } from "next";
import { SectionShell } from "@/components/layout/section-shell";
import { BackHome } from "@/components/layout/back-home";
import { Placeholder } from "@/components/common/placeholder";

export const metadata: Metadata = {
  title: "System Design",
  description:
    "Opinionated notes on API design, database design, scaling, event-driven architecture, LLM evaluation, and AI infrastructure.",
};

export default function SystemDesignPage() {
  return (
    <SectionShell
      id="system-design"
      eyebrow="System Design"
      title="How I approach system design"
      className="pt-28"
      back={<BackHome />}
    >
      <Placeholder
        node="S10.1"
        label="Notes on API design, DB design, scaling, event-driven architecture, LLM evaluation, AI infra - draftable, pending review with Bilal."
      />
    </SectionShell>
  );
}
