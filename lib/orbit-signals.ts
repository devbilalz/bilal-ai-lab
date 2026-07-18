import type { LocalWeatherStatus } from "@/lib/local-weather";
import { phaseMeta, type ResolvedTheme, type ThemeMode, type TimePhase } from "@/lib/theme-time";

export type OrbitZone =
  | "context"
  | "weather"
  | "system-map"
  | "hero-input"
  | "hero-send"
  | "model-select"
  | "section-rail"
  | "mission-control"
  | "metrics"
  | "timeline"
  | "skills"
  | "principles"
  | "beyond"
  | "evidence"
  | "resources"
  | "resource-download"
  | "resource-open"
  | "deep-dives"
  | "deep-dive-card"
  | "case-file"
  | "system-design"
  | "system-design-proof"
  | "contact"
  | "footer-links";

export interface OrbitContext {
  section: string | null;
  zone: OrbitZone | null;
  mode: ThemeMode;
  phase: TimePhase;
  resolvedTheme: ResolvedTheme;
  sunProgress: number;
  weatherStatus: LocalWeatherStatus;
  hasWeather: boolean;
  selectedProject?: string | null;
  hint?: string | null;
  pathname?: string | null;
}

const sectionMessages: Record<string, string> = {
  top: "ask the console",
  "mission-control": "trace the system",
  metrics: "impact signal",
  timeline: "growth curve",
  skills: "capability cluster",
  principles: "guardrails matter",
  beyond: "human signal",
  evidence: "proof beats claims",
  contact: "channel open",
};

const zoneMessages: Record<OrbitZone, string> = {
  context: "sky controls",
  weather: "local signal",
  "system-map": "route map",
  "hero-input": "auto-typed prompt",
  "hero-send": "run the question",
  "model-select": "switch the lens",
  "section-rail": "jump anywhere",
  "mission-control": "trace this module",
  metrics: "scale marker",
  timeline: "growth curve",
  skills: "capability cluster",
  principles: "decision rule",
  beyond: "low-noise channel",
  evidence: "proof node",
  resources: "open the kit",
  "resource-download": "take the PDF",
  "resource-open": "open in a tab",
  "deep-dives": "browse case files",
  "deep-dive-card": "open this case",
  "case-file": "inside a case file",
  "system-design": "how I design",
  "system-design-proof": "see it live",
  contact: "channel open",
  "footer-links": "open channel",
};

function pageMessage(path: string): string {
  if (path.startsWith("/deep-dives/")) return "inside a case file";
  if (path === "/deep-dives") return "browse the case files";
  if (path === "/resources") return "grab the résumé";
  if (path === "/system-design") return "how I design systems";
  return "explore the runtime";
}

export function resolveOrbitMessage(context: OrbitContext): string {
  if (context.hint) return context.hint;

  if (context.selectedProject) {
    return "trace locked";
  }

  if (context.zone) return zoneMessages[context.zone] ?? "on it";

  const path = context.pathname ?? "/";
  if (path !== "/") {
    return pageMessage(path);
  }

  if (context.section && sectionMessages[context.section]) {
    return sectionMessages[context.section];
  }

  if (context.mode === "auto") {
    const phase = phaseMeta[context.phase];
    return `${phase.shortLabel.toLowerCase()} sky`;
  }

  if (context.resolvedTheme === "dark") {
    return "night field";
  }

  return "runtime ready";
}
