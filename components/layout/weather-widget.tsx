"use client";

import { CloudSun, LocateFixed } from "lucide-react";
import { useThemeRuntime } from "@/components/providers/theme-provider";

export function WeatherWidget() {
  const { weather, weatherStatus, requestLocalWeather } = useThemeRuntime();
  const canRequestWeather =
    weatherStatus === "idle" ||
    weatherStatus === "needs-permission" ||
    weatherStatus === "denied" ||
    weatherStatus === "error";

  if (weather) {
    return (
      <div
        aria-label={`Local context signal: about ${Math.round(weather.temperatureC)} degrees Celsius, ${weather.condition}`}
        className="hidden items-center gap-2 rounded-full border border-border-strong bg-background/55 px-3 py-1.5 text-sm text-foreground backdrop-blur-md md:inline-flex"
        title="Local signal for the Context Engine"
        data-orbit-zone="weather"
        data-orbit-hint="local signal"
        data-orbit-place="left"
      >
        <CloudSun className="size-3.5 text-accent" aria-hidden />
        <span className="font-mono text-[0.72rem]">
          ≈{Math.round(weather.temperatureC)}°C
        </span>
        <span className="max-w-24 truncate border-l border-border pl-2 text-xs text-muted">
          {weather.condition}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={requestLocalWeather}
      disabled={!canRequestWeather}
      className="hidden items-center gap-2 rounded-full border border-border-strong bg-background/55 px-3 py-1.5 text-sm text-muted backdrop-blur-md transition-colors enabled:hover:border-accent enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70 md:inline-flex"
      data-orbit-zone="weather"
      data-orbit-hint="enable local signal"
      data-orbit-place="left"
      title={
        weatherStatus === "denied"
          ? "Location is blocked in browser settings"
          : "Enable local context signal"
      }
    >
      <LocateFixed className="size-3.5 text-accent" aria-hidden />
      <span className="font-mono text-[0.72rem]">
        {weatherStatus === "loading"
          ? "Weather..."
          : weatherStatus === "unsupported"
            ? "No weather"
            : weatherStatus === "denied"
              ? "Blocked"
              : "Signal"}
      </span>
    </button>
  );
}
