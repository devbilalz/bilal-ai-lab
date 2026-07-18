"use client";

import { Clock3 } from "lucide-react";
import { useThemeRuntime } from "@/components/providers/theme-provider";

const showTimeSimulation = process.env.NODE_ENV !== "production";

export function TimeSimulationToggle() {
  const { simulationEnabled, simulatedTime, toggleTimeSimulation } = useThemeRuntime();

  if (!showTimeSimulation) return null;

  const label =
    simulationEnabled && simulatedTime
      ? simulatedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Sim";

  return (
    <button
      type="button"
      onClick={toggleTimeSimulation}
      aria-pressed={simulationEnabled}
      title="Temporary test: advance app time by one hour every second"
      className="hidden items-center gap-2 rounded-full border border-border-strong bg-background/55 px-3 py-1.5 text-sm text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-foreground lg:inline-flex"
    >
      <Clock3 className="size-3.5 text-accent" aria-hidden />
      <span className="font-mono text-[0.72rem]">{label}</span>
    </button>
  );
}
