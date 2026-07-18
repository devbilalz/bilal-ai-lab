export type TimePhase = "morning" | "day" | "evening" | "night";
export type ThemeMode = "auto" | TimePhase;
export type ResolvedTheme = "dark" | "light";

export const THEME_MODE_STORAGE_KEY = "bilal-theme-mode";

export const themeModes: Array<{
  value: ThemeMode;
  label: string;
  description: string;
}> = [
  {
    value: "auto",
    label: "Context",
    description: "Resolve local signals",
  },
  {
    value: "morning",
    label: "Dawn",
    description: "Fixed sunrise state",
  },
  {
    value: "day",
    label: "Day",
    description: "Fixed high-sun state",
  },
  {
    value: "evening",
    label: "Dusk",
    description: "Fixed sunset state",
  },
  {
    value: "night",
    label: "Night",
    description: "Fixed inference field",
  },
];

export const phaseMeta: Record<
  TimePhase,
  {
    label: string;
    shortLabel: string;
    caption: string;
  }
> = {
  morning: {
    label: "Morning",
    shortLabel: "Dawn",
    caption: "soft gold",
  },
  day: {
    label: "Day",
    shortLabel: "Day",
    caption: "clear sky",
  },
  evening: {
    label: "Evening",
    shortLabel: "Dusk",
    caption: "violet fade",
  },
  night: {
    label: "Night",
    shortLabel: "Night",
    caption: "moon field",
  },
};

export function getTimePhase(date = new Date()): TimePhase {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getSolarTimePhase({
  now = new Date(),
  sunriseAt,
  sunsetAt,
}: {
  now?: Date;
  sunriseAt: Date;
  sunsetAt: Date;
}): TimePhase {
  const sunrise = sunriseAt.getTime();
  const sunset = sunsetAt.getTime();

  if (!Number.isFinite(sunrise) || !Number.isFinite(sunset) || sunrise >= sunset) {
    return getTimePhase(now);
  }

  const current = now.getTime();
  const morningEnd = sunrise + 3 * 60 * 60 * 1000;
  const eveningStart = sunset - 2 * 60 * 60 * 1000;
  const eveningEnd = sunset + 60 * 60 * 1000;

  if (current >= sunrise && current < morningEnd) return "morning";
  if (current >= morningEnd && current < eveningStart) return "day";
  if (current >= eveningStart && current < eveningEnd) return "evening";
  return "night";
}

export function getFallbackSunProgress(date = new Date()): number {
  const hour = date.getHours() + date.getMinutes() / 60;
  const sunriseHour = 5;
  const sunsetHour = 21;
  return Math.min(1, Math.max(0, (hour - sunriseHour) / (sunsetHour - sunriseHour)));
}

export function getSolarSunProgress({
  now = new Date(),
  sunriseAt,
  sunsetAt,
}: {
  now?: Date;
  sunriseAt: Date;
  sunsetAt: Date;
}): number {
  const sunrise = sunriseAt.getTime();
  const sunset = sunsetAt.getTime();

  if (!Number.isFinite(sunrise) || !Number.isFinite(sunset) || sunrise >= sunset) {
    return getFallbackSunProgress(now);
  }

  return Math.min(1, Math.max(0, (now.getTime() - sunrise) / (sunset - sunrise)));
}

export function resolveSunProgress({
  mode,
  clockProgress,
  solarProgress,
}: {
  mode: ThemeMode;
  clockProgress: number;
  solarProgress: number | null;
}): number {
  const liveProgress = solarProgress ?? clockProgress;

  if (mode === "morning") return 0.08;
  if (mode === "evening") return 0.93;
  if (mode === "night") return 0.5;
  return liveProgress;
}

export function resolveTheme(mode: ThemeMode, phase: TimePhase): ResolvedTheme {
  const resolvedPhase = resolvePhase(mode, phase);
  return resolvedPhase === "morning" || resolvedPhase === "day" ? "light" : "dark";
}

export function resolvePhase(mode: ThemeMode, phase: TimePhase): TimePhase {
  return mode === "auto" ? phase : mode;
}
