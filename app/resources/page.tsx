import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { SectionShell } from "@/components/layout/section-shell";
import { BackHome } from "@/components/layout/back-home";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Preview and download Bilal Zahid's resume - LLM Infrastructure & full-stack engineer who architected training and evaluation infrastructure behind Google's Gemini.",
};

export default function ResourcesPage() {
  return (
    <SectionShell
      id="resources"
      eyebrow="Résumé"
      title="Read the one-page story, or take the PDF"
      className="pt-28"
      back={<BackHome />}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <a
          href={site.resume}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast shadow-[0_0_28px_var(--accent-glow)] transition-opacity hover:opacity-90"
        >
          <Download className="size-4" />
          Download PDF
        </a>
        <a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ExternalLink className="size-4" />
          Open in new tab
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background-elevated">
        <object
          data={`${site.resume}#view=FitH`}
          type="application/pdf"
          className="h-[80vh] min-h-[560px] w-full"
          aria-label="Bilal Zahid resume preview"
        >
          <div className="flex h-64 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted">
            <p>Your browser can&apos;t display the PDF inline.</p>
            <a
              href={site.resume}
              download
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <Download className="size-4" /> Download the resume instead
            </a>
          </div>
        </object>
      </div>

      <p className="mt-4 text-xs text-subtle">
        Master resume · compiled from the LaTeX source. Role-tailored variants
        (AI Infrastructure · Applied AI · Backend · Europe · US) coming next.
      </p>
    </SectionShell>
  );
}
